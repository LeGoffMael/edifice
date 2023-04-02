import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import './CropImage.css';

type Props = {
    imagePath: string;
};

export default function CropImage({ imagePath }: Props) {
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
                image={'/api/load_file?path=' + imagePath}
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