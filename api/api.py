import json

from flask import Flask, request, send_file
from helpers import find_files_with_extensions_recursive, find_files_with_extensions

app = Flask(__name__)

fake_datasets = [
    {
        'id': 0,
        'path': './',
        'name': 'My Dataset',
        'extensions': '.png,.jpg,.jpeg,.gif',
        'idealSize': { 'width': 518, 'height': 518},
        'isRecursive': True
    },
    {
        'id': 1,
        'path': '../',
        'name': 'My Dataset 2',
        'extensions': '.png,.jpg,.jpeg,.gif',
        'idealSize': { 'width': 518, 'height': 518},
        'isRecursive': True
    }
]

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    return fake_datasets

@app.route('/api/dataset/<int:dataset_id>', methods=['GET'])
def get_dataset_by_id(dataset_id):
    if(dataset_id > len(fake_datasets) - 1):
        return "Dataset does not exists", 404

    dataset = fake_datasets[dataset_id].copy()
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

# @app.route('/api/files', methods=['GET'])
# def get_directory_files():
#     path = request.args.get('path')
#     extensions = request.args.get('extensions')
#     recursive = request.args.get('recursive') != 'False'

#     if not path:
#         return "Path value is required", 400

#     if recursive:
#         return find_files_with_extensions_recursive(path, extensions)

#     return find_files_with_extensions(path, extensions)


@app.route('/api/load_file', methods=['GET'])
def load_file():
    path = request.args.get('path')

    if not path:
        return "Path value is required", 400

    return send_file(path)
