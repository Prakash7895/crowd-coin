import NewCampaignForm from '@/components/NewCampaignForm';
import Title from '@/components/Title';
import React from 'react';

const page = () => {
  return (
    <div>
      <Title text='Creat New Campaign' />
      <NewCampaignForm />
    </div>
  );
};

export default page;
