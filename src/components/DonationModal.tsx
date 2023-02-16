import React, { useState } from "react";
import { Box, Text, TextInput } from "grommet";
import { observer } from "mobx-react-lite";
import { ActionModalsStore } from "stores/ActionModals";
import { useStores } from "stores";
import { MetamaskButton } from "./MetamaskButton";

const DonationModalBody = observer(() => {
    const [value, setValue] = useState('');
    const { user } = useStores();

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
                Connect your MetaMask wallet to set donation
            </Text>
        </Box>
    }

    return <Box pad="large">
        <Text size="24px" weight="bold" textAlign="center">
            Send Donation
        </Text>

        <Box
            direction="column"
            gap="10px"
        >
            <Text>Amount (ONE)</Text>
            <TextInput 
                value={value}
                onChange={event => setValue(event.target.value)}
            />
        </Box>
    </Box>
})

export const openDonationModal = (modals: ActionModalsStore) => {
    return modals.open(
        DonationModalBody,
        {
            onApply: () => Promise.resolve(true),
            applyText: 'Send Donation',
            // onClose?: (data?: any) => any;
            noValidation: true,
            closeText: 'Cancel',
            width: "600px"
        }
    );
}