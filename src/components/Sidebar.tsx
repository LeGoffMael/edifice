import React, { useState, useRef } from 'react';
import Explorer from './File/Explorer';
import './Sidebar.css';

function Sidebar() {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(268);

    const startResizing = React.useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback(
        (mouseMoveEvent: MouseEvent) => {
            if (isResizing) {
                setSidebarWidth(
                    mouseMoveEvent.clientX -
                    (sidebarRef?.current?.getBoundingClientRect().left ?? 0)
                );
            }
        },
        [isResizing]
    );

    React.useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div
            ref={sidebarRef}
            className={`sidebar ${isResizing ? 'resizing' : ''}`}
            style={{ width: sidebarWidth }}
            onMouseDown={(e) => e.preventDefault()}
        >
            <div className='sidebar-content'>
                <Explorer />
            </div>
            <div className='sidebar-resizer' onMouseDown={startResizing} />
        </div>
    );
}

export default Sidebar;
