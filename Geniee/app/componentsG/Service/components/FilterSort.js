import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Card, TextInput, Menu, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProductList from './ProductList';
import SearchBar from './SearchBar';

const FilterSort = () => {
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
  const filterList = [
    {
      label: 'Cheap',
    },
    {
      label: 'Popular',
    },
  ];
  const sortList = [
    {
      label: 'Most Relevant',
    },
    {
      label: 'Price (Low to High)',
    },
    {
      label: 'Price (High to Low)',
    },
  ];
  return (
    <View style={styles.shopThrift}>
      <Menu
        visible={filter}
        onDismiss={closeFilter}
        anchor={
          <Button
            mode="outlined"
            style={styles.filter}
            color="#353945"
            onPress={openFilter}
            contentStyle={{
              flexDirection: 'row-reverse',
            }}
            icon="format-list-bulleted">
            Filter
          </Button>
        }>
        {filterList.map(el => {
          return (
            <>
              <Menu.Item
                style={styles.menuItem}
                onPress={() => {}}
                title={el.label}
              />
              <Divider />
            </>
          );
        })}
      </Menu>
      <Menu
        visible={sort}
        onDismiss={closeSort}
        anchor={
          <Button
            mode="outlined"
            style={styles.filter}
            color="#353945"
            onPress={openSort}
            contentStyle={{flexDirection: 'row-reverse'}}
            icon={sort ? 'arrow-up' : 'arrow-down'}>
            Sort
          </Button>
        }>
        {sortList.map(el => {
          return (
            <>
              <Menu.Item
                style={styles.menuItem}
                onPress={() => {}}
                title={el.label}
              />
              <Divider />
            </>
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

export default FilterSort;
