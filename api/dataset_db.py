import json
import os
import sqlite3

from helpers import dhash, get_file_extension

EDIFICE_DB = "_edifice.db"


def get_db_file(dataset_path):
    return os.path.join(dataset_path, EDIFICE_DB)


def conf_db(dataset_path):
    # if database already exists
    if os.path.isfile(get_db_file(dataset_path)):
        return

    con = sqlite3.connect(get_db_file(dataset_path))

    cur = con.cursor()
    cur.execute('''CREATE TABLE dataset_settings(
        id TEXT UNIQUE NOT NULL,
        name TEXT UNIQUE NOT NULL,
        path TEXT UNIQUE NOT NULL,
        isRecursive INTEGER NOT NULL,
        includeExtRegex TEXT NOT NULL,
        excludeDirRegex TEXT NOT NULL,
        idealWidth INTEGER NOT NULL,
        idealHeight INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)''')

    cur.execute('''CREATE TABLE file(
        hash TEXT PRIMARY KEY UNIQUE NOT NULL,
        path TEXT UNIQUE NOT NULL,
        extension TEXT NOT NULL,
        prompt TEXT)''')

    cur.execute('''CREATE TABLE interrogator(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL)''')

    cur.execute('''CREATE TABLE interrogator_tags(
        tag TEXT NOT NULL,
        it_id INTEGER NOT NULL,
        ct_id1 TEXT,
        ct_id2 TEXT,
        ct_id3 TEXT,
        FOREIGN KEY (ct_id1)
            REFERENCES custom_tags (id)
        FOREIGN KEY (ct_id2)
            REFERENCES custom_tags (id)
        FOREIGN KEY (ct_id3)
            REFERENCES custom_tags (id)
        PRIMARY KEY (tag, it_id)
        FOREIGN KEY (it_id)
            REFERENCES interrogator (id))''')

    cur.execute('''CREATE TABLE file_tags(
        value REAL NOT NULL,
        it_tag INTEGER NOT NULL,
        it_id INTEGER NOT NULL,
        file_hash TEXT NOT NULL,
        FOREIGN KEY (it_tag)
            REFERENCES interrogator_tags (tag)
        FOREIGN KEY (it_id)
            REFERENCES interrogator (id)
        FOREIGN KEY (file_hash)
            REFERENCES file (hash))''')
    cur.execute(
        'CREATE UNIQUE INDEX ft_index ON file_tags(file_hash, it_id, it_tag)')

    cur.execute('''CREATE TABLE custom_tags(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT UNIQUE NOT NULL,
        description TEXT UNIQUE NOT NULL,
        parent_id TEXT,
        FOREIGN KEY (parent_id)
            REFERENCES custom_tags (id))''')

    cur.close()


def get_file_info(dataset_path, hash):
    con = sqlite3.connect(get_db_file(dataset_path))
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    cur.execute('''
    SELECT
        interrogator.name as interrogatorName,
        file_tags.value as value,
        file_tags.it_tag as tag
    FROM file INNER JOIN file_tags
        ON file.hash = file_tags.file_hash
        INNER JOIN interrogator
        ON interrogator.id = file_tags.it_id
    WHERE file.hash=?''', [hash])
    tags = cur.fetchall()

    cur.execute('''
    SELECT DISTINCT
        custom_tags.id as id,
        custom_tags.name as name
    FROM file INNER JOIN file_tags
        ON file.hash = file_tags.file_hash
        INNER JOIN interrogator_tags
        ON interrogator_tags.it_id = file_tags.it_id AND interrogator_tags.tag = file_tags.it_tag
        INNER JOIN custom_tags
        ON custom_tags.id = interrogator_tags.ct_id1 OR custom_tags.id = interrogator_tags.ct_id2 OR custom_tags.id = interrogator_tags.ct_id3
    WHERE file.hash=?''', [hash])
    custom_tags = cur.fetchall()

    cur.execute('''
    SELECT
        file.prompt
    FROM file
    WHERE file.hash=?''', [hash])
    # TODO : add smart crop
    prompt_crop = cur.fetchone()
    if not prompt_crop:
        prompt = None
    else:
        prompt = prompt_crop[0]

    cur.close()

    return {
        'hash': hash,
        'prompt': prompt,
        'tags': tags is None if [] else json.loads(json.dumps([dict(ix) for ix in tags])),
        'customTags': custom_tags is None if [] else json.loads(json.dumps([dict(ix) for ix in custom_tags]))
    }


def add_interrogator(dataset_path, name, tags):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute("INSERT OR IGNORE INTO interrogator (name) VALUES (?)", [name])

    cur.execute("SELECT id FROM interrogator WHERE name = ?", [name])
    interrogator_id = str(cur.fetchone()[0])

    tags_tuple = [(interrogator_id, t,) for t in tags]
    cur.executemany(
        "INSERT OR IGNORE INTO interrogator_tags (it_id,tag) VALUES (?, ?)", tags_tuple)

    con.commit()
    cur.close()


def add_file(dataset_path, file_path):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute("INSERT OR IGNORE INTO file (hash,path,extension) VALUES (?, ?, ?)", [dhash(
        file_path), file_path, get_file_extension(file_path)])

    con.commit()
    cur.close()


