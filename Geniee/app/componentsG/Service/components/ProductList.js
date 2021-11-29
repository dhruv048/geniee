import React from 'react';
import {FlatList, Pressable} from 'react-native';
import {StyleSheet} from 'react-native';
import {Image, Text, View} from 'react-native';
import {Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
const ProductList = ({shop}) => {
  const navigation = useNavigation();
  const shopList = [
    {
      _id: '4755jPwTynSgwZgzQ',
      businessName: 'Apple Store Nepal',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 100,
      instock: true,
    },
    {
      _id: 'mXuQTExhKZcSw8J7Q',
      businessName: 'Naryan Dai ko Kirana Pasal',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'Chitwan',
      availableQuantity: 0,
      instock: false,
    },
    {
      _id: '4755jPwTynSgwZgzQ',
      businessName: 'Omkar Iphone Store',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'Birgunj',
      availableQuantity: 100,
      instock: true,
    },
    {
      _id: 'mXuQTExhKZcSw8J7Q',
      businessName: 'Omkar Iphone Store',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'Butwal',
      availableQuantity: 100,
      instock: true,
    },
    {
      _id: 'mXuQTExhKZcSw8J7Q',
      businessName: 'Omkar Iphone Store',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 100,
      instock: true,
    },
  ];
  const productList = [
    {
      _id: '4755jPwTynSgwZgzQ',
      productName: 'Iphone 12 pro max',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 100,
      instock: true,
    },
    {
      _id: 'mXuQTExhKZcSw8J7Q',
      productName: 'Iphone 12 pro max',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 0,
      instock: false,
    },
    {
      _id: '4755jPwTynSgwZgzQ',
      productName: 'Iphone 12 pro max',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 100,
      instock: true,
    },
    {
      _id: 'mXuQTExhKZcSw8J7Q',
      productName: 'Iphone 12 pro max',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 100,
      instock: true,
    },
    {
      _id: 'mXuQTExhKZcSw8J7Q',
      productName: 'Iphone 12 pro max',
      title: 'This is title of product.This is tested.',
      description: 'Love',
      contact: '',
      radius: 0,
      homeDelivery: false,
      price: 300,
      discount: 5,
      unit: '200',
      images: ['1635072638975.png'],
      city: 'kathmandu',
      availableQuantity: 100,
      instock: true,
    },
  ];
  const renderShopList = ({item}) => {
    return (
      <Card key={item._id} style={styles.productListCard}>
        <Image
          style={styles.cardImage}
          source={{uri: 'https://picsum.photos/700'}}
        />

        <View>
          <Text style={styles.cardLocation}>{item.city}</Text>
          <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
            {item.businessName}
          </Text>

          <Pressable
            onPress={() => navigation.navigate('ShopDetail', {item: item})}
            style={styles.cardButton}>
            <Text style={{fontSize: 14, color: '#B9ACB1'}}>Visit</Text>
            <AntDesign style={styles.cardIcon} name="right" />
          </Pressable>
        </View>
      </Card>
    );
  };
  const renderProductList = ({item}) => {
    return (
      <Card key={item._id} style={styles.productListCard}>
        <Image
          style={styles.productImage}
          source={{uri: 'https://picsum.photos/700'}}
        />

        <View>
          <Text style={styles.cardLocation}>{item.city}</Text>
          <Text style={styles.cardText} numberOfLines={2} ellipsizeMode="tail">
            {item.productName}
          </Text>

          <Text style={{color: '#3DA9FC'}}>Rs. {item.price}</Text>
        </View>
      </Card>
    );
  };

  return shop ? (
    <FlatList
      style={styles.productContainer}
      numColumns={3}
      data={shopList}
      keyExtractor={item => item._id}
      renderItem={renderShopList}
    />
  ) : (
    <FlatList
      style={styles.productContainer}
      numColumns={3}
      data={productList}
      keyExtractor={item => item._id}
      renderItem={renderProductList}
    />
  );
};

const styles = StyleSheet.create({
  productListCard: {
    padding: 5,
    marginTop: 10,

    flex: 1,
  },
  cardLocation: {
    marginTop: 5,
  },
  cardImage: {
    height: 100,
    width: '100%',
    borderRadius: 10,
  },
  productImage: {
    height: 150,
    width: '100%',
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  cardButton: {
    marginTop: 4,
    padding: 6,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  cardIcon: {
    marginTop: 3,
    color: '#B9ACB1',
  },
});
export default ProductList;
