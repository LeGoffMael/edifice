import os
import json
import re
from typing import Tuple
from pathlib import Path
import time
import math
from PIL import Image

from models import File, Dataset

DATASETS_PATH = os.path.dirname(
    os.path.realpath(__file__)) + '/../data/datasets.json'


def find_dataset_files(dataset: Dataset):
    """
    Finds all files from a given dataset.
    """

    files = []
    if dataset.isRecursive:
        files = find_files_with_extensions_recursive(
            dataset.path, dataset.includeExtRegex, dataset.excludeDirRegex)
    else:
        files = find_files_with_extensions(
            dataset.path, dataset.includeExtRegex)

    return files


def find_files_with_extensions_recursive(directory: str, includeExtRegex: str, excludeDirRegex: str):
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


def find_files_with_extensions(directory: str, includeExtRegex: str):
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


def __getFile(directory: str, filename: str):
    ext = os.path.splitext(filename)[1]
    return File(os.path.join(directory, filename), filename, ext.lower())


def get_datasets_json():
    if os.path.isfile(DATASETS_PATH):
        with open(DATASETS_PATH) as jsonfile:
            return json.load(jsonfile)

    return []


def get_dataset_index_by_id(dataset_id: str):
    for i, obj in enumerate(get_datasets_json()):
        if obj.get('id') == dataset_id:
            return i
    return -1


def get_dataset_by_id(dataset_id: str):
    for _, obj in enumerate(get_datasets_json()):
        if obj.get('id') == dataset_id:
            return obj
    return None


def save_datasets(datasets: list):
    with open(DATASETS_PATH, mode='w') as f:
        json.dump(datasets, f,
                  indent=4,
                  separators=(',', ': '))


def get_file_extension(path: str) -> str:
    return Path(path).suffix.lower()


def get_file_name(path: str):
    """
    Returns file name without extension
    """

    return Path(path).stem


def dhash(image_path, hash_size=8):
    """
    Returns the hash code of an image.
    """

    # source: https://medium.com/iconfinder/detecting-duplicate-images-using-python-cb240b05a3b6

    # Grayscale and shrink the image in one step.
    image = Image.open(image_path).convert('L').resize(
        (hash_size + 1, hash_size),
        Image.ANTIALIAS,
    )
    pixels = list(image.getdata())
    # Compare adjacent pixels.

    difference = []
    for row in range(hash_size):
        for col in range(hash_size):
            pixel_left = image.getpixel((col, row))
            pixel_right = image.getpixel((col + 1, row))
            difference.append(pixel_left > pixel_right)

    # Convert the binary array to a hexadecimal string.
    decimal_value = 0
    hex_string = []

    for index, value in enumerate(difference):
        if value:
            decimal_value += 2**(index % 8)
        if (index % 8) == 7:
            hex_string.append(hex(decimal_value)[2:].rjust(2, '0'))
            decimal_value = 0

    return ''.join(hex_string)


def is_gif(file_path: str) -> bool:
    return get_file_extension(file_path) == '.gif'


def gif_to_2_jpegs(tmpdir: str, gif_file_path: str) -> Tuple:
    """
    Convert 2 frames from gif into jpeg
    """

    # convert the GIF to a JPEG image
    ts = str(int(time.time()))

    with Image.open(gif_file_path) as im:
        jpeg_file_name_1 = get_file_name(
            gif_file_path) + '_1_' + ts + '.jpg'
        jpeg_file_name_2 = get_file_name(
            gif_file_path) + '_2_' + ts + '.jpg'

        jpeg_file_path_1 = os.path.join(tmpdir, jpeg_file_name_1)
        jpeg_file_path_2 = os.path.join(tmpdir, jpeg_file_name_2)

        frame_1 = math.floor(im.n_frames * (1/3))
        frame_2 = math.floor(im.n_frames * (2/3))

        im_1 = im.copy()
        if im_1.mode in ("RGBA", "P"):
            im_1 = im_1.convert("RGB")
        im_2 = im.copy()
        if im_2.mode in ("RGBA", "P"):
            im_2 = im_2.convert("RGB")

        im.seek(frame_1)
        im_1.save(jpeg_file_path_1)

        im.seek(frame_2)
        im_2.save(jpeg_file_path_2)

        return jpeg_file_path_1, jpeg_file_path_2
