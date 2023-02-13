import React from "react";
import { Participant } from "./Participant";
import { RecIcon } from "icons/RecIcon";
import { observer } from "mobx-react-lite";
import { useStores } from "stores";
import { Box, Text } from "grommet";
import { Button } from "components/Button";

export const StreamRecord = observer(() => {
    const { stream } = useStores();

    const localParticipant = stream.localParticipant;
    const loading = stream.startStreamLoading;

    if (!stream) {
        return <div>...</div>
    }

    if (!localParticipant || loading) {
        return (<Box
            justify='center'
            align='center'
            fill={true}
            style={{
                border: '1px solid #dfdfdf70', borderRadius: 7
            }}
        >
            <Text size="18px" margin={{ bottom: "30px" }}>
                You are the owner of this stream: <span style={{ color: '#38b3ff' }}>
                    {stream.data.title}
                </span>
            </Text>

            <Button onClick={stream.startStream} >
                <RecIcon style={{ marginRight: 10, display: loading ? 'none' : 'block' }} />
                {loading ? 'Starting...' : 'Start Stream'}
            </Button>
        </Box>)
    }

    return (
        <Participant />
    );
});