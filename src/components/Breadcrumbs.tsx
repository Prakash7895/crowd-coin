import Title from './Title';
import Link from 'next/link';
import React, { FC, ReactNode } from 'react';

interface IBreadcrumbs {
  list: {
    label: string;
    link?: string;
    renderer?: (label: string, link?: string) => ReactNode;
  }[];
}

const Breadcrumbs: FC<IBreadcrumbs> = ({ list }) => {
  return (
    <div className='breadcrumbs text-sm'>
      <ul className='text-lg'>
        {list.map((el) => {
          if (el.link) {
            return (
              <li key={el.link}>
                {el.renderer ? (
                  el.renderer(el.label, el.link)
                ) : (
                  <Link href={el.link}>{el.label}</Link>
                )}
              </li>
            );
          }
          return (
            <li key={el.label}>
              {el.renderer ? (
                el.renderer(el.label, el.link)
              ) : (
                <Title text={el.label} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
