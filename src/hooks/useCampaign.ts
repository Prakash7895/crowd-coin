import web3 from '../../web3';
import { CampaignContract } from '../../types';
import { RefObject, useEffect, useRef, useState } from 'react';
import campaignInstance, { fetchAccounts } from '../../campaign';

// Campaign info interface
interface CampaignInfo {
  manager: string;
  minimumContribution: string;
  balance: number | bigint;
  totalRequests: number;
  approversCount: number | bigint;
}

// Return type interface
interface CampaignHookReturn {
  loading: boolean;
  campaignInfo: CampaignInfo | null;
  campaignRef: RefObject<CampaignContract | null>;
}

const useCampaign = (
  address: string,
  refetchCount: number = 0
): CampaignHookReturn => {
  const [loading, setLoading] = useState(true);
  const campaignRef = useRef<CampaignContract>(null);
  const [campaignInfo, setCampaignInfo] = useState<CampaignInfo | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      const campaign = campaignInstance(address);
      const accounts = await fetchAccounts();
      console.log('accounts', accounts);
      campaignRef.current = campaign;

      const campInfo = (await campaign.methods
        .getSummary()
        .call()) as unknown as [string, string, string, string, string];

      setCampaignInfo({
        manager: campInfo[0],
        minimumContribution: web3.utils.toWei(campInfo[1], 'wei'),
        balance: web3.utils.toNumber(campInfo[2]),
        totalRequests: web3.utils.toNumber(campInfo[3]) as number,
        approversCount: web3.utils.toNumber(campInfo[4]),
      });

      setLoading(false);
    };

    fetchCampaign();
  }, [address, refetchCount]);

  return {
    loading,
    campaignInfo,
    campaignRef,
  };
};

export default useCampaign;
