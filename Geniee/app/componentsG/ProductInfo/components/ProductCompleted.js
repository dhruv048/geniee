import { Container, Content, Header, Left, Right } from 'native-base';
import React from 'react';
import { Keyboard, View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/Feather';
import { colors } from '../../../config/styles';

const ProductCompleted = (props) => {
  const productData = props.route.params.data;
  return (
    <Container>
      <Content style={{ backgroundColor: colors.appBackground }}>
        <Header androidStatusBarColor={colors.statusBar}
          style={{ backgroundColor: '#4d94ff' }}>
          <Left>
            <Button
              transparent
              uppercase={false}
              onPress={() => {
                props.navigation.goBack();
              }}>
              <FIcon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-left" />
              <Text style={{ color: colors.whiteText }}>
                Back
              </Text>
            </Button>
          </Left>
          <Right>

          </Right>
        </Header>
        <View style={styles.container}>
          <Icon name='check-circle' style={{ fontSize: 70, color: 'green' }} />
          <Text style={{ fontSize: 20, marginTop: 35, marginBottom: 20, fontWeight: 'bold' }}>Your product has been posted.</Text>

          <View style={{ flexDirection: 'row',justifyContent:'flex-start',marginHorizontal:25 }}>
            {productData.length>0?
              <Image
              style={{ width: 60, height: 60, resizeMode: 'cover' }}
              source={{ uri: `data:${productData.productImage[0].mime};base64,${productData.productImage[0].data}` }} />: null}
            <View style={{marginLeft:10,marginBottom:30}}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}> {productData.productTitle}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.statusBar }}>Rs. {productData.price - (productData.price * productData.discount) / 100}</Text>
                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', marginLeft: 10 }}>Rs.{productData.price}</Text>
              </View>
            </View>
          </View>
          <Button
            mode='contained'
            uppercase={false}
            style={styles.btnComplete}
            onPress={() => { props.navigation.navigate('ProductInfo') }}
          >
            <Text style={styles.btnCompleteText}>Post another one</Text>
            <FIcon style={{ color: '#ffffff', fontSize: 18 }} name="arrow-right" />
          </Button>
        </View>
      </Content>
    </Container>
  );
}

export default ProductCompleted;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%',
  },

  btnComplete: {
    width: '55%',
    marginBottom: 20,
    marginTop: 10,
    marginLeft: '3%',
    borderRadius: 6,
    height: 45,
  },

  btnCompleteText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.whiteText,
  },

})