import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x968606cb27f079E0617db61f1BEBf04C46F155C1'
);

export default instance;