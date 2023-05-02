import { CSSProperties, useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { useLoaderData } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { DatasetFileCustomTag, DatasetFileTag } from '@/types/file';
import { Dataset } from '@/types/dataset';
import { useAppDispatch } from '@/app/hooks';
import { saveDatasetTagMatching, clearDatasetTagMatching } from '@/store/dataset';

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
        dispatch(clearDatasetTagMatching({
            datasetId: dataset.id,
            tag: tag,
        }));
    }
    const onChangeTagMatch = (tag: DatasetFileTag, matchPos: number, matchId: string) => {
        dispatch(saveDatasetTagMatching({
            datasetId: dataset.id,
            tag: tag,
            matchPos: matchPos,
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
        newInterrogatorTag.customTagMatcher1 = undefined
        newInterrogatorTag.customTagMatcher2 = undefined
        newInterrogatorTag.customTagMatcher3 = undefined
        newList[index] = newInterrogatorTag
        setInterrogatorTags(newList)
        onClearTagMatching(newInterrogatorTag)
    }

    return (
        <Modal titleString={`<${dataset.name}> interrogator tags`}>
            <section className='interrogator-tags-matcher-form' style={isLoading ? {} : { height: 'calc(100vh - 115px)' }}>
                {isLoading
                    ? <span>Loading...</span>
                    :
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height ?? 100}
                                width={width ?? 100}
                                itemCount={interrogatorTags.length}
                                itemSize={35}
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
                        )}
                    </AutoSizer>
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
    onChange(tag: DatasetFileTag, matchPos: number, match: string): void;
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
            <select value={props.interrogatorTag.customTagMatcher1?.id} onChange={(e) => props.onChange(props.interrogatorTag, 1, e.target.value)}>
                <option key={`select-option-empty`}></option>
                {props.selectInputOptions}
            </select>
            <select value={props.interrogatorTag.customTagMatcher2?.id} onChange={(e) => props.onChange(props.interrogatorTag, 2, e.target.value)}>
                <option key={`select-option-empty`}></option>
                {props.selectInputOptions}
            </select>
            <select value={props.interrogatorTag.customTagMatcher3?.id} onChange={(e) => props.onChange(props.interrogatorTag, 3, e.target.value)}>
                <option key={`select-option-empty`}></option>
                {props.selectInputOptions}
            </select>
            <button type="button" onClick={() => props.onClear(props.index)}>
                Clear
            </button>
        </div >
    );

}