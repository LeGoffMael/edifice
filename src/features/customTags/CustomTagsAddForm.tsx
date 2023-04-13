import { DatasetFileCustomTag } from "@/types/file";
import { useState } from "react";

type CustomTagsAddFormProps = {
    parentId: string | undefined;
    onAdd(tag: DatasetFileCustomTag): void;
};

export default function CustomTagsAddForm(props: CustomTagsAddFormProps) {
    const [newTag, setNewTag] = useState<Partial<DatasetFileCustomTag>>()

    const onDatasetChanged = (val: Partial<DatasetFileCustomTag>) => setNewTag({ ...newTag, ...val })

    const onSaveNewTag = () => {
        if (newTag?.name !== undefined) {
            props.onAdd({
                id: Date.now().toString(), // shoudl use uuid
                parentId: props.parentId,
                childrens: [],
                name: newTag.name,
                description: newTag.description,
            })
            setNewTag(undefined)
        }
    }

    return (
        <div>
            <label htmlFor="newTagName">Name:</label>
            <input
                name="newTagName"
                type="text"
                value={newTag?.name ?? ''}
                onChange={(e) => onDatasetChanged({ name: e.target.value })}
            />
            <label htmlFor="newTagDescription">Description:</label>
            <input
                name="newTagDescription"
                type="text"
                value={newTag?.description ?? ''}
                onChange={(e) => onDatasetChanged({ description: e.target.value })}
            />

            <button type="button" onClick={onSaveNewTag}>
                Add tag
            </button>
        </div>
    )
}
