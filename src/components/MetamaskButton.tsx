import React from 'react';
import { Text, Box } from 'grommet';
import { Button } from './Button';
import styled from 'styled-components';
import { MetamaskIcon } from './icons/metamask';
import { useMediaQuery } from 'react-responsive';

interface MetamaskButtonProps {
    active: boolean;
    onClick: () => void;
}

const StyledButton = styled(Button)`
  background-color: ${props => (props.active ? '#B56625' : '#999999')};
  transition: background-color 300ms linear;
`;

export const MetamaskButton: React.FC<MetamaskButtonProps> = ({
    active,
    onClick,
}) => {
    const isSmallMobile = useMediaQuery({ query: '(max-width: 500px)' })

    return (
        <StyledButton active={active} onClick={onClick}>
            <Box direction="row" gap="12px" align="center" justify="center">
                <Text>{isSmallMobile ? "MetaMask" : "Connect MetaMask"}</Text>
                <Box>
                    <MetamaskIcon />
                    {/* <img src="/metamask.svg" height="24" /> */}
                </Box>
                {/*<Text color="NWhite" size="xxsmall" lh="24px">*/}
                {/*  {label}*/}
                {/*</Text>*/}
                {/*{active && <Icon glyph="CloseCircle" />}*/}
                {/*{!active && <Icon glyph="AddCircle" />}*/}
            </Box>
        </StyledButton>
    );
};