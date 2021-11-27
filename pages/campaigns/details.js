import React, { useState, useEffect } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';

//components
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';

const CampaignDetails = (summary) => {
    const[details, setDetails] = useState([]);
    
    useEffect(() => {
        let items = [
            {
                header: summary.manager,
                description:
                  'The manager created this campaign and can create requests to withdraw money',
                meta: 'Address of Manager',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: summary.minimumContribution,
                description:
                  'You must contribute at least this amount of wei to become an approver',
                meta: 'Minimum Contribution (wei)'
            },
            {
                header: summary.requestsCount,
                description:
                  'The manager creates request to withdraw money from the campaign. Every request must be approved by at least 50% of approvers',
                meta: 'Number of Requests'
            },
            {
                header: summary.approversCount,
                description:
                  'Number of people that has already donated to the campaign',
                meta: 'Number of Approvers'
            },
            {
                header: web3.utils.fromWei(summary.balance, 'ether'),
                description:
                  'The current balance of this campaign',
                meta: 'Campaign Balance (ether)'
            }
        ];

        setDetails(items);
    }, []);

    return (
        <Layout>
            <h2>Campaign details</h2>

            <Grid doubling stackable>
                <Grid.Row>
                    <Grid.Column width={12}>
                        {details.length != 0 ? <Card.Group items={details} /> : null }
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <ContributeForm campaignAddress={summary.campaignAddress} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${summary.campaignAddress}/requests`}>
                            <a>
                                <Button primary>View requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
}

CampaignDetails.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address)
    const summary = await campaign.methods.getSummary().call();
    
    return { 
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4],
        campaignAddress: props.query.address
    };
}

export default CampaignDetails;
