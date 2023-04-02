import os
import glob
import json

from models import File


def find_files_with_extensions_recursive(directory, extensions):
    """
    Recursively finds all files with the given extensions in a directory.
    """

    if not extensions:
        return glob.glob(directory + '/**/*', recursive=True)

    files = []
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            file = __getFile(root, filename)
            if __canIncludeFile(file, extensions):
                files.append(json.loads(json.dumps(file.__dict__)))
            else:
                continue
    return files


def find_files_with_extensions(directory, extensions):
    """
    Finds all files with the given extensions in a directory.
    """

    if not extensions:
        return os.listdir(directory)

    files = []
    for filename in os.listdir(directory):
        file = __getFile(directory, filename)
        if __canIncludeFile(file, extensions):
            files.append(json.loads(json.dumps(file.__dict__)))
        else:
            continue
    return files


def __getFile(directory, filename):
    ext = os.path.splitext(filename)[1]
    return File(os.path.join(directory, filename), filename, ext.lower())


def __canIncludeFile(file, extensions):
    """
    Checks if the file can be included based on its name and extension.
    """

    # exclude files whose names start with a dot
    if file.name.startswith('.'):
        return False
    # exclude files with no extensions
    if '.' not in file.name:
        return False

    if file.extension in extensions:
        return True

    return False
