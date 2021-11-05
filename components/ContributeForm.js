import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { Router } from '../routes';

const ContributeForm = () => {
    const[errMessage, setErrorMessage] = useState('');
    const[contribution, setContribution] = useState('');
    const[isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        
        try{
            /*const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minimumContribution)
                .send({
                    from: accounts[0]
                });*/

            Router.pushRoute('/');
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
