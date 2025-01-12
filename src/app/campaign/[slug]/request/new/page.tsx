'use client';
import Breadcrumbs from '@/components/Breadcrumbs';
import RequestForm from '@/components/RequestForm';
import { usePathname } from 'next/navigation';
import React from 'react';

const NewRequest = () => {
  const pathName = usePathname();

  return (
    <div className='px-[var(--padding-card)]'>
      <div className='flex justify-between items-center'>
        <Breadcrumbs
          list={[
            {
              label: 'Campaign Details',
              link: pathName.substring(0, pathName.lastIndexOf('/request/new')),
            },
            {
              label: 'New Request',
            },
          ]}
        />
      </div>
      <RequestForm />
    </div>
  );
};

export default NewRequest;
