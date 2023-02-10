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

    return <Box direction="row" gap="20px">
        <div onClick={() => stream.likeLiveStream()}>
            <AiOutlineHeart color="#38b3ff" />
            <span style={{
                color: '#38b3ff',
                margin: '0 0 1px 5px',
                fontSize: 18
            }}>
                {stream.data.totalLikes}
            </span>
        </div>

        <div onClick={() => {}}>
            <BiDonateHeart color="#38b3ff" />
        </div>

        <div onClick={() => stream.toggleChatVisible()}>
            <BiChat color="#38b3ff" />
        </div>
    </Box>
})
