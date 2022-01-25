import { configureFonts, DefaultTheme } from 'react-native-paper';

const fontConfig = {
  manropeFont : {
    regular: {
      fontFamily: 'Manrope-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Manrope-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Manrope-Light',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Manrope-Bold',
      fontWeight: 'normal',
    },
  },
  eudoxusFont: {
    regular: {
      fontFamily: 'EudoxusSans-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'EudoxusSans-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'EudoxusSans-Light',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'EudoxusSans-Bold',
      fontWeight: 'normal',
    },
  }
}

export const customPaperTheme = {
  ...DefaultTheme,
  fonts : configureFonts(fontConfig),
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#397CCD',
    accent: '#ff8080',
    text: 'rgba(0,0,0,0.6)',
    title: 'rgba(0,0,0,0.87)',
  },
  // fonts: {
  //   regular: 'Roboto',
  //   medium: 'Helvetica Neue Light',
  // },
  GenieeButton: {
    btnMaxWidth: '100%',
    btnMinWidth: '55%',
    btnHeight: '48',
    btnTextSize : '18'
  },
  GenieeColor: {
    primaryColor: '#3DA9FC',
    lightPrimaryColor: '#F0F3FF',
    pinkColor: '#FC2165',
    lightDarkColor: '#DCDCDC',
    lightTextColor: '#B8B8B8',
    darkColor: '#353945',
    yellowColor: '#FFC940'
  },
  GenieeText: {
    fontBoldSize: 20,
    fontMinSize: 12,
    fontAverageSize: 14,
    fontMaxSize: 18,
    fontBoldWeight :'bold',
    fontNormalWeight:'normal',
    fontWeight_600:'600'
  },
  GenieeInput: {
    roundness: 6,
    inputHeight: 45,
    inputMaxWidth: '100%',
    inputMinWidth: '55%',
    inputFontSize: 18,
  },
  headerMarginVertical: '6%'
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
