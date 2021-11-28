import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';

//components
import RequestRow from '../../../components/RequestRow';

const index = (props) => {
    const {Header, Row, HeaderCell, Cell, Body} = Table;

    return (
        <Layout>
            <Link route={`/campaigns/${props.address}`}>
                <a>
                    <Button size='mini'>Back</Button>
                </a>
            </Link>

            <h2>Requests of the campaign <span style={{fontSize:'80%'}}><i>{props.address}</i></span></h2>

            <Link route={`/campaigns/${props.address}/requests/new`}>
                <a>
                    <Button primary>Add request</Button>
                </a>
            </Link>

            <Table celled>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient name</HeaderCell>
                        <HeaderCell>Recipient address</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {props.requests.map((request, idx) => {
                        return <RequestRow
                            key={idx}
                            request={request}
                            address={props.address}
                        />
                    })}
                </Body>
            </Table>

        </Layout>
    )
}

index.getInitialProps = async (props) => {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return { address, requests };
}

export default index
