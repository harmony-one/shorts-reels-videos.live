import React from "react";
import { BiDonateHeart } from '@react-icons/all-files/bi/BiDonateHeart';
import { BiChat } from '@react-icons/all-files/bi/BiChat';
import { AiOutlineHeart } from '@react-icons/all-files/ai/AiOutlineHeart';
import { Box } from "grommet";
import { observer } from "mobx-react-lite";
import { useStores } from "stores";
// import { AiFillHeart } from '@react-icons/all-files/ai/AiFillHeart';

export const StreamFooter = observer(() => {
    const { stream } = useStores();

    return <Box
        direction="row"
        gap="30px"
        fill={true}
        justify="end"
        align="center"
        pad={{ horizontal: 'large' }}
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

        <div onClick={() => stream.toggleChatVisible()} style={{ cursor: 'pointer' }}>
            <BiChat color="#38b3ff" size="24px" />
        </div>
    </Box>
})
