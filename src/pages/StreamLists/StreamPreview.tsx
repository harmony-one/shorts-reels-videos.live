import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteLiveStream } from 'utils';

import { MdDeleteForever } from '@react-icons/all-files/md/MdDeleteForever';
import { Box } from 'grommet';
import { Button } from 'components/Button';

export const StreamPreview = ({ stream, onRemove }) => {
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    const removeStream = useCallback(async (liveStreamId) => {
        setDeleting(liveStreamId);

        try {
            await deleteLiveStream(liveStreamId);
        } catch (e) {
            console.error(e);
        }

        setDeleting(null);
    }, [])

    return (
        <Box direction="row" align='center' justify='around' style={{ minHeight: '110px' }}>
            <Box
                direction="row"
                align="between"
                justify="between"
                pad="medium"
                width="600px"
                style={{
                    cursor: 'pointer',
                    border: '1px solid #0049af',
                    borderRadius: 7,
                }}
            >
                <div style={{
                    flexDirection: "column",
                    display: 'flex',
                    alignItems: 'space-around',
                    justifyContent: 'space-around'
                }}>
                    <div style={{ color: '#38b3ff', textAlign: 'start' }}>
                        {stream.title}
                    </div>
                    <div style={{ fontSize: 17, textAlign: 'start' }}>
                        {`Status ${stream.status === "active" ? 'active' : 'waiting'}`}
                    </div>
                    <div style={{ fontSize: 17, textAlign: 'start' }}>
                        {`Created ${new Date(stream.createdAt).toLocaleString("en-US")}`}
                    </div>
                </div>

                <Button
                    onClick={() => true && navigate(`/streams/${stream.id}`)}
                    style={{
                        opacity: true ? 1 : 0.3,
                    }}
                >
                    Stream
                </Button>
            </Box>

            <Box
                onClick={() => removeStream(stream.id)}
                margin={{ left: '20px', right: '10px' }}
                style={{ cursor: 'pointer' }}
            >
                {
                    deleting === stream.id ?
                        "..."
                        : <MdDeleteForever size="30" />
                }
            </Box>
        </Box>

    );
}
