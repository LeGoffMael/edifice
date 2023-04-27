from typing import Iterable, Tuple
from logging import Logger
import os
import tempfile

import deepdanbooru as dd
from models import Dataset, File
from dataset_db import add_file_with_tags
from helpers import is_gif, gif_to_jpeg


class Deepdanbooru:
    name = 'deepdanbooru-v3-20211112-sgd-e28'
    project_path = '/stable-diffusion-webui/models/deepdanbooru/deepdanbooru-v3-20211112-sgd-e28'
    threshold = 0.5  # minimum value for tags

    def get_tags():
        return dd.project.load_tags_from_project(Deepdanbooru.project_path)

    def eval_img(dataset: Dataset, filepath: str, logger: Logger):
        model = dd.project.load_model_from_project(
            Deepdanbooru.project_path, compile_model=False)
        Deepdanbooru.run_save_eval(dataset, filepath, model,
                                   Deepdanbooru.get_tags(), logger)

    def eval_dataset(dataset: Dataset, files: list[File], logger: Logger) -> Iterable[Tuple[str]]:
        logger.info('eval_dataset loading model and tags')

        model = dd.project.load_model_from_project(
            Deepdanbooru.project_path, compile_model=False)
        tags = Deepdanbooru.get_tags()

        for f in files:
            filepath = f.get('path')
            Deepdanbooru.run_save_eval(dataset, filepath, model, tags, logger)
            yield filepath

    def run_save_eval(dataset: Dataset, filepath: str, model: any, tags: any, logger: Logger):
        logger.info('filepath: %s', filepath)

        if is_gif(filepath) is True:
            jpeg_image, jpeg_file_name = gif_to_jpeg(filepath)
            # create a temporary directory to store the JPEG file
            with tempfile.TemporaryDirectory() as tmpdir:
                jpeg_file_path = os.path.join(tmpdir, jpeg_file_name)
                jpeg_image.save(jpeg_file_path)

                evals = dd.commands.evaluate_image(
                    jpeg_file_path, model, tags, Deepdanbooru.threshold)
                add_file_with_tags(dataset.path, filepath,
                                   Deepdanbooru.name, evals)
        else:
            evals = dd.commands.evaluate_image(
                filepath, model, tags, Deepdanbooru.threshold)
            add_file_with_tags(dataset.path, filepath,
                               Deepdanbooru.name, evals)

        logger.info('tags_score: %s', evals)
