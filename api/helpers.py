import os
import json
import re

from models import File


def find_files_with_extensions_recursive(directory, includeExtRegex, excludeDirRegex):
    """
    Recursively finds all files which validate the regex in a directory.
    """

    files = []
    for root, _, filenames in os.walk(directory):
        # exclude directory if match regex
        if excludeDirRegex and re.match(excludeDirRegex, root):
            continue

        for filename in filenames:
            file = __getFile(root, filename)
            # include file if respect regex
            if not includeExtRegex or re.match(includeExtRegex, filename):
                files.append(json.loads(json.dumps(file.__dict__)))
            else:
                continue
    return files


def find_files_with_extensions(directory, includeExtRegex):
    """
    Finds all files which validate the regex in a directory.
    """

    if not includeExtRegex:
        return os.listdir(directory)

    files = []
    for filename in os.listdir(directory):
        file = __getFile(directory, filename)
        if re.match(includeExtRegex, filename):
            files.append(json.loads(json.dumps(file.__dict__)))
        else:
            continue
    return files


def __getFile(directory, filename):
    ext = os.path.splitext(filename)[1]
    return File(os.path.join(directory, filename), filename, ext.lower())


def get_datasets_json_path():
    return os.path.dirname(
        os.path.realpath(__file__)) + '/../data/datasets.json'


def get_datasets_json():
    datasets_path = get_datasets_json_path()

    if os.path.isfile(datasets_path):
        with open(datasets_path) as jsonfile:
            return json.load(jsonfile)

    return []


def get_dataset_index_by_id(dataset_id):
    for i, obj in enumerate(get_datasets_json()):
        if obj.get('id') == dataset_id:
            return i
    return -1


def save_datasets(datasets):
    with open(get_datasets_json_path(), mode='w') as f:
        json.dump(datasets, f,
                  indent=4,
                  separators=(',', ': '))
