from typing import Iterable, Tuple
from logging import Logger
import json

import deepdanbooru as dd
from models import Dataset, File
from dataset_db import add_file_with_tags


class Deepdanbooru:
    name = 'deepdanbooru-v3-20211112-sgd-e28'
    project_path = '/stable-diffusion-webui/models/deepdanbooru/deepdanbooru-v3-20211112-sgd-e28'
    threshold = 0.5  # minimum value for tags

    def get_tags():
        return dd.project.load_tags_from_project(Deepdanbooru.project_path)

    def eval_img(path: str):
        model = dd.project.load_model_from_project(
            Deepdanbooru.project_path, compile_model=False)

        return dd.commands.evaluate_image(
            path, model, Deepdanbooru.get_tags(), Deepdanbooru.threshold)

    def eval_dataset(dataset: Dataset, files: list[File], logger: Logger) -> Iterable[Tuple[str]]:
        logger.info('eval_dataset loading model and tags')

        model = dd.project.load_model_from_project(
            Deepdanbooru.project_path, compile_model=False)
        tags = Deepdanbooru.get_tags()

        for f in files:
            filepath = f.get('path')
            logger.info('filepath: %s', filepath)

            evals = dd.commands.evaluate_image(
                filepath, model, tags, Deepdanbooru.threshold)
            add_file_with_tags(dataset.path, filepath,
                               Deepdanbooru.name, evals)
            logger.info('tags_score: %s', evals)
            yield filepath
