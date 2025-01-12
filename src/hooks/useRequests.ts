import web3 from '../../web3';
import { Numbers } from 'web3';
import { useEffect, useState } from 'react';
import { RequestType } from '../../types';
import campaignInstance from '../../campaign';

const useRequests = (address: string, refetchCount: number = 0) => {
  const [loading, setLoading] = useState(true);
  const [totalRequests, setTotalRequests] = useState(0);
  const [requests, setRequests] = useState<RequestType[]>([]);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      const campaign = campaignInstance(address);

      const requestCount = (await campaign.methods
        .getRequestCount()
        .call()) as unknown as Numbers;

      const reqCount = web3.utils.toNumber(requestCount) as number;
      setTotalRequests(reqCount);

      const requests = await Promise.all(
        Array(reqCount)
          .fill(0)
          .map((_, idx) => {
            return campaign.methods.requests(idx).call();
          })
      );

      setLoading(false);
      setRequests(
        requests.map((p: any) => ({
          approvalCount: web3.utils.toNumber(p.approvalCount) as number,
          complete: p.complete,
          description: p.description,
          recipient: p.recipient,
          value: +web3.utils.toWei(p.value, 'wei'),
        }))
      );
    };

    fetchCampaign();
  }, [address, refetchCount]);

  return {
    loading,
    requests,
    totalRequests,
  };
};

export default useRequests;
