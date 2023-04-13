import React from "react";
import { DatasetFileCustomTag } from "@/types/file";
import CustomTagsAddForm from '@/features/customTags/CustomTagsAddForm';

type CustomTagItemProps = {
    customTag: DatasetFileCustomTag;
    onAdd(tag: DatasetFileCustomTag): void;
    onEdit(tag: DatasetFileCustomTag): void;
    onRemove(id: DatasetFileCustomTag): void;
};

type CustomTagItemState = {
    customTag: DatasetFileCustomTag;
};

export default class CustomTagItem extends React.Component<CustomTagItemProps, CustomTagItemState> {
    constructor(props: CustomTagItemProps) {
        super(props);
        this.state = {
            customTag: props.customTag
        };
        this.onEdit = this.onEdit.bind(this);
        this.clickOnChildAdd = this.clickOnChildAdd.bind(this);
        this.clickOnChildEdit = this.clickOnChildEdit.bind(this);
        this.clickOnChildRemove = this.clickOnChildRemove.bind(this);
    }

    onEdit(tag: Partial<DatasetFileCustomTag>) {
        const data = { ...this.state.customTag, ...tag }
        this.setState({ customTag: data });
        this.props.onEdit(data)
    }

    clickOnChildAdd(tag: DatasetFileCustomTag) {
        if (tag.parentId === this.state.customTag.id) {
            let newChildrens = this.state.customTag.childrens;
            newChildrens.push(tag)
            this.setState({
                customTag: { ...this.state.customTag, ...{ childrens: newChildrens } }
            });
        }
        this.props.onAdd(tag)
    }
    clickOnChildEdit(index: number, tag: DatasetFileCustomTag) {
        if (tag.parentId === this.state.customTag.id) {
            let newChildrens = this.state.customTag.childrens;
            newChildrens[index] = tag
            this.setState({
                customTag: { ...this.state.customTag, ...{ childrens: newChildrens } }
            });
        }
        this.props.onEdit(tag)
    }
    clickOnChildRemove(index: number, tag: DatasetFileCustomTag) {
        if (tag.parentId === this.state.customTag.id) {
            let newChildrens = this.state.customTag.childrens;
            delete newChildrens[index]
            this.setState({
                customTag: { ...this.state.customTag, ...{ childrens: newChildrens } }
            });
        }
        this.props.onRemove(tag)
    }

    render() {
        return (
            <details className='custom-tag-item' open={true}>
                <summary>
                    <label htmlFor={`custom-tag-name-${this.state.customTag.id}`}>Name:</label>
                    <input
                        name={`custom-tag-name-${this.state.customTag.id}`}
                        type="text"
                        value={this.state.customTag.name}
                        onChange={(e) => this.onEdit({ name: e.target.value })}
                    />
                    <label htmlFor={`custom-tag-description-${this.state.customTag.id}`}>Description:</label>
                    <input
                        name={`custom-tag-description-${this.state.customTag.id}`}
                        type="text"
                        value={this.state.customTag.description}
                        onChange={(e) => this.onEdit({ description: e.target.value })}
                    />
                    <button type="button" onClick={() => this.props.onRemove(this.state.customTag)}>
                        Delete
                    </button>
                </summary>

                <div className='custom-tag-item-children'>
                    <CustomTagsAddForm key={`custom-add-form-${this.state.customTag.id}`} parentId={this.state.customTag.id} onAdd={this.clickOnChildAdd} />

                    {this.state.customTag.childrens.map(((child, index) => (
                        <CustomTagItem
                            key={`${this.state.customTag.id}-${index}`}
                            customTag={child}
                            onAdd={this.clickOnChildAdd}
                            onEdit={(t) => this.clickOnChildEdit(index, t)}
                            onRemove={(t) => this.clickOnChildRemove(index, t)}
                        />
                    )))}
                </div>
            </details >
        );
    }
}

