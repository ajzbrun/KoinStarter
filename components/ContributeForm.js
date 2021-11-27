import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../routes';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm = ({ campaignAddress }) => {
    const[errMessage, setErrorMessage] = useState('');
    const[contribution, setContribution] = useState('');
    const[isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(campaignAddress);

        setErrorMessage('');
        setIsLoading(true);
        
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contribution, 'ether')
            });

            //NOT REFRESHINGGG
            //Router.replaceRoute(`/campaigns/${campaignAddress}`);

            Router.reload(); //temporal fix to refresh. (ugly because it refreshes the screen)

        } catch (err) {
            setErrorMessage(err.message);
        }
        setIsLoading(false);
    }

    return (
        <Form onSubmit={onSubmit} error={!!errMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input 
                    label='ether' 
                    labelPosition='right' 
                    defaultValue={contribution} 
                    onChange={event => setContribution(event.target.value)} 
                />
            </Form.Field>

            <Message error header="Attention" content={errMessage} /> 
            <Button type='submit' loading={isLoading} primary>Contribute!</Button>
        </Form>
    )
}

export default ContributeForm;
