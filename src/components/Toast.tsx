import React, { FC, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface IToast {
  type: 'info' | 'success' | 'error' | 'warning';
  title: string;
  message: string;
  visible: boolean;
  onHide?: () => void;
}

const Toast: FC<IToast> = ({
  message,
  title,
  visible,
  type = 'info',
  onHide,
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (show) {
      interval = setInterval(() => {
        setShow(false);
        onHide?.();
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [show]);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  if (!show) {
    return <></>;
  }

  return (
    <div className='toast toast-top toast-end'>
      <IoMdClose
        className='absolute right-6 top-6 cursor-pointer'
        size={24}
        onClick={() => {
          setShow(false);
          onHide?.();
        }}
      />
      <div
        className={`alert flex flex-col gap-0 justify-start items-start ${
          type === 'warning'
            ? 'alert-warning'
            : type === 'error'
            ? 'alert-error'
            : type === 'success'
            ? 'alert-success'
            : 'alert-info'
        }`}
      >
        <p className='font-semibold'>{title}</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
