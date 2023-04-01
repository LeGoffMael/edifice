import React, { useState, useEffect } from 'react';
import { File } from '../../models/file';
import FileItem from './FileItem';
import './Explorer.css';

function Explorer() {
    const [filesList, setFilesList] = useState([]);

    useEffect(() => {
        fetch('/api/files?' + new URLSearchParams({
            path: '/Users/mlegoff/Workspace',
            extensions: '.png,.jpg,.jpeg,.gif',
            recursive: 'true',
        }
        )).then(res => res.json()).then(data => {
            setFilesList(data);
        });
    }, []);

    return (
        <div className='explorer'>
            <div className='explorer-title'>
                <h2>Explorer</h2>
                <span>{filesList.length} elements</span>
            </div>
            <div className='explorer-list'>
                {filesList.map(((item, index) => (
                    <FileItem
                        key={new File(JSON.parse(item)).path}
                        file={new File(JSON.parse(item))}
                        index={index}
                    />
                )))}
            </div>
        </div>

    );
}
export default Explorer;