import { CSSProperties, ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { useLoaderData } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { DatasetFileCustomTag, DatasetFileTag } from '@/types/file';
import { Dataset } from '@/types/dataset';
import { useAppDispatch } from '@/app/hooks';
import { saveDataseTagMatching } from '@/store/dataset';

export default function InterrogatorMatcherTable() {
    const dispatch = useAppDispatch()
    const dataset = useLoaderData() as Dataset
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [customTags, setCustomTags] = useState<Array<DatasetFileCustomTag>>([])
    const [interrogatorTags, setInterrogatorTags] = useState<Array<DatasetFileTag>>([])

    useEffect(() => {
        fetch(`/api/datasets/${dataset.id}/tags`).then(res => res.json()).then(data => {
            setInterrogatorTags(data.interrogatorTags);
            setCustomTags(data.customTags)
            setIsLoading(false)
        });
    }, []);

    const onClearTagMatching = (tag: DatasetFileTag) => {
        dispatch(saveDataseTagMatching({
            datasetId: dataset.id,
            tag: tag,
            matchId: null,
        }));
    }
    const onChangeTagMatch = (tag: DatasetFileTag, matchId: string) => {
        dispatch(saveDataseTagMatching({
            datasetId: dataset.id,
            tag: tag,
            matchId: matchId,
        }));
    }

    const selectButtonOptions = customTags?.map((tag) => (
        <option key={`select-option-${tag.id}`} value={tag.id}>{tag.name}</option>
    ));

    const onClear = (index: number) => {
        if (interrogatorTags === undefined) return;
        const newList = [...interrogatorTags]
        const newInterrogatorTag = newList[index]
        newInterrogatorTag.customTagMatcher = undefined
        newList[index] = newInterrogatorTag
        setInterrogatorTags(newList)
        onClearTagMatching(newInterrogatorTag)
    }

    return (
        <Modal titleString={`<${dataset.name}> interrogator tags`}>
            <section className='interrogator-tags-matcher-form'>
                {isLoading
                    ? <span>Loading...</span>
                    :
                    <List
                        height={500}
                        itemCount={interrogatorTags.length}
                        itemSize={35}
                        width={800}
                    >
                        {({ index, style }: { index: number; style: CSSProperties; }) => (
                            <div style={style}>
                                <InterrogatorMatcherItem
                                    key={index}
                                    index={index}
                                    interrogatorTag={interrogatorTags[index]}
                                    selectInputOptions={selectButtonOptions}
                                    onClear={onClear}
                                    onChange={onChangeTagMatch}
                                />
                            </div>
                        )}
                    </List>
                }
            </section>
        </Modal >
    )
}

type InterrogatorMatcherItemProps = {
    index: number;
    interrogatorTag: DatasetFileTag;
    selectInputOptions: JSX.Element[] | undefined;
    onClear(index: number): void;
    onChange(tag: DatasetFileTag, match: string): void;
};


function InterrogatorMatcherItem(props: InterrogatorMatcherItemProps) {
    return (
        <div className='interrogator-tags-matcher-item'>
            <input
                type="text"
                value={props.index}
                size={5}
                readOnly
            />
            <input
                type="text"
                value={props.interrogatorTag.interrogatorName}
                readOnly
            />
            <input
                type="text"
                value={props.interrogatorTag.tag}
                readOnly
            />
            <select value={props.interrogatorTag.customTagMatcher?.id} onChange={(e) => props.onChange(props.interrogatorTag, e.target.value)}>
                <option key={`select-option-empty`}></option>
                {props.selectInputOptions}
            </select>
            <button type="button" onClick={() => props.onClear(props.index)}>
                Clear
            </button>
        </div >
    );

}