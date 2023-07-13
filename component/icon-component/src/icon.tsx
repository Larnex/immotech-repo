import React from "react";
import { Image } from 'react-native';
import IMAGES from "./consts";


interface Props {
  name: keyof typeof IMAGES;
  size?: number;
  style?: any;
}

export const Icon = ({ name, size = 24, style = {}, ...rest }: Props)=> {
  const [width, height] = [size, size];

  return (
    <Image source={IMAGES[name]} style={[{ width, height }, style]} {...rest} />
  );
};


