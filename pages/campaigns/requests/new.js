import React, {useState} from 'react';
import Layout from '../../../components/Layout';
import {Form, Input, Button, Message} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link, Router} from '../../../routes';

const newRequest = (props) => {
    const[amount, setAmount] = useState('');
    const[description, setDescription] = useState('');
    const[recipient_name, setRecipientName] = useState('');
    const[recipient_address, setRecipientAddress] = useState('');
    const[errMessage, setErrorMessage] = useState('');
    const[isLoading, setIsLoading] = useState(false);

    const onSubmit = async event => {
        event.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        const campaign = Campaign(props.address);

        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(amount, 'ether'),
                recipient_address,
                recipient_name
            ).send({ from: accounts[0] });

            Router.pushRoute(`/campaigns/${props.address}/requests`);
        } catch (err) { setErrorMessage(err.message); }

        setIsLoading(false);
    }

    return (
        <Layout>
            <Link route={`/campaigns/${props.address}/requests`}>
                <a>
                    <Button size='mini'>Back</Button>
                </a>
            </Link>

            <h2>Create a request<br/><span style={{fontSize:'80%'}}><i>for the campaign  {props.address}</i></span></h2>
            <Form onSubmit={event => onSubmit(event)} error={!!errMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input defaultValue={description} onChange={(event) => {setDescription(event.target.value)}} />
                </Form.Field>
                <Form.Field>
                    <label>Amount of ether</label>
                    <Input defaultValue={amount} onChange={(event) => {setAmount(event.target.value)}} />
                </Form.Field>
                <Form.Field>
                    <label>Recipient name</label>
                    <Input defaultValue={recipient_name} onChange={(event) => {setRecipientName(event.target.value)}} />
                </Form.Field>
                <Form.Field>
                    <label>Recipient (address)</label>
                    <Input defaultValue={recipient_address} onChange={(event) => {setRecipientAddress(event.target.value)}} />
                </Form.Field>

                <Message error header="Attention" content={errMessage} /> 
                <Button primary loading={isLoading}>Create!</Button>
            </Form>
        </Layout>
    )
}

newRequest.getInitialProps = async (props) => {
    const { address } = props.query;

    return { address };
}

export default newRequest
