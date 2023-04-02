import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import './CropImage.css';

function CropImage() {
    const selectedFile = useAppSelector((state: RootState) => state.files.selectedFile)
    const status = useAppSelector((state: RootState) => state.files.status)
    const error = useAppSelector((state: RootState) => state.files.error)

    // TODO: should come from back (https://github.com/d8ahazard/sd_smartprocess)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            console.log(croppedArea, croppedAreaPixels);
        },
        []
    );

    let content
    if (status === 'loading') {
        content = <p className='status'>Loading...</p>
    } else if (status === 'succeeded') {
        if (selectedFile === null) {
            content = <p className='status'>No file selected.</p>
        } else {
            console.log(selectedFile.path);

            content = (
                <Cropper
                    image={'/api/load_file?path=' + selectedFile.path}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            )
        }
    } else if (status === 'failed') {
        content = <div className='status'>{error}</div>
    }

    return (
        <div className='crop-container'>
            {content}
        </div>
    );
};

export default CropImage;
