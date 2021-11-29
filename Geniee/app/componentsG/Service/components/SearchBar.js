import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

const SearchBar = () => {
  return (
    <TextInput
      mode="outlined"
      style={styles.searchBar}
      outlineColor="white"
      activeOutlineColor="white"
      label="Search in here"
    />
  );
};
const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#F1F1F1',

    color: '#8C8C8C',
    marginBottom: 20,
    height: 50,
  },
});
export default SearchBar;
