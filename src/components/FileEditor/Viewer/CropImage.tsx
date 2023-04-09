import React from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import '@/components/FileEditor/Viewer/CropImage.css';

type CropImageProps = {
    datasetId: string,
    imagePath: string;
    canCrop: boolean;
};

type CropImageState = {
    crop: Point;
    zoom: number;
};

const defaultCropState: CropImageState = {
    crop: { x: 0, y: 0 },
    zoom: 1,
};

export default class CropImage extends React.Component<CropImageProps, CropImageState> {
    constructor(props: CropImageProps) {
        super(props);
        this.state = defaultCropState;
    }

    componentDidUpdate(prevProps: CropImageProps) {
        if (this.props.canCrop && prevProps.imagePath !== this.props.imagePath) {
            // TODO: should come from back (https://github.com/d8ahazard/sd_smartprocess)
            // reset crop and zoom when image source changed
            this.setState(defaultCropState);
        }
    }

    onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
        console.log(croppedArea, croppedAreaPixels);
    }

    render() {
        return (
            <div className={`crop-container ${this.props.canCrop == false && 'disabled'}`}>
                <Cropper
                    image={`/api/load_file?dataset_id=${this.props.datasetId}&path=${this.props.imagePath}`}
                    showGrid={this.props.canCrop}
                    crop={this.state.crop}
                    zoom={this.state.zoom}
                    aspect={1 / 1}
                    onCropChange={(crop) => this.props.canCrop ? this.setState({ crop: crop }) : undefined}
                    onCropComplete={this.props.canCrop ? this.onCropComplete : undefined}
                    onZoomChange={this.props.canCrop ? (zoom) => this.setState({ zoom: zoom }) : undefined}
                />
            </div >
        );
    }
}