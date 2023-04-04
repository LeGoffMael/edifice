import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import '@/components/Modal.css';

type Props = {
  canPop?: boolean;
  children: ReactElement | ReactElement[];
};

export default function Modal(props: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="modal-wrapper"
      onClick={(props.canPop ?? true) ? () => navigate(-1) : undefined}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}