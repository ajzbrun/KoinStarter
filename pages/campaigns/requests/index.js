import React from 'react';
import {Button} from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import {Link} from '../../../routes';

const index = (props) => {
    return (
        <Layout>
            <h2>Requests of the campaign <span style={{fontSize:'80%'}}><i>{props.address}</i></span></h2>

            <Link route={`/campaigns/${props.address}/requests/new`}>
                <a>
                    <Button primary>Add request</Button>
                </a>
            </Link>
        </Layout>
    )
}

index.getInitialProps = async (props) => {
    const { address } = props.query;

    return { address };
}

export default index
