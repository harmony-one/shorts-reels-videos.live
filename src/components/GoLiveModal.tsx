import React, { useEffect, useState } from "react";
import { Box, Text, TextInput } from "grommet";
import { observer } from "mobx-react-lite";
import { ActionModalsStore } from "stores/ActionModals";
import { useStores } from "stores";
import { MetamaskButton } from "./MetamaskButton";

const GoLiveModalBody = observer((props: any) => {
    const [value, setValue] = useState('');
    const { user } = useStores();

    useEffect(() => {
        props.onValidate.callback = () => {
            console.log(value);
            return Promise.resolve({ value });
        }
    }, [props, value]);

    if (!user.address) {
        return <Box
            pad="large"
            align="center"
            justify="center"
            gap="30px"
            height="300px"
        >
            <MetamaskButton
                active={true}
                onClick={() => user.signIn()}
            />

            <Text size="18px" weight="bold" textAlign="center">
                Connect your MetaMask wallet to go Live
            </Text>
        </Box>
    }

    return <Box pad="large" gap="20px" align="start">
        <Text size="18px">
            Put your name:
        </Text>

        <Box direction="row" align="center" justify="center" gap="5px">
            <div>
                <TextInput
                    className='small-input'
                    value={value}
                    onChange={event => setValue(event.target.value)}
                />
            </div>
            <Text size="18px" weight="bold">
                {".1.country"}
            </Text>
        </Box>
    </Box >
})

export const openGoLiveModal = (
    modals: ActionModalsStore,
    callback: (props: any) => Promise<any>
) => {
    return modals.open(
        GoLiveModalBody,
        {
            onApply: (props) => callback(props),
            applyText: 'Go Live',
            // onClose?: (data?: any) => any;
            noValidation: true,
            closeText: 'Cancel',
            width: "400px"
        }
    );
}