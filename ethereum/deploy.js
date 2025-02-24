require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledFactory = require('../eth-build/CampaignFactory.json');

const provider = new HDWalletProvider(
  process.env.TWELVE_WORDS_MNEMONIC_PHRASE,
  process.env.NEXT_PUBLIC_SEPOLIA_LINK
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('accounts', accounts);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to ', result.options.address);
  provider.engine.stop();
};

deploy();
