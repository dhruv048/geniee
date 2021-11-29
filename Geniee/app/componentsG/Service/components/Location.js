import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Card, TextInput, Menu, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProductList from './ProductList';
import SearchBar from './SearchBar';

const Location = () => {
  const [location, setLocation] = useState(false);
  const [filter, setFilter] = useState(false);
  const [sort, setSort] = useState(false);
  const [shopThrift, setShopThrift] = useState(false);
  const openLocation = () => setLocation(true);
  const closeLocation = () => setLocation(false);
  const openFilter = () => setFilter(true);
  const closeFilter = () => setFilter(false);
  const openSort = () => setSort(true);
  const closeSort = () => setSort(false);
  const locationList = [
    {
      label: 'Kathmandu',
    },
    {
      label: 'Butwal',
    },
  ];
  return (
    <View style={styles.dropDown}>
      <Menu
        visible={location}
        onDismiss={closeLocation}
        anchor={
          <Button
            mode="outlined"
            style={styles.dropDown}
            color="#353945"
            onPress={openLocation}
            contentStyle={{flexDirection: 'row-reverse'}}
            icon={location ? 'arrow-up' : 'arrow-down'}>
            Show Location
          </Button>
        }>
        {locationList.map(el => {
          return (
            <Menu.Item
              style={styles.menuItem}
              onPress={() => {}}
              title={el.label}
            />
          );
        })}
      </Menu>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '8%',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
  },
  headerText: {
    color: '#353945',
    fontWeight: 'bold',
    fontSize: 17,
  },

  shopThrift: {
    display: 'flex',
    flexDirection: 'row',
  },
  filter: {
    width: 100,
    fontSize: 20,
    borderRadius: 50,
    marginRight: 5,
  },
  thriftDefault: {
    backgroundColor: '#E3E9FF',
    borderRadius: 50,
    marginRight: 10,
  },
  thriftActive: {
    color: '#FFFFFF',
    backgroundColor: '#3DA9FC',
    borderRadius: 50,
    marginRight: 10,
  },
  dropDown: {
    width: 170,
    fontSize: 20,
    borderRadius: 50,
  },
  menuItem: {
    width: 170,
  },
});

export default Location;
