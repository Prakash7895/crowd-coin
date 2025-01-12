'use client';
import factory from '../../factory';
import { FaPlus } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import CampaignList from '@/components/CampaignList';

export default function Home() {
  const [allCampaigns, setAllCampaigns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getContracts() {
      try {
        const campaigns = (await factory.methods
          .getDeployedCampaigns()
          .call()) as string[];
        setAllCampaigns(campaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getContracts();
  }, []);

  if (isLoading) {
    return (
      <div className='card bg-base-100 shadow-xl my-5'>
        <div className='card-body'>
          <p className='card-title skeleton w-1/3 h-10'></p>
          <p className='skeleton w-full h-10'></p>
          <div className='card-actions justify-end'>
            <button className='btn btn-outline btn-warning skeleton w-36'></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {allCampaigns.length === 0 ? (
        <div>
          <p className='flex items-center gap-1.5 justify-center'>
            No active campaigns found. Create a new campaign by clicking on
            <FaPlus /> icon
          </p>
        </div>
      ) : (
        <CampaignList data={allCampaigns} />
      )}
    </div>
  );
}
