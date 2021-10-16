const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'egg tribe grunt spin then file raven senior finish february involve juice',
    'https://rinkeby.infura.io/v3/0fa4c2909d914bfea1ff826ec877ec0c'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account: ', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0] });

    console.log('Contract deployed to: ', result.options.address);
}
deploy();
//deployed contract into rinkeby network: 0x968606cb27f079E0617db61f1BEBf04C46F155C1