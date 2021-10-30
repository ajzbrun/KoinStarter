import React, {useState} from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

//components
import Layout from '../../components/Layout';

const newCampaign = () => {
    const[minimumContribution, setMinimumContribution] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();
        await factory.methods
            .createCampaign(minimumContribution)
            .send({
                from: accounts[0]
            });
    }

    return (
        <Layout>
            <h3>Create a Campaign</h3>
            
            <Form onSubmit={onSubmit}>
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
                    <label>By submitting I agree to the Terms and Conditions of KoinStarter</label>
                </Form.Field>
                <Button type='submit' primary>Create</Button>
            </Form>
        </Layout>
    )
}

export default newCampaign
