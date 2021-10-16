const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    /*const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];*/
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //newer syntax: obj destructuring
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress //we pass the already deployed (by the factory) campaign, to get the actual instance of the deployed campaign
    );
});

describe('campaigns', () => {
    it('successfully deployed contracts', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('manager correctly assigned', async () => {
        const actual_manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], actual_manager);
    });

    it('check that contributor is approver', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });

        const is_contributor = await campaign.methods.approvers(accounts[1]).call();

        assert(is_contributor);
    });

    it('requires a minimum contribution', async () => {
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '1'
            });
            assert(false);
        } catch (err) {
            assert(true); //sholud come into catch for the test to pass
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Batteries purchaes', '100', accounts[1], 'batteries supplier')
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Batteries purchaes', request.description);
    });

    it('forbid that non-manager user solicit a payment request', async () => {
        try{
            await campaign.methods
                .createRequest('new request', '100000', accounts[1], 'provider name')
                .send({
                    from: accounts[1], //non-manager account
                    gas: '1000000'
                });

            assert(false);
        } catch (err) {
            assert(true);
        }
    });

    it('processes requests', async () => {
        let previous_balance = await web3.eth.getBalance(accounts[1]);
        previous_balance = web3.utils.fromWei(previous_balance, 'ether');
        previous_balance = parseFloat(previous_balance);

        //contribute to the campaign
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        //the manager creates a payment request
        await campaign.methods 
            .createRequest('New payment request', web3.utils.toWei('5', 'ether'), accounts[1], 'Provider name')
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        
        //a contributor approves the previously created payment request
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        //once the payment request has at least 50% of approvement (at this point has the 100%, ie 1 vote), we finalize it
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        //check that the provider account (accounts[1]) has the 5 eth of the payment request yet
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > (previous_balance + 4)); //check that has at least 4 eth more than before (few cents lost between transactions)
    });
});