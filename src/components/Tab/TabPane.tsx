import { ReactElement } from 'react';

type Props = {
    title: string;
    children: ReactElement | ReactElement[];
};

export default function TabPane({ children }: Props) {
    return <div>{children}</div>;
}