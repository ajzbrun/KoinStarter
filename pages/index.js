import React, { useState, useEffect } from 'react'
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';

//components
import Layout from '../components/Layout';


const CampaignIndex = ({campaigns}) => {
    
    const[actualCampaigns, setActualCampaigns] = useState([]);

    //commented this part because we're using the getInitialProps method (of Next.js) to fetch de campaigns from the backend
    /*const[campaigns, setCampaigns] = useState([]);
    useEffect(async () => {
        const all_campaigns = await factory.methods.getDeployedCampaigns().call();
        setCampaigns(all_campaigns);
    }, []);*/

    useEffect(() => {
        let items = campaigns.map((address) => {
            return ({
                header: address,
                description: <a>View details</a>,
                fluid: true //width 100% of its parent container
            })
        });

        setActualCampaigns(items);
    }, []);

    return (
        <Layout>
            <h3>Open campaigns</h3>

            <Link route='/campaigns/new'>
                <Button floated="right" content='Create campaign' icon='plus' labelPosition='left' primary />
            </Link>

            <Card.Group items={actualCampaigns} />
        </Layout>
    )
}

CampaignIndex.getInitialProps = async () => {
    const all_campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns: all_campaigns };
}

export default CampaignIndex
