'use client';
import Link from 'next/link';
import useCampaign from '@/hooks/useCampaign';
import InfoCard from '@/components/InfoCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContributeForm from '@/components/ContributeForm';
import { useParams, usePathname } from 'next/navigation';
import Title from '@/components/Title';
import { useState } from 'react';

const Page = () => {
  const param = useParams();
  const pathName = usePathname();

  const [refetchCount, setRefetchCount] = useState(0);

  const {
    campaignInfo,
    campaignRef,
    loading: isLoading,
  } = useCampaign(param.slug as string, refetchCount);

  const items = [
    {
      title: campaignInfo?.manager,
      subTitle: 'Address of Manager',
      description:
        'The manager created this campaign and can create requests to withdraw money.',
      className: 'col-span-full card ',
    },
    {
      title: campaignInfo?.minimumContribution,
      subTitle: 'Minimum Contribution (wei)',
      description:
        'You must contribute at least this much wei to become an approver.',
    },
    {
      title: campaignInfo?.totalRequests,
      subTitle: 'Number of Requests',
      description:
        'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
    },
    {
      title: campaignInfo?.approversCount,
      subTitle: 'Number of Approvers',
      description:
        'Number of people who have already donated to this campaign.',
    },
    {
      title: campaignInfo?.balance,
      subTitle: 'Campaign Balance (wei)',
      description:
        'The balance is how much money this campaign has left to spend.',
    },
  ];

  return (
    <div className='px-[var(--padding-card)]'>
      <div className='flex justify-between items-center'>
        <Breadcrumbs
          list={[
            {
              label: 'Campaign Details',
            },
          ]}
        />
        <Link
          href={`${pathName}/request/new`}
          className='btn btn-active btn-link'
        >
          Create New Request
        </Link>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2'>
        {!isLoading && campaignRef.current && (
          <div className='order-1 lg:order-2'>
            <ContributeForm
              minimumAmount={+(campaignInfo!.minimumContribution! || 0)}
              campaignRef={campaignRef}
              onSuccess={() => setRefetchCount((p) => p + 1)}
            />
          </div>
        )}
        <div className='order-2 lg:order-1 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {items.map((el) => (
            <InfoCard
              key={el.subTitle}
              title={
                isLoading ? (
                  <p className='skeleton w-full h-8'></p>
                ) : (
                  <Title text={el.title as string} className='text-lg' />
                )
              }
              subTitle={<p className='text-gray-400 mt-1'>{el.subTitle}</p>}
              description={el.description}
              className={`${el.className} card bg-base-100 p-4 gap-4`}
            />
          ))}
        </div>
      </div>
      <div className='mt-5'>
        <Link className='btn btn-secondary' href={`${pathName}/request`}>
          View Requests
        </Link>
      </div>
    </div>
  );
};

export default Page;
