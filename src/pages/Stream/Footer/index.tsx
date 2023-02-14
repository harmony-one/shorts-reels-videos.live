import React from "react";
import { BiDonateHeart } from '@react-icons/all-files/bi/BiDonateHeart';
import { BiChat } from '@react-icons/all-files/bi/BiChat';
import { AiOutlineHeart } from '@react-icons/all-files/ai/AiOutlineHeart';
import { Box, BoxProps } from "grommet";
import { observer } from "mobx-react-lite";
import { useStores } from "stores";
import { Button } from "components/Button";
import { FaStop } from '@react-icons/all-files/fa/FaStop';
import { useMediaQuery } from "react-responsive";
// import { AiFillHeart } from '@react-icons/all-files/ai/AiFillHeart';

export const StreamFooter = observer((props: BoxProps) => {
    const { stream, chat } = useStores();
    const isSmallMobile = useMediaQuery({ query: '(max-width: 500px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' })

    const streamStarted = !!stream.localParticipant && !stream.startStreamLoading;

    return <Box
        direction="row"
        gap="30px"
        justify={isSmallMobile && streamStarted ? 
            "between" : isTabletOrMobile ? "center" : "between"}
        align="center"
        fill={true}
        pad={{ horizontal: isSmallMobile ? 'xxsmall' : 'large' }}
        wrap={true}
        {...props}
    >
        {streamStarted &&
            <Button
                onClick={stream.stopStream}
            >
                <FaStop style={{ marginRight: 10 }} />
                {!isSmallMobile ? "Stop Stream" : "Stop"}
            </Button>
        }

        <Box
            direction="row"
            gap="30px"
            justify="end"
            align="center"
        >
            <Box
                onClick={() => stream.likeLiveStream()}
                align="center"
                direction="row"
                style={{ cursor: 'pointer' }}
            >
                <AiOutlineHeart color="#38b3ff" size="24px" />
                <span style={{
                    color: '#38b3ff',
                    margin: '0 0 1px 5px',
                    fontSize: 18
                }}>
                    {stream.data.totalLikes}
                </span>
            </Box>

            <div onClick={() => { }} style={{ cursor: 'pointer' }}>
                <BiDonateHeart color="#38b3ff" size="24px" />
            </div>

            <div onClick={() => chat.toggleChatVisible()} style={{ cursor: 'pointer' }}>
                <BiChat color="#38b3ff" size="24px" />
            </div>
        </Box>
    </Box>
})
