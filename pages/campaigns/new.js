import React, {useState} from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

//components
import Layout from '../../components/Layout';

const newCampaign = () => {
    const[errMessage, setErrorMessage] = useState('');
    const[minimumContribution, setMinimumContribution] = useState('');
    const[isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minimumContribution)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute('/');
        } catch (err) {
            setErrorMessage(err.message);
        }

        setIsLoading(false);
    }

    return (
        <Layout>
            <h2>Create a Campaign</h2>
            
            <Form onSubmit={onSubmit} error={!!errMessage}>
                <Form.Field>
                    <label>Minimum contribution</label>
                    <Input 
                        label='wei' 
                        labelPosition='right' 
                        defaultValue={minimumContribution} 
                        onChange={event => setMinimumContribution(event.target.value)} 
                    />
                </Form.Field>
                <Form.Field>
                    <label>By submitting you agree to the Terms and Conditions of KoinStarter</label>
                </Form.Field>

                <Message error header="Attention" content={errMessage} /> 
                <Button type='submit' loading={isLoading} primary>Create</Button>
            </Form>
        </Layout>
    )
}

export default newCampaign
