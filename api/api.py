import json

from flask import Flask, request, send_file
from helpers import find_files_with_extensions_recursive, find_files_with_extensions

app = Flask(__name__)


@app.route('/api/files', methods=['GET'])
def get_directory_files():
    path = request.args.get('path')
    extensions = request.args.get('extensions')
    recursive = request.args.get('recursive') != 'False'

    if not path:
        return "Path value is required", 400

    if recursive:
        return find_files_with_extensions_recursive(path, extensions)

    return find_files_with_extensions(path, extensions)


@app.route('/api/load_file', methods=['GET'])
def load_file():
    path = request.args.get('path')

    if not path:
        return "Path value is required", 400

    return send_file(path)
