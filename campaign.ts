import web3 from './web3';
import Campaign from './eth-build/Campaign.json';

const campaignInstance = (address: string) =>
  new web3.eth.Contract(JSON.parse(Campaign.interface), address);

const fetchAccounts = async () => await web3.eth.getAccounts();

export { fetchAccounts };

export default campaignInstance;
