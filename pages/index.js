import React, { useState, useEffect } from 'react'
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';

//components
import Layout from '../components/Layout';


const CampaignIndex = ({campaigns}) => {
    
    const[actualCampaigns, setActualCampaigns] = useState([]);
    const[welcomeMsg, setWelcomeMsg] = useState('');

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
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View details</a>
                    </Link>
                ),
                fluid: true //width 100% of its parent container
            })
        });

        setActualCampaigns(items);
        if(items.length == 0)
            setWelcomeMsg("There's no existing campaigns yet :/");

    }, []);

    return (
        <Layout>
            <h2>Open campaigns</h2>

            <Link route='/campaigns/new'>
                <a>
                <Button floated="right" content='Create campaign' icon='plus' labelPosition='left' primary />
                </a>
            </Link>

            {actualCampaigns.length != 0 ? <Card.Group items={actualCampaigns} /> : <h3>{welcomeMsg}</h3> }
            
        </Layout>
    )
}

CampaignIndex.getInitialProps = async () => {
    const all_campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns: all_campaigns };
}

export default CampaignIndex
