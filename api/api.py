from flask import Flask, request, send_file
import os
from types import SimpleNamespace
import uuid

from helpers import *
import dataset_db as db
from interrogator_dd import Deepdanbooru

app = Flask(__name__)


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
        file.pop(index)
        save_datasets(file)

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

    # uncomment to run deepdanbooru and save result in db
    # add_file_with_tags(dataset_path, path,
    #                    Deepdanbooru.name, Deepdanbooru.eval_img(path))
    return db.get_file_info(dataset_path, dhash(path))
