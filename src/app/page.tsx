'use client';
import { useEffect, useState } from 'react';
import factory from '../../factory';
import CampaignList from '@/components/CampaignList';
import { FaPlus } from 'react-icons/fa6';

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
    return <div>Loading...</div>;
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
