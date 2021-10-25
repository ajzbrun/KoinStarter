import { loadGetInitialProps } from 'next/dist/shared/lib/utils';
import React, { useState, useEffect } from 'react'
import factory from '../ethereum/factory';


const CampaignIndex = ({campaigns}) => {
    
    //I commented this part because we're using the getInitialProps method (of Next.js) to fetch de campaigns from the backend
    /*const[campaigns, setCampaigns] = useState([]);
    useEffect(async () => {
        const all_campaigns = await factory.methods.getDeployedCampaigns().call();
        setCampaigns(all_campaigns);
    }, []);*/

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

CampaignIndex.getInitialProps = async () => {
    const all_campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns: all_campaigns };
}

export default CampaignIndex
