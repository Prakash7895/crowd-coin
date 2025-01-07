'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const page = () => {
  const param = useParams();
  console.log('param', param);

  return <div>campaign {param.slug}</div>;
};

export default page;
