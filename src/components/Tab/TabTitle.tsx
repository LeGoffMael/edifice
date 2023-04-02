import { useCallback } from 'react';

import './Tab.css';

export type Props = {
    title: string;
    index: number;
    setSelectedTab: (index: number) => void;
    isActive?: boolean;
};

export default function TabTitle(props: Props) {
    const { title, setSelectedTab, index, isActive } = props;

    const handleOnClick = useCallback(() => {
        setSelectedTab(index);
    }, [setSelectedTab, index]);

    return (
        <li className={`tab-title ${isActive ? 'active' : ''}`}>
            <button onClick={handleOnClick}>{title}</button>
        </li>
    );
};