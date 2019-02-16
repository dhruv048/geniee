import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../config/styles';

const window = Dimensions.get('window');
export default StyleSheet.create({
  
  divider: {
    height: 1,
    backgroundColor: colors.inputDivider,
    marginLeft: 10,
  },
  inputWrapper: {
    backgroundColor: colors.inputBackground,
    width: window.width,
  },
});
