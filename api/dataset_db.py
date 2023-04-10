import json
import os
import sqlite3

from helpers import dhash, get_file_extension

EDIFICE_DB = "_edifice.db"


def get_db_file(dataset_path):
    return os.path.join(dataset_path, EDIFICE_DB)


def conf_db(dataset_path):
    con = sqlite3.connect(get_db_file(dataset_path))

    cur = con.cursor()
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

    con.commit()
    cur.close()

    return {
        'hash': hash,
        'prompt': prompt,
        'tags': tags is None if [] else json.loads(json.dumps([dict(ix) for ix in tags]))
    }


def add_interrogator(dataset_path, name, tags):
    con = sqlite3.connect(get_db_file(dataset_path))
    cur = con.cursor()

    cur.execute("INSERT OR IGNORE INTO interrogator (name) VALUES (?)", [name])

    cur.execute("SELECT id FROM interrogator WHERE name = ?", [name])
    interrogator_id = str(cur.fetchone()[0])

    tags_tuple = [(t,) for t in tags]
    cur.executemany(
        "INSERT OR IGNORE INTO interrogator_tags (it_id,tag) VALUES ("+interrogator_id+", ?)", tags_tuple)

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
