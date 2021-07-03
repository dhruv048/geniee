import {DefaultTheme} from 'react-native-paper';

export const customPaperTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#397CCD',
    accent: '#ff8080',
    text: 'rgba(0,0,0,0.6)',
    title: 'rgba(0,0,0,0.87)',
  },
  fonts: {
    regular: 'Roboto',
    medium: 'Helvetica Neue Light',
  },
};

export const customGalioTheme = {
  SIZES: {
    BUTTON_WIDTH: '100%',
    INPUT_BORDER_RADIUS: 6,
    INPUT_BORDER_WIDTH: 0.8,
    INPUT_TEXT: 16,
  },
  // this will overwrite the Galio COLORS PRIMARY color #B23AFC
  COLORS: {
    // PRIMARY: '#5c7aaf',
    // THEME:'#5c7aaf'
    PRIMARY: '#397CCD',
    THEME: '#397CCD',
    INPUT_TEXT: 'rgba(0,0,0,0.6)',
    FACEBOOK: '#3B5998',
    INPUT: '#808080',
    PLACEHOLDER: '#9FA5AA',
    WHITE: '#FFFFFF',
    Transparent: 'transparent',
  },
};
