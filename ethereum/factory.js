import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x8926ac8Bcb6B5ada073222aCD6375DFf189f26D6'
);

export default instance;