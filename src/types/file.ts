export class DatasetFile {
    id: number | undefined;
    path: string = '';
    name: string = '';
    extension: string = '';
    prompt: string = '';
    get isNew(): boolean {
        return this.id === undefined;
    }

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.id) this.id = initializer.id;
        if (initializer.path) this.path = initializer.path;
        if (initializer.name) this.name = initializer.name;
        if (initializer.extension) this.extension = initializer.extension;
        if (initializer.description) this.prompt = initializer.prompt;
    }
}