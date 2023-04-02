import { ReactElement } from 'react';

type Props = {
    title: string;
    children: ReactElement | ReactElement[];
};

export default function TabPane(props: Props) {
    return <div>{props.children}</div>;
}