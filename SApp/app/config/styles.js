import {StyleSheet} from 'react-native';

export const colors = {
  appBackground: '#05a5d10d',
  statusBar: '#094c6b',
  inputBackground: 'rgba(9,76,107,0.5)',
  buttonPrimaryBackground: '#094c6b',  
  primaryText: '#094c6b',
  redText: '#a51822',
  whiteText: '#ffffff',
    appLayout:'#094c6b'
};

export const customStyle = StyleSheet.create({

    noList: {
        padding: 20,
        //flex: 1,
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'center',
    },
    noListTextColor: {
        color: '#8E8E8E'
    },
})

