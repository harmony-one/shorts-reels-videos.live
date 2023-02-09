import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecIcon } from './icons/RecIcon';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { Button } from 'components/Button';

export const Header = observer(() => {
    const navigator = useNavigate();
    const { user } = useStores();

    return (
        <Box direction="row" justify="between" pad={{ horizontal: 'large' }} wrap={true}>
            <Box margin={{ top: 'large' }}>
                {
                    user.address ?
                        <div className='App-address'>
                            Your address: <span style={{ color: '#38b3ff' }}>
                                {user.address.slice(0, 8)}...{user.address.slice(35)}
                            </span>
                        </div> :
                        <Button onClick={() => user.signIn()}>
                            Connect to Metamask
                        </Button>
                }
            </Box>

            <Box direction="row" margin={{ top: 'large' }}>
                {window.location.pathname === '/' &&
                    <Button onClick={() => navigator('/go-live')}>
                        <RecIcon style={{ marginRight: 10 }} />
                        Go Live
                    </Button>
                }

                <Button
                    onClick={() => navigator('/')}
                    margin={{ left: "30px" }}
                >
                    {"All Streams"}
                </Button>
            </Box>
        </Box>
    );
})
