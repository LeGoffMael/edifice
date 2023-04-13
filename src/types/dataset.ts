import { Size } from '@/types/types'
import { DatasetFile, DatasetFileCustomTag } from '@/types/file';

export class Dataset {
    id!: string; // id should never be null
    name: string = '';
    path: string = '';
    createdAt: number = 0;
    modifiedAt: number = 0; // to check if new files were added
    files: Array<DatasetFile> = [];
    filesCount: number | undefined;

    // rules related to data
    isRecursive: boolean = true;
    includeExtRegex: string = '^[^.].*\\.(jpeg|jpg|gif|png|webp|avif|svg)$'; // list of authorized file extensions
    excludeDirRegex: string = ''; // list of exclude directories
    idealSize: Size | undefined;
    customTags: Array<DatasetFileCustomTag> = [];

    constructor(initializer?: any) {
        if (!initializer) return;
        if (initializer.id) this.id = initializer.id;
        if (initializer.name) this.name = initializer.name;
        if (initializer.path) this.path = initializer.path;
        if (initializer.createdAt) this.createdAt = initializer.createdAt;
        if (initializer.modifiedAt) this.modifiedAt = initializer.modifiedAt;
        if (initializer.files) this.files = initializer.files;
        if (initializer.filesCount) this.filesCount = initializer.filesCount;
        if (initializer.isRecursive) this.isRecursive = initializer.isRecursive;
        if (initializer.includeExtRegex) this.includeExtRegex = initializer.includeExtRegex;
        if (initializer.excludeDirRegex) this.excludeDirRegex = initializer.excludeDirRegex;
        if (initializer.idealSize) this.idealSize = initializer.idealSize;
        if (initializer.customTags) this.customTags = initializer.customTags;
    }
}