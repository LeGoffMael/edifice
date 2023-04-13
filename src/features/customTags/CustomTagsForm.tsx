import { useCallback, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import CustomTagsAddForm from '@/features/customTags/CustomTagsAddForm';
import CustomTagItem from '@/features/customTags/CustomTagItem';
import { Link, useLoaderData } from 'react-router-dom';
import { DatasetFileCustomTag } from '@/types/file';
import { Dataset } from '@/types/dataset';
import { useAppDispatch } from '@/app/hooks';
import { saveDatasetCustomTags } from '@/store/dataset';

import '@/features/customTags/CustomTagsForm.css';
import { datasetTagsMatcherRoute } from '@/index';


export default function CustomTagsForm() {
    const dispatch = useAppDispatch()
    const dataset = useLoaderData() as Dataset
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [customTags, setCustomTags] = useState<Array<DatasetFileCustomTag>>(dataset.customTags ?? [])
    const [newTags, setNewTags] = useState<Array<DatasetFileCustomTag>>([])
    const [editTags, setEditTags] = useState<Array<DatasetFileCustomTag>>([])
    const [removeTags, setRemoveTags] = useState<Array<string>>([])

    useEffect(() => {
        fetch(`/api/datasets/${dataset.id}/customTags`).then(res => res.json()).then(data => {
            setCustomTags(data)
            setIsLoading(false)
        });
    }, []);

    const onSaveDatasetClicked = () => {
        dispatch(saveDatasetCustomTags({
            datasetId: dataset.id,
            add: newTags,
            edit: editTags,
            remove: removeTags,
        }));
    }

    const clickOnAdd = useCallback((tag: DatasetFileCustomTag) => {
        if (tag.parentId === undefined) {
            const newList = customTags.concat(tag)
            setCustomTags(newList)
        }
        const nt = [...newTags]
        nt.push(tag)
        setNewTags(nt)
        console.log('onAdd', nt)
    }, [customTags, newTags]);

    const clickOnEdit = useCallback((tag: DatasetFileCustomTag) => {
        if (tag.parentId === undefined || tag.parentId === null) {
            const index = customTags?.findIndex((d: DatasetFileCustomTag) => d.id === tag.id);
            if (index !== -1) {
                const newList = [...customTags]
                newList[index] = tag
                setCustomTags(newList)
            }
        }

        const et = [...editTags]
        const index = et?.findIndex((d: DatasetFileCustomTag) => d.id === tag.id);
        if (index !== -1) {
            et[index] = tag
        } else {
            et.push(tag)
        }
        setEditTags(et)
        console.log('onEdit', et)
    }, [customTags, editTags]);

    const clickOnRemove = useCallback((tag: DatasetFileCustomTag) => {
        if (tag.parentId === undefined || tag.parentId === null) {
            const index = customTags?.findIndex((d: DatasetFileCustomTag) => d?.id === tag.id);
            if (index !== -1) {
                const newList = [...customTags]
                delete newList[index]
                setCustomTags(newList.filter((e) => e !== undefined))
            }
        }
        const rt = [...removeTags]
        rt.push(tag.id)
        setRemoveTags(rt)
        console.log('onRemove', rt)
    }, [customTags, removeTags]);

    const title = <div>
        <h2>{`<${dataset.name}> custom tags`}</h2>
        <div>
            <button type="button" onClick={onSaveDatasetClicked}>
                Save data
            </button>
            <Link to={datasetTagsMatcherRoute + dataset.id} onClick={(e) => e.stopPropagation()}>Tags matcher</Link>
        </div>
    </div>

    return (
        <Modal title={title}>
            {isLoading
                ? <span>Loading...</span>
                : <section className='custom-tags-form'>
                    <form>
                        <CustomTagsAddForm key={'custom-tag-add-root'} parentId={undefined} onAdd={clickOnAdd} />

                        {customTags.map(((child, _) => (
                            <CustomTagItem
                                key={child.id}
                                customTag={child}
                                onAdd={clickOnAdd}
                                onEdit={clickOnEdit}
                                onRemove={clickOnRemove}
                            />
                        )))}
                    </form>
                </section>}
        </Modal >
    )
}