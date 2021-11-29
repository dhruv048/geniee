import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image, Pressable} from 'react-native';
import {Card, TextInput, Button, Menu, Divider} from 'react-native-paper';

import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FilterSort from './FilterSort';
import ProductList from './ProductList';
import SearchBar from './SearchBar';
import {SafeAreaView} from 'react-native';

const ShopDetail = ({route, navigation}) => {
  const {item} = route.params;

  const [allProduct, setAllProduct] = useState(true);
  const [about, setAbout] = useState(false);

  const AllProduct = () => {
    setAbout(false);
    setAllProduct(!allProduct);
  };
  const About = () => {
    setAllProduct(false);
    setAbout(!about);
  };
  const handlerBackButton = () => {
    navigation.navigate('ServiceList');
  };

  navigation.setOptions({
    headerShown: true,
    headerLeft: () => (
      <MaterialIcons
        onPress={handlerBackButton}
        style={{fontSize: 30, marginLeft: 5, color: 'black'}}
        name="keyboard-arrow-left"
      />
    ),
    headerTitle: () => (
      <View style={styles.searchWrapper}>
        <SearchBar />
      </View>
    ),
    headerRight: () => (
      <Button
        labelStyle={{fontSize: 25, color: 'black'}}
        icon="dots-horizontal"
      />
    ),
  });

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.storeDetailWrapper}>
        <Image
          style={styles.storeDetailImage}
          source={{uri: 'https://picsum.photos/700'}}
        />

        <View style={{alignItems: 'flex-start'}}>
          <Text
            numberOfLines={1}
            style={{fontSize: 17, fontWeight: 'bold', color: 'black'}}>
            {item.businessName}
          </Text>
          <Entypo
            style={{fontSize: 16, letterSpacing: 1, marginTop: 5}}
            name="location-pin">
            {item.city}
          </Entypo>
        </View>
        <View>
          <Feather style={{fontSize: 40}} name="message-square" />
        </View>
      </View>
      <View style={styles.productTabWrapper}>
        <View style={styles.buttonWrapper}>
          <Button
            color="#3DA9FC"
            onPress={AllProduct}
            style={allProduct && styles.productActiveButton}>
            All Product
          </Button>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            color="#3DA9FC"
            onPress={About}
            style={about && styles.productActiveButton}>
            About
          </Button>
        </View>
      </View>
      <View>
        <Card>
          <Card.Content>
            <FilterSort />
          </Card.Content>
        </Card>
      </View>
      <ProductList shop={false} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    backgroundColor: 'white',
  },
  searchWrapper: {
    marginTop: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '10%',
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

  storeDetailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  storeDetailImage: {
    height: 70,
    width: '20%',
    borderRadius: 50,
  },
  productTabWrapper: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonWrapper: {
    width: '50%',
  },

  productActiveButton: {
    borderBottomColor: '#3DA9FC',
    borderBottomWidth: 1,
  },
});

export default ShopDetail;
