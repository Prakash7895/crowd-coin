'use client';
import React, { createContext, FC, ReactNode, useState } from 'react';
import Toast from './Toast';

interface ContextState {
  show: boolean;
  message: string;
  title: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export const ContextToast = createContext<{
  setState: React.Dispatch<React.SetStateAction<ContextState>>;
}>({
  setState: () => {},
});

const ToastContext: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ContextState>({
    show: false,
    message: '',
    title: '',
    type: 'info',
  });

  return (
    <ContextToast.Provider value={{ setState }}>
      <Toast
        visible={state.show}
        title={state.title}
        message={state?.message}
        type={state.type}
        onHide={() =>
          setState({ show: false, message: '', title: '', type: 'info' })
        }
      />
      {children}
    </ContextToast.Provider>
  );
};

export default ToastContext;
