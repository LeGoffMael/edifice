import React from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import '@/components/FileEditor/Viewer/CropImage.css';

type CropImageProps = {
    imagePath: string;
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
        if (prevProps.imagePath !== this.props.imagePath) {
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
            <div className='crop-container'>
                <Cropper
                    image={'/api/load_file?path=' + this.props.imagePath}
                    crop={this.state.crop}
                    zoom={this.state.zoom}
                    aspect={1 / 1}
                    onCropChange={(crop) => this.setState({ crop: crop })}
                    onCropComplete={this.onCropComplete}
                    onZoomChange={(zoom) => this.setState({ zoom: zoom })}
                />
            </div>
        );
    }
}