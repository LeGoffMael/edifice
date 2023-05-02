from flask import Flask, request, send_file, url_for
from celery import Celery
import os
from types import SimpleNamespace
import uuid

from helpers import *
import dataset_db as db
from interrogator_dd import Deepdanbooru

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)


@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    return get_datasets_json()


@app.route('/api/datasets/<dataset_id>', methods=['GET', 'POST', 'DELETE'])
def api_get_dataset_by_id(dataset_id):
    index = get_dataset_index_by_id(dataset_id)
    if (index == -1):
        return "Dataset does not exists", 404

    if request.method == 'GET':
        """return the dataset for <dataset_id>"""

        json_data = get_datasets_json()[index]
        dataset = json.loads(json.dumps(json_data),
                             object_hook=lambda d: SimpleNamespace(**d))

        if not dataset or not dataset.path:
            return "Path value is required", 400

        files = find_dataset_files(dataset)

        json_data['files'] = files
        json_data['filesCount'] = len(files)

        return json_data

    if request.method == 'POST':
        """edit the dataset for <dataset_id>"""

        file = get_datasets_json()
        file[index] = request.json
        save_datasets(file)

        return request.json

    if request.method == 'DELETE':
        """delete the dataset for <dataset_id>"""

        file = get_datasets_json()
        conf_path = os.path.join(file[index]['path'], db.EDIFICE_DB)
        file.pop(index)
        save_datasets(file)
        os.remove(conf_path)

        return dataset_id

    return "Request not supported", 405


@app.route('/api/datasets/add', methods=['POST'])
def add_dataset():
    new_dataset = request.json
    path = new_dataset.get('path')

    if not new_dataset or not path:
        return "Dataset value is not correct", 400

    # create unique id
    new_dataset['id'] = str(uuid.uuid4())

    # create file & file directory if does not exists
    if not os.path.isfile(DATASETS_PATH):
        os.makedirs(os.path.dirname(DATASETS_PATH), exist_ok=True)
        with open(DATASETS_PATH, mode='w') as f:
            json.dump([], f)

    db.conf_db(path)
    # add deepdanbooru to dataset
    db.add_interrogator(path, Deepdanbooru.name, Deepdanbooru.get_tags())
    file = get_datasets_json()
    file.append(new_dataset)
    save_datasets(file)

    return new_dataset


@app.route('/api/load_file', methods=['GET'])
def load_file():
    path = request.args.get('path')

    if not path:
        return "Path value is required", 400

    if not os.path.isfile(path):
        return "File does not exists", 404

    return send_file(path)


@app.route('/api/datasets/<dataset_id>/file_info', methods=['GET'])
def get_file_info(dataset_id):
    dataset = get_dataset_by_id(dataset_id)
    if not dataset_id or not dataset:
        return "Dataset is not found", 404

    dataset_path = dataset.get('path')
    path = request.args.get('path')

    if not path:
        return "Path value is required", 400

    if not os.path.isfile(path):
        return "File does not exists", 404

    return db.get_file_info(dataset_path, dhash(path))


@app.route('/api/datasets/<dataset_id>/evaluate', methods=['POST'])
def evaluate_dataset(dataset_id: str):
    task = evaluate_dataset.apply_async(args=[dataset_id])
    return {'statusUrl': url_for('taskstatus', task_id=task.id)}, 202


@celery.task(bind=True)
def evaluate_dataset(self, dataset_id):
    dataset = json.loads(json.dumps(get_dataset_by_id(dataset_id)),
                         object_hook=lambda d: SimpleNamespace(**d))

    if not dataset or not dataset.path:
        self.update_state(state='FAILURE',
                          meta={'current': 0,
                                'total': 0,
                                'status': 'error'})
        return {}

    files = find_dataset_files(dataset)
    filesCount = len(files)
    index = 0

    self.update_state(state='PROGRESS',
                      meta={'current': 0, 'total': filesCount,
                            'status': 'loading interrogator model'})

    for filepath in Deepdanbooru.eval_dataset(dataset, files, app.logger):
        index += 1
        self.update_state(state='PROGRESS',
                          meta={'current': index, 'total': filesCount,
                                'status': filepath})

    return {
        'current': filesCount,
        'total': filesCount,
        'status': 'completed',
    }


@app.route('/api/status/<task_id>', methods=['GET'])
def taskstatus(task_id):
    # https://blog.miguelgrinberg.com/post/using-celery-with-flask
    task = evaluate_dataset.AsyncResult(task_id)
    if task.state == 'PENDING':
        return {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        return {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
    else:
        # something went wrong in the background job
        return {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }


@app.route('/api/datasets/<dataset_id>/customTags', methods=['GET', 'POST'])
def dataset_custom_tags(dataset_id):
    dataset = get_dataset_by_id(dataset_id)
    if not dataset_id or not dataset:
        return "Dataset is not found", 404

    if request.method == 'GET':
        """return the dataset's custom tags"""
        return db.get_custom_tags(dataset.get('path'))

    if request.method == 'POST':
        """change the dataset's custom tags"""

        newTags = request.json.get('add')
        editTags = request.json.get('edit')
        removeTags = request.json.get('remove')

        db.save_custom_tags(dataset.get('path'), newTags, editTags, removeTags)
        return {}, 200

    return "Request not supported", 405


@app.route('/api/datasets/<dataset_id>/tagMatching/<match_pos>', methods=['POST'])
def dataset_tags_matching(dataset_id, match_pos: int):
    dataset = get_dataset_by_id(dataset_id)
    if not dataset_id or not dataset:
        return "Dataset is not found", 404

    tag = request.json.get('tag')
    match_id = request.json.get('matchId')

    db.save_tag_matching(dataset.get('path'), tag, match_pos, match_id)
    return {}, 200


@app.route('/api/datasets/<dataset_id>/tagMatching', methods=['DELETE'])
def clear_dataset_tags_matching(dataset_id):
    dataset = get_dataset_by_id(dataset_id)
    if not dataset_id or not dataset:
        return "Dataset is not found", 404

    tag = request.json.get('tag')

    db.clear_tag_matching(dataset.get('path'), tag)
    return {}, 200


@app.route('/api/datasets/<dataset_id>/tags', methods=['GET'])
def get_dataset_tags(dataset_id):
    dataset = get_dataset_by_id(dataset_id)
    if not dataset_id or not dataset:
        return "Dataset is not found", 404

    return db.get_tags(dataset.get('path'))
