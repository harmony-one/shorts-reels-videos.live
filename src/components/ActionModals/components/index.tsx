import * as React from 'react';
import { Box } from 'grommet';
import { withTheme } from 'styled-components';
import { IStyledProps } from 'themes';
import { Text } from 'grommet';
// import { Spinner } from 'ui/Spinner';
import { AiOutlineClose } from '@react-icons/all-files/ai/AiOutlineClose';

interface IHederProps {
  onClose: () => any;
  title: string;
  pending: boolean;
}

export const Header = withTheme(
  ({ pending, title, onClose, theme }: IHederProps & IStyledProps) => (
    <Box
      direction="row"
      justify="between"
      align="center"
      pad={{ horizontal: 'xlarge' }}
      style={{ background: '#1c2a5e', height: 80 }}
    >
      <Box
        direction="row"
        style={{ alignItems: pending ? 'center' : 'baseline' }}
      >
        <Text
          size="large"
          weight="bold"
          color="StandardWhite"
          style={{ marginRight: '16px', maxWidth: '500px' }}
        >
          {title}
        </Text>
        {/* {pending && <Spinner style={{ width: 20, height: 20 }} />} */}
      </Box>
      <Box onClick={onClose} style={{ cursor: 'pointer' }}>
        <AiOutlineClose />
      </Box>
    </Box>
  ),
);

export const Footer: typeof Box = props => (
  <Box
    flex={{ shrink: 0 }}
    style={{ borderTop: '1px solid rgb(231, 236, 247)' }}
    direction="row"
    justify="end"
    pad={{ horizontal: 'xlarge', vertical: 'large' }}
    {...props}
  />
);