import {DefaultTheme} from 'react-native-paper';

export const customPaperTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#094c6b',
    accent: '#ff8080',
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
    PRIMARY: '#094c6b',
    THEME: '#094c6b',
    INPUT_TEXT: '#094c6b',
    FACEBOOK: '#3B5998',
    INPUT: '#808080',
    PLACEHOLDER: '#9FA5AA',
    WHITE: '#FFFFFF',
  },
};