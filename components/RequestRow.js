import React, {useState} from 'react';
import {Button, Table, Message} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

const RequestRow = (props) => {
    const {Row, Cell} = Table;
    const readyToFinalize = props.request.approvalCount >= props.approversCount / 2;
    const[errMess01, setErrorMess01] = useState('');
    const[errMess02, setErrorMess02] = useState('');
    const[isLoad01, setIsLoad01] = useState(false);
    const[isLoad02, setIsLoad02] = useState(false);

    const onApprove = async () => {
        setErrorMess01('');
        setErrorMess02('');
        setIsLoad01(true);
        
        try{
            const campaign = Campaign(props.address);

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(props.id)
                .send({ from: accounts[0] });

            Router.reload();
        } catch(err) {
            setErrorMess01(err.message);
        }
        setIsLoad01(false);
    }

    const onFinalize = async () => {
        setErrorMess01('');
        setErrorMess02('');
        setIsLoad02(true);

        try{
            const campaign = Campaign(props.address);

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(props.id)
                .send({ from: accounts[0] });

            Router.reload();
        } catch(err) {
            setErrorMess02(err.message);
        }
        setIsLoad02(false);
    }

    return (
        <Row disabled={props.request.complete} positive={readyToFinalize && !props.request.complete}>
            <Cell>{props.id}</Cell>
            <Cell>{props.request.description}</Cell>
            <Cell>{web3.utils.fromWei(props.request.value, 'ether')}</Cell>
            <Cell>{props.request.recipient_name}</Cell>
            <Cell>{props.request.recipient}</Cell>
            <Cell>{props.request.approvalCount}/{props.approversCount}</Cell>
            <Cell>
                {props.request.complete ? null : (<Button color='green' basic size='tiny' onClick={onApprove} loading={isLoad01}>Approve</Button>)}
                <Message error hidden={errMess01 == ''} header="Attention" content={errMess01} />
            </Cell>
            <Cell>
                {
                    //check if the request isnt completed and is ready to be finalized, and only then we show the option
                    props.request.complete ? null : (
                        readyToFinalize ? <Button color='teal' basic size='tiny' onClick={onFinalize} loading={isLoad02}>Finalize</Button> : null
                    )
                }
                <Message error hidden={errMess02 == ''} header="Attention" content={errMess02} />
            </Cell>
        </Row>
    )
}

export default RequestRow;
