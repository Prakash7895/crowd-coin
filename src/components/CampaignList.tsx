import React, { FC } from 'react';
import CampaignItem from './CampaignItem';
import Link from 'next/link';
import Title from './Title';

interface CampaignListProp {
  data: string[];
}

const CampaignList: FC<CampaignListProp> = ({ data }) => {
  return (
    <div>
      <div className='flex justify-between items-center px-[var(--padding-card)]'>
        <Title text='All Campaigns' />
        <Link href='/new-campaign' className='btn btn-active btn-link'>
          Create New Campaign
        </Link>
      </div>
      {data.map((el, idx) => (
        <CampaignItem key={el} address={el} index={idx + 1} />
      ))}
    </div>
  );
};

export default CampaignList;
