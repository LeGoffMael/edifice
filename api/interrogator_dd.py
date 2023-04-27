from typing import Iterable, Tuple
from logging import Logger
import os
import tempfile
from itertools import chain

import deepdanbooru as dd
from models import Dataset, File
from dataset_db import add_file_with_tags
from helpers import is_gif, gif_to_2_jpegs


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
            # create a temporary directory to store the JPEG file
            with tempfile.TemporaryDirectory() as tmpdir:
                jpeg_file_path_1, jpeg_file_path_2 = gif_to_2_jpegs(
                    tmpdir, filepath)

                evals_1 = dd.commands.evaluate_image(
                    jpeg_file_path_1, model, tags, Deepdanbooru.threshold)
                evals_2 = dd.commands.evaluate_image(
                    jpeg_file_path_2, model, tags, Deepdanbooru.threshold)
                evals = chain(evals_1, evals_2)

                add_file_with_tags(dataset.path, filepath,
                                   Deepdanbooru.name, evals)
        else:
            evals = dd.commands.evaluate_image(
                filepath, model, tags, Deepdanbooru.threshold)
            add_file_with_tags(dataset.path, filepath,
                               Deepdanbooru.name, evals)

        logger.info('tags_score: %s', evals)
