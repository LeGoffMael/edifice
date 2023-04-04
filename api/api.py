import os
import uuid

from flask import Flask, request, send_file
from helpers import *

app = Flask(__name__)


@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    return get_datasets_json()


@app.route('/api/datasets/<dataset_id>', methods=['GET', 'POST', 'DELETE'])
def get_dataset_by_id(dataset_id):
    index = get_dataset_index_by_id(dataset_id)
    if (index == -1):
        return "Dataset does not exists", 404

    if request.method == 'GET':
        """return the dataset for <dataset_id>"""

        dataset = get_datasets_json()[index].copy()
        path = dataset.get('path')
        recursive = dataset.get('isRecursive')
        includeExtRegex = dataset.get('includeExtRegex')
        excludeDirRegex = dataset.get('excludeDirRegex')

        if not path:
            return "Path value is required", 400

        if recursive:
            files = find_files_with_extensions_recursive(
                path, includeExtRegex, excludeDirRegex)
        else:
            files = find_files_with_extensions(path, includeExtRegex)

        dataset['files'] = files
        dataset['filesCount'] = len(files)

        return dataset

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

    if not new_dataset or not new_dataset.get('path'):
        return "Dataset value is not correct", 400

    # create unique id
    new_dataset['id'] = str(uuid.uuid4())

    path = get_datasets_json_path()

    # create file & file directory if does not exists
    if not os.path.isfile(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, mode='w') as f:
            json.dump([], f)

    file = get_datasets_json()
    file.append(new_dataset)
    save_datasets(file)

    return new_dataset


@app.route('/api/load_file', methods=['GET'])
def load_file():
    path = request.args.get('path')

    if not path:
        return "Path value is required", 400

    return send_file(path)
