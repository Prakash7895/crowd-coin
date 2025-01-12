'use client';
import web3 from './web3';
import CampaignFactory from './eth-build/CampaignFactory.json';

const factory = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS
);

export default factory;
