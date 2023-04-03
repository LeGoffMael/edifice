import { useState, useRef, useCallback, useEffect, ReactElement } from 'react';
import '@/components/Sidebar.css';

type Props = {
    children: ReactElement | ReactElement[];
};

export default function Sidebar(props: Props) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(268);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback(
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

    useEffect(() => {
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
                {props.children}
            </div>
            <div className='sidebar-resizer' onMouseDown={startResizing} />
        </div>
    );
}
