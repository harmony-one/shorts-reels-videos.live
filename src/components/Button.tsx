import React from 'react';
import { Button as GrommetButton } from 'grommet';
import styled from 'styled-components';

interface Props {
  accent?: boolean;
}

export const Button = styled(GrommetButton) <Props>`
    line-height: 31px;
    font-weight: 700;
    height: 48px;
    font-size: 18px;
    padding: 0 30px;
    text-decoration: none;
    cursor: pointer;
    border-radius: 7px;
    background-color: #0049af;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
`;

Button.displayName = 'Button';
