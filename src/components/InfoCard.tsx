import React, { FC, ReactNode } from 'react';

interface IInfoCard {
  title: ReactNode;
  subTitle: ReactNode;
  description: ReactNode;
  className?: string;
}

const InfoCard: FC<IInfoCard> = ({
  title,
  subTitle,
  className,
  description,
}) => {
  return (
    <div className={className}>
      <div>
        <div>{title}</div>
        <div>{subTitle}</div>
      </div>
      <div>{description}</div>
    </div>
  );
};

export default InfoCard;
