import React, { useState, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';

//components
import Layout from '../components/Layout';


const CampaignIndex = ({campaigns}) => {
    
    const[actualCampaigns, setActualCampaigns] = useState([]);

    //I commented this part because we're using the getInitialProps method (of Next.js) to fetch de campaigns from the backend
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
            <h1>Open campaigns</h1>

            <Button floated="right" content='Create campaign' icon='plus' labelPosition='left' primary />

            <Card.Group items={actualCampaigns} />
        </Layout>
    )
}

CampaignIndex.getInitialProps = async () => {
    const all_campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns: all_campaigns };
}

export default CampaignIndex
