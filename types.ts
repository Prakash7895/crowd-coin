import { Contract } from 'web3';
import compiledCampaign from './eth-build/Campaign.json';

const campaignInterface = JSON.parse(compiledCampaign.interface);

export type CampaignContract = Contract<typeof campaignInterface>;

export interface RequestType {
  approvalCount: number;
  complete: boolean;
  description: string;
  recipient: string;
  value: number;
}
