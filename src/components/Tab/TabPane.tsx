import { ReactElement } from 'react';

type Props = {
    title: string;
    children: ReactElement | ReactElement[];
};

function TabPane({ children }: Props): JSX.Element {
    return <div>{children}</div>;
}

export default TabPane;