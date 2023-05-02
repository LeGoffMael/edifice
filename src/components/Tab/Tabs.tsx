import { ReactElement, useState } from 'react';

import '@/components/Tab/Tab.css';
import TabTitle, { Props as TabTitleProps } from '@/components/Tab/TabTitle';

type Props = {
    children: ReactElement<TabTitleProps>[];
    preSelectedTabIndex?: number;
};

export default function Tabs(props: Props) {
    const { children, preSelectedTabIndex } = props;

    // First tab is shown by default
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(preSelectedTabIndex || 0);

    return (
        <div className='tabs'>
            <ul className='tabs-titles'>
                {children.map((item, index) => (
                    <TabTitle
                        key={item.props.title}
                        title={item.props.title}
                        index={index}
                        isActive={index === selectedTabIndex}
                        setSelectedTab={setSelectedTabIndex}
                    />
                ))}
            </ul>

            {/* show selected tab by index*/}
            {children[selectedTabIndex]}
        </div>
    );
};