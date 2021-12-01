import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Card, TextInput, Menu, Divider} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterSort from './FilterSort';
import Location from './Location';
import ProductList from './ProductList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchBar from './SearchBar';
const ServiceList = ({route, navigation}) => {
  const {Item} = route.params;

  const [shopThrift, setShopThrift] = useState(false);
  const handlerBackButton = () => {
    navigation.navigate('Dashboard');
  };
  const toggleThrifts = () => {
    setShopThrift(!shopThrift);
  };
  navigation.setOptions({
    title: Item.description,
    headerShown: true,
    headerLeft: () => (
      <MaterialIcons
        onPress={handlerBackButton}
        style={{fontSize: 30, marginLeft: 5, color: 'black'}}
        name="keyboard-arrow-left"
      />
    ),
    headerRight: () => (
      <Button
        compact="true"
        style={shopThrift ? styles.thriftActive : styles.thriftDefault}
        color={shopThrift ? '#FFFFFF' : '#3DA9FC'}
        mode="outlined"
        onPress={toggleThrifts}
        contentStyle={{flexDirection: 'row-reverse'}}
        icon={shopThrift ? 'close' : 'arrow-right'}>
        Shop thrifts
      </Button>
    ),
  });
  return (
    <SafeAreaView>
      <View>
        <Card>
          <Card.Content>
            <SearchBar />
            {shopThrift ? <FilterSort /> : <Location />}
          </Card.Content>
        </Card>
      </View>
      <ProductList shop={true} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default ServiceList;
