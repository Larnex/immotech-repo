import { COLOR, useTheme } from 'native-x-theme';
import React from 'react';
import ImmotechLogo from './immotech-logo-dark.svg';
import OmnystateLogo from './Omnystate-Logo-blck.png';
import { Image } from 'react-native';

type LogoSize = 'large' | 'normal' | 'small';

const logoSizes: Record<LogoSize, { width: number; height: number }> = {
  large: {
    width: 120,
    height: 120,
  },
  normal: {
    width: 86,
    height: 86,
  },
  small: {
    width: 26,
    height: 26,
  },
};

interface Props {
  size?: LogoSize;
}

export function Logo({ size = 'normal' }: Props) {
  const { getColor } = useTheme();
  const { width, height } = logoSizes[size];

  return <Image source={OmnystateLogo} style={{ width: 200, height: 50 }}
    resizeMode="contain" />;
}
