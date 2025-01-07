import React, { FC } from 'react';

interface ITitle {
  text: string;
  className?: string;
}

const Title: FC<ITitle> = ({ text, className }) => {
  return <p className={`font-semibold ${className}`}>{text}</p>;
};

export default Title;
