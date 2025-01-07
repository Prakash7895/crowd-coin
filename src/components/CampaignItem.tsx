import Link from 'next/link';
import React, { FC } from 'react';

interface CampaignItemProp {
  address: string;
  index: number;
}

const CampaignItem: FC<CampaignItemProp> = ({ address, index }) => {
  return (
    <div className='card bg-base-100 shadow-xl my-5'>
      <div className='card-body'>
        <p className='card-title'>Campaign #{index}</p>
        <p>{address}</p>
        <div className='card-actions justify-end'>
          <Link
            href={`/campaign/${address}`}
            className='btn btn-outline btn-warning'
          >
            View Campaign
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignItem;
