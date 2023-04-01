export class Workspace {
    id: number | undefined;
    name: string = '';
    path: string = '';
    extensions: string = '';
    createdAt: number = 0;
    get isNew(): boolean {
        return this.id === undefined;
    }

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.id) this.id = initializer.id;
        if (initializer.name) this.name = initializer.name;
        if (initializer.path) this.path = initializer.path;
        if (initializer.extensions) this.extensions = initializer.extensions;
        if (initializer.createdAt) this.createdAt = initializer.createdAt;
    }
}