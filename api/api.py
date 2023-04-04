import json
import os

from flask import Flask, request, send_file
from helpers import find_files_with_extensions_recursive, find_files_with_extensions

app = Flask(__name__)


@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    datasets_path = os.path.dirname(
        os.path.realpath(__file__)) + '/../data/datasets.json'

    if os.path.isfile(datasets_path):
        with open(datasets_path) as jsonfile:
            return json.load(jsonfile)

    return []


@app.route('/api/dataset/<dataset_id>', methods=['GET'])
def get_dataset_by_id(dataset_id):
    dataset = list(filter(lambda x: x["id"] == dataset_id, get_datasets()))

    if (len(dataset) == 0):
        return "Dataset does not exists", 404

    dataset = dataset[0].copy()
    path = dataset['path']
    extensions = dataset['extensions']
    recursive = dataset['isRecursive']

    if not path:
        return "Path value is required", 400

    if recursive:
        files = find_files_with_extensions_recursive(path, extensions)
    else:
        files = find_files_with_extensions(path, extensions)

    dataset['files'] = files
    dataset['filesCount'] = len(files)

    return dataset


@ app.route('/api/load_file', methods=['GET'])
def load_file():
    path = request.args.get('path')

    if not path:
        return "Path value is required", 400

    return send_file(path)