def add_file_with_tags(dataset_path, file_path, interrogator, tags_score):
    file_hash = dhash(file_path)

    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute("SELECT id FROM interrogator WHERE name = ?", [interrogator])
    interrogator_id = str(cur.fetchone()[0])

    cur.execute("INSERT OR IGNORE INTO file (hash,path,extension) VALUES (?, ?, ?)",
                [file_hash, file_path, get_file_extension(file_path)])

    data = [(e[0], float(e[1]), interrogator_id, file_hash)
            for e in tags_score]
    cur.executemany(
        "INSERT OR IGNORE INTO file_tags (it_tag,value,it_id,file_hash) VALUES (?, ?, ?, ?)", data)

    con.commit()
    cur.close()


def get_custom_tags(dataset_path: str):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute('SELECT id, name, description, parent_id FROM custom_tags')
    tags = cur.fetchall()
    tag_dict = {}
    root_tags = []
    for tag in tags:
        tag_id, name, description, parent_id = tag
        tag_dict[tag_id] = {'id': tag_id, 'name': name,
                            'description': description, 'parentId': parent_id, 'childrens': []}
        if not parent_id:
            root_tags.append(tag_dict[tag_id])
        else:
            tag_dict[parent_id]['childrens'].append(tag_dict[tag_id])

    cur.close()

    return root_tags


def save_custom_tags(dataset_path: str, add: list, edit: list, remove: list[str]):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    if len(add) > 0:
        new_tags = [(t.get('id'), t.get('name'), t.get(
            'description'), t.get('parentId'),) for t in add]
        cur.executemany(
            "INSERT OR IGNORE INTO custom_tags (id,name,description,parent_id) VALUES (?, ?, ?, ?)", new_tags)
        con.commit()

    if len(edit) > 0:
        edit_tags = [(t.get('name'), t.get('description'),
                      t.get('parentId'), t.get('id'),) for t in edit]
        cur.executemany(
            "UPDATE custom_tags SET name=?, description=?, parent_id=? WHERE id=?", edit_tags)
        con.commit()

    if len(remove) > 0:
        # get list of all childrens that should be deleted with their parents
        removeIds = []
        for id in remove:
            removeIds.append((id,))
            cur.execute("SELECT id FROM custom_tags WHERE parent_id=?", (id, ))
            for e in cur.fetchall():
                removeIds.append((e[0],))

        cur.executemany("DELETE FROM custom_tags WHERE id=?", (removeIds))
        con.commit()

    cur.close()


def save_tag_matching(dataset_path: str, tag: list, match_pos: int, match_id: str):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute("SELECT id FROM interrogator WHERE name = ?",
                [tag.get('interrogatorName')])
    interrogator_id = str(cur.fetchone()[0])

    if match_pos == '3':
        cur.execute(
            "UPDATE interrogator_tags SET ct_id3=? WHERE tag=? AND it_id=?", (match_id, tag.get('tag'), interrogator_id,))
    elif match_pos == '2':
        cur.execute(
            "UPDATE interrogator_tags SET ct_id2=? WHERE tag=? AND it_id=?", (match_id, tag.get('tag'), interrogator_id,))
    else:
        cur.execute(
            "UPDATE interrogator_tags SET ct_id1=? WHERE tag=? AND it_id=?", (match_id, tag.get('tag'), interrogator_id,))

    con.commit()
    cur.close()


def clear_tag_matching(dataset_path: str, tag: list):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute("SELECT id FROM interrogator WHERE name = ?",
                [tag.get('interrogatorName')])
    interrogator_id = str(cur.fetchone()[0])

    cur.execute("UPDATE interrogator_tags SET ct_id1=NULL,ct_id2=NULL,ct_id3=NULL WHERE tag=? AND it_id=?",
                (tag.get('tag'), interrogator_id,))

    con.commit()
    cur.close()


def get_tags(dataset_path: str):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute('''
    SELECT
        it.tag as tag,
        i.name as interrogator,
        ct1.id as customTagId1,
        ct1.name as customTagName1,
        ct2.id as customTagId2,
        ct2.name as customTagName2,
        ct3.id as customTagId3,
        ct3.name as customTagName3
    FROM interrogator_tags as it
    LEFT JOIN interrogator as i ON it.it_id=i.id
    LEFT JOIN custom_tags as ct1 ON it.ct_id1=ct1.id
    LEFT JOIN custom_tags as ct2 ON it.ct_id2=ct2.id
    LEFT JOIN custom_tags as ct3 ON it.ct_id3=ct3.id
    ''')
    interrogatorTags = []
    for row in cur.fetchall():
        tag, interrogatorName, ct_id_1, ct_name_1, ct_id_2, ct_name_2, ct_id_3, ct_name_3 = row
        custom_tag_matcher_1 = None
        if ct_id_1 is not None and ct_name_1 is not None:
            custom_tag_matcher_1 = {"id": ct_id_1, "name": ct_name_1}
        custom_tag_matcher_2 = None
        if ct_id_2 is not None and ct_name_2 is not None:
            custom_tag_matcher_2 = {"id": ct_id_2, "name": ct_name_2}
        custom_tag_matcher_3 = None
        if ct_id_3 is not None and ct_name_3 is not None:
            custom_tag_matcher_3 = {"id": ct_id_3, "name": ct_name_3}
        result = {
            "interrogatorName": interrogatorName,
            "tag": tag,
            "customTagMatcher1": custom_tag_matcher_1,
            "customTagMatcher2": custom_tag_matcher_2,
            "customTagMatcher3": custom_tag_matcher_3
        }
        interrogatorTags.append(result)

    cur.execute('SELECT id, name FROM custom_tags')
    customTags = [{'id': tag[0], 'name': tag[1]} for tag in cur.fetchall()]

    cur.close()

    return {
        'interrogatorTags': interrogatorTags,
        'customTags': json.loads(json.dumps(customTags))
    }
