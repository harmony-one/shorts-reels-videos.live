import React, { useState } from "react";
import { Box, Text } from "grommet";
import { observer } from "mobx-react-lite";
import { ActionModalsStore } from "stores/ActionModals";
import { useStores } from "stores";
import { MetamaskButton } from "./MetamaskButton";
import { NumberInput } from "./Inputs";
import { Button } from "./Button";
import { formatWithSixDecimals } from "./Inputs/helpers";
// import Web3 from 'web3'
// import { OneCountry } from 'one-country-sdk'

const DonationModalBody = observer(() => {
    const [value, setValue] = useState('0');
    const { user } = useStores();

    const maxAvailable = String(Math.max(Number(user.balance) / 1e18 - 0.1, 0));

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
            fill={true}
            direction="column"
            gap="5px"
        >
            <Text>Amount (ONE)</Text>

            <Box width="300px">
                <NumberInput
                    size="auto"
                    type="decimal"
                    min={0}
                    precision={18}
                    delimiter="."
                    placeholder="0"
                    style={{ width: '100%', textAlign: 'center' }}
                    value={value}
                    onChange={value => setValue(value)}
                />
            </Box>

            <Box onClick={() => setValue(maxAvailable)}>
                <Text size="xxsmall" color="NBlue">
                    {formatWithSixDecimals(maxAvailable)} Max Available
                </Text>
            </Box>


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