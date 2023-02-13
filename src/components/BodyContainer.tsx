import React from 'react';
import { Box } from 'grommet';
import styled from 'styled-components';

interface Props {
  accent?: boolean;
}

export const BodyContainer = styled(Box) <Props>`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

BodyContainer.displayName = 'BodyContainer';
