import React, { ReactElement, useState } from 'react';

import './Tab.css';
import TabTitle, { Props as TabTitleProps } from './TabTitle';

type Props = {
    children: ReactElement<TabTitleProps>[];
    preSelectedTabIndex?: number;
};

function Tabs(props: Props): JSX.Element {
    const { children, preSelectedTabIndex } = props;

    // First tab is shown by default
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(preSelectedTabIndex || 0);

    return (
        <div className='tabs'>
            <ul>
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

export default Tabs;