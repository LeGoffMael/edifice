import { Size } from '@/types/types'
import { DatasetFile } from '@/types/file';

export class Dataset {
    id!: number; // id should never be null and provided fron the API
    name: string = '';
    path: string = '';
    createdAt: number = 0;
    modifiedAt: number = 0; // to check if new files were added
    files: Array<DatasetFile> = [];
    filesCount: number | undefined;
    isRecursive: boolean = true;

    // rules related to data
    extensions: string = ''; // list of authorized file extensions
    idealSize: Size | undefined;

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.id) this.id = initializer.id;
        if (initializer.name) this.name = initializer.name;
        if (initializer.path) this.path = initializer.path;
        if (initializer.extensions) this.extensions = initializer.extensions;
        if (initializer.createdAt) this.createdAt = initializer.createdAt;
        if (initializer.modifiedAt) this.modifiedAt = initializer.modifiedAt;
        if (initializer.files) this.files = initializer.files;
        if (initializer.filesCount) this.filesCount = initializer.filesCount;
        if (initializer.isRecursive) this.isRecursive = initializer.isRecursive;
        if (initializer.extensions) this.extensions = initializer.extensions;
        if (initializer.idealSize) this.idealSize = initializer.idealSize;
    }
}