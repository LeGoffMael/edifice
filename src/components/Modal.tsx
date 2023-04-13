import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import '@/components/Modal.css';

type Props = {
  title?: ReactElement;
  titleString?: string;
  canPop?: boolean;
  children: ReactElement | ReactElement[];
};

export default function Modal(props: Props) {
  const navigate = useNavigate();
  const canPop = props.canPop ?? true;

  return (
    <div
      className={`modal-wrapper ${props.canPop === false && 'unclosable'}`}
      onClick={canPop ? () => navigate(-1) : undefined}
    >
      <div
        className="modal-body"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-title">
          {props.titleString !== undefined ? <h2>{props.titleString}</h2> : props.title !== undefined ? props.title : null}
          {canPop && <span className="modal-close" onClick={() => navigate(-1)}>&times;</span>}
        </div>

        <div className="modal-content">
          {props.children}
        </div>
      </div>
    </div>
  );
}