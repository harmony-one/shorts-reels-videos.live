import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecIcon } from './icons/RecIcon';
import { Box, Text } from 'grommet';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { Button } from 'components/Button';
import { MetamaskButton } from 'components/MetamaskButton';
import { useMediaQuery } from 'react-responsive';
import { openGoLiveModal } from './components/GoLiveModal';

export const Header = observer(() => {
    const navigator = useNavigate();
    const { user, modals } = useStores();
    const isSmallMobile = useMediaQuery({ query: '(max-width: 500px)' })

    return (
        <Box
            direction="row"
            justify={isSmallMobile ? "center" : "between"}
            align="center"
            wrap={true}
            gap="10px"
        >
            <Box margin={{ top: 'medium' }}>
                {
                    user.isInitilized ?
                        user.address ?
                            <Text size="18px">
                                Your address: <span style={{ color: '#38b3ff' }}>
                                    {user.address.slice(0, 8)}...{user.address.slice(35)}
                                </span>
                            </Text> :
                            <MetamaskButton
                                active={true}
                                onClick={() => user.signIn()}
                            /> :
                        null
                }
            </Box>

            <Box direction="row" margin={{ top: 'medium' }} gap="30px">
                {/* {window.location.pathname === '/' && user.address &&
                    <Button onClick={() => openGoLiveModal(
                        modals,
                        async ({ value }) => {
                            navigator(`/${value}`)
                        })
                    }>
                        <RecIcon style={{ marginRight: 10 }} />
                        Go Live
                    </Button>
                }

                <Button onClick={() => navigator('/')} >
                    {"All Streams"}
                </Button> */}
            </Box>
        </Box>
    );
})
