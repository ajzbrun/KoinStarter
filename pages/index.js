import React, { useState, useEffect } from 'react'
import factory from '../ethereum/factory';

const CampaignIndex = () => {
    const[campaigns, setCampaigns] = useState([]);

    useEffect(async () => {
        const all_campaigns = await factory.methods.getDeployedCampaigns().call();
        setCampaigns(all_campaigns);

        console.log(campaigns);
    }, []);

    return (
        <h1>
            Campaign list:
            {campaigns.map((c, idx) => {
                return <h6>
                    Campaign #{idx+1}: {c}
                </h6>;
            })}
        </h1>
    )
}

export default CampaignIndex
