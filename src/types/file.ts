export class DatasetFile {
    path: string = '';
    name: string = '';
    extension: string = '';
    info: DatasetFileInfo | undefined;

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.path) this.path = initializer.path;
        if (initializer.name) this.name = initializer.name;
        if (initializer.extension) this.extension = initializer.extension;
        if (initializer.info) this.info = initializer.info;
    }
}

export class DatasetFileInfo {
    hash: string | undefined;
    prompt: string | undefined;
    tags: Array<DatasetFileTag> = [];
    // TODO : add smart crop values

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.hash) this.hash = initializer.hash;
        if (initializer.prompt) this.prompt = initializer.prompt;
        if (initializer.tags) this.tags = initializer.tags;
    }
}

export class DatasetFileTag {
    interrogatorName: string = '';
    tag: string = '';
    value: number = 0.0;

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.interrogatorName) this.interrogatorName = initializer.interrogatorName;
        if (initializer.tag) this.tag = initializer.tag;
        if (initializer.value) this.value = initializer.value;
    }
}