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
    customTags: Array<DatasetFileCustomTag> = [];
    // TODO : add smart crop values

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.hash) this.hash = initializer.hash;
        if (initializer.prompt) this.prompt = initializer.prompt;
        if (initializer.tags) this.tags = initializer.tags;
        if (initializer.customTags) this.tags = initializer.customTags;
    }
}

export class DatasetFileTag {
    interrogatorName: string = '';
    tag: string = '';
    value: number = 0.0;
    customTagMatcher1: DatasetFileCustomTag | undefined;
    customTagMatcher2: DatasetFileCustomTag | undefined;
    customTagMatcher3: DatasetFileCustomTag | undefined;

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.interrogatorName) this.interrogatorName = initializer.interrogatorName;
        if (initializer.tag) this.tag = initializer.tag;
        if (initializer.value) this.value = initializer.value;
        if (initializer.customTagMatcher1) this.customTagMatcher1 = initializer.customTagMatcher1;
        if (initializer.customTagMatcher2) this.customTagMatcher2 = initializer.customTagMatcher2;
        if (initializer.customTagMatcher3) this.customTagMatcher3 = initializer.customTagMatcher3;
    }
}

export class DatasetFileCustomTag {
    id: string = '';
    name: string = '';
    description: string | undefined;
    parentId: string | undefined;
    childrens: Array<DatasetFileCustomTag> = [];

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.name) this.name = initializer.name;
        if (initializer.description) this.description = initializer.description;
        if (initializer.childrens) this.childrens = initializer.childrens;
    }
}