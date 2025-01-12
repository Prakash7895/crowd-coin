'use client';
import Link from 'next/link';
import useRequests from '@/hooks/useRequests';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { RequestType } from '../../../../../types';
import { FaCheckDouble, FaRegCopy } from 'react-icons/fa6';
import campaignInstance, { fetchAccounts } from '../../../../../campaign';
import useCampaign from '@/hooks/useCampaign';
import { useContext, useState } from 'react';
import { ContextToast } from '@/components/ToastContext';

const Request = () => {
  const pathName = usePathname();
  const address = pathName.split('/')[2];

  const [isLoading, setIsLoading] = useState(false);
  const { setState } = useContext(ContextToast);
  const [refetchCount, setRefetchCount] = useState(0);

  const { loading, requests, totalRequests } = useRequests(
    address,
    refetchCount
  );
  const { campaignInfo, loading: campaignInfoLoading } = useCampaign(address);

  const onApprove = async (idx: number) => {
    setIsLoading(true);
    const campaign = campaignInstance(address);
    const accounts = await fetchAccounts();

    try {
      await campaign.methods.approveRequest(idx).send({
        from: accounts[0],
      });

      setIsLoading(false);
      setRefetchCount((p) => p + 1);
      setState({
        show: true,
        type: 'success',
        title: 'Success',
        message: 'Request approved successfully!',
      });
    } catch (err) {
      console.log('err', err);
      setIsLoading(false);
      setState({
        show: true,
        type: 'error',
        title: 'Error',
        message:
          err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  };

  const onFinalize = async (idx: number) => {
    setIsLoading(true);
    const campaign = campaignInstance(address);
    const accounts = await fetchAccounts();

    try {
      await campaign.methods.finalizeRequest(idx).send({
        from: accounts[0],
      });

      setIsLoading(false);
      setRefetchCount((p) => p + 1);
      setState({
        show: true,
        type: 'success',
        title: 'Success',
        message: 'Request finalized successfully!',
      });
    } catch (err) {
      console.log('err', err);
      setIsLoading(false);
      setState({
        show: true,
        type: 'error',
        title: 'Error',
        message:
          err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  };

  const columns = [
    { label: 'Id', field: 'id' },
    { label: 'Description', field: 'description' },
    { label: 'Amount (wei)', field: 'value' },
    {
      label: 'Recipient',
      field: 'recipient',
      renderer: (dt: RequestType) => (
        <div className='flex gap-4 items-center'>
          <p>{dt.recipient.substring(0, 8)}</p>
          <button
            className='tooltip btn btn-sm btn-square flex justify-center items-center'
            data-tip='Copy Recipient Address'
          >
            <FaRegCopy
              className='cursor-pointer'
              size={18}
              onClick={() => navigator.clipboard.writeText(dt.recipient)}
            />
          </button>
        </div>
      ),
    },
    {
      label: 'Approval Count',
      field: 'approvalCount',
      renderer: (dt: RequestType) =>
        `${dt.approvalCount} / ${campaignInfo?.approversCount}`,
    },
    {
      label: 'Approve',
      field: 'approve',
      renderer: (dt: RequestType, idx?: number) => (
        <div>
          <button
            onClick={() => onApprove(idx!)}
            disabled={isLoading || dt.complete}
            className='btn btn-outline btn-success btn-sm'
          >
            Approve
          </button>
        </div>
      ),
    },
    {
      label: 'Finalize',
      field: 'complete',
      renderer: (dt: RequestType, idx?: number) => (
        <div>
          {!dt.complete ? (
            campaignInfoLoading ? (
              <p className='skeleton h-8 w-full'></p>
            ) : (
              <button
                onClick={() => onFinalize(idx!)}
                disabled={
                  isLoading ||
                  dt.approvalCount <=
                    ((campaignInfo?.approversCount as number) || 0) / 2
                }
                className='btn btn-outline btn-error btn-sm'
              >
                Finalize
              </button>
            )
          ) : (
            <p className='flex items-center gap-1'>
              <FaCheckDouble className='text-green-500' />
              Completed
            </p>
          )}
        </div>
      ),
    },
  ];

  console.log('req', requests);

  return (
    <div className='px-[var(--padding-card)]'>
      <div className='flex justify-between items-center'>
        <Breadcrumbs
          list={[
            {
              label: 'Campaign Details',
              link: pathName.substring(0, pathName.lastIndexOf('/request')),
            },
            {
              label: 'All Requests',
            },
          ]}
        />
        <Link href={`${pathName}/new`} className='btn btn-active btn-link'>
          Create New Request
        </Link>
      </div>
      <div className='overflow-x-auto card bg-base-100'>
        <table className='table'>
          <thead>
            <tr>
              {columns.map((el) => (
                <th key={el.field}>{el.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={columns.length}>
                      <p className='skeleton h-8 w-full'></p>
                    </td>
                  </tr>
                ))
            ) : requests.length > 0 ? (
              requests.map((el, idx) => (
                <tr
                  key={el.description}
                  className={`${
                    el.complete ? 'bg-base-200 text-gray-400' : 'hover'
                  } ${
                    el.approvalCount >
                    ((campaignInfo?.approversCount as number) || 0) / 2
                      ? 'bg-gray-800'
                      : ''
                  }`}
                >
                  {columns.map((c) => (
                    <td key={c.field}>
                      {c.field === 'id'
                        ? idx + 1
                        : c.renderer
                        ? c.renderer(el, idx)
                        : el[c.field as keyof typeof el]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No Request Present.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className='mt-2 ml-2'>Found {totalRequests} Request</p>
    </div>
  );
};

export default Request;
