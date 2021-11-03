import React from 'react';

//components
import Layout from '../../components/Layout';

const CampaignDetails = (props) => {
    
    return (
        <Layout>
            <h2>Campaign details</h2>



        </Layout>
    )
}

CampaignDetails.getInitialProps = async (props) => {
    const campaignAddress = props.query.address;


    return props;
}

export default CampaignDetails;
