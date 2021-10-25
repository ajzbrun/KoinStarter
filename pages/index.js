import React, { useState, useEffect } from 'react'
import 'semantic-ui-css/semantic.min.css'
import factory from '../ethereum/factory';
import { Card } from 'semantic-ui-react';


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
        <div>
            <h1>Campaigns list:</h1>

            
            <Card.Group items={actualCampaigns} />
        </div>
    )
}

CampaignIndex.getInitialProps = async () => {
    const all_campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns: all_campaigns };
}

export default CampaignIndex
