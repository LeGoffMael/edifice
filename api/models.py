class File:
    def __init__(self, path, name, extension):
        self.path = path
        self.name = name
        self.extension = extension


class Dataset:
    def __init__(self, id, path, name, isRecursive: bool, includeExtRegex, excludeDirRegex):
        self.id = id
        self.path = path
        self.name = name
        self.isRecursive = isRecursive
        self.includeExtRegex = includeExtRegex
        self.excludeDirRegex = excludeDirRegex
