import deepdanbooru as dd
import os
import re
from models import Dataset


class Deepdanbooru:
    name = 'deepdanbooru-v3-20211112-sgd-e28'
    project_path = '/stable-diffusion-webui/models/deepdanbooru/deepdanbooru-v3-20211112-sgd-e28'
    threshold = 0.5  # minimum value for tags

    def get_tags():
        return dd.project.load_tags_from_project(Deepdanbooru.project_path)

    def eval_img(path: str):
        model = dd.project.load_model_from_project(
            Deepdanbooru.project_path, compile_model=False)

        result_tags = []
        for tag, score in dd.commands.evaluate_image(
                path, model, Deepdanbooru.get_tags(), Deepdanbooru.threshold):
            result_tags.append((tag, score))
        return result_tags

    def eval_dataset(dataset: Dataset):
        model = dd.project.load_model_from_project(
            Deepdanbooru.project_path, compile_model=False)

        for root, _, filenames in os.walk(dataset.path):
            # exclude directory if match regex
            if dataset.excludeDirRegex and re.match(dataset.excludeDirRegex, root):
                continue

            for filename in filenames:
                # include file if respect regex
                if not dataset.includeExtRegex or re.match(dataset.includeExtRegex, filename):
                    tag_sets = dd.commands.evaluate_image(
                        filename, model, Deepdanbooru.get_tags(), Deepdanbooru.threshold)
                    print(*tag_sets, sep="\n")
                else:
                    continue

        return tag_sets
