import React, { useState, useCallback, TouchEvent } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import './CropImage.css';

function CropImage() {
    // TODO: should come from back (https://github.com/d8ahazard/sd_smartprocess)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            console.log(croppedArea, croppedAreaPixels);
        },
        []
    );

    return (
        <div className='crop-container'>
            <Cropper
                image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </div>
    );
};

export default CropImage;
