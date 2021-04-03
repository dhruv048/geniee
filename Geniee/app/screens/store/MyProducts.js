import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title,
  Item,
  Input
} from 'native-base';
import Meteor from '../../react-native-meteor';
import FIcon from 'react-native-vector-icons/Feather';
import {colors} from '../../config/styles';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import Product from '../../components/ecommerce/Product';

import {goBack, goToRoute,backToRoot} from '../../Navigation';
import Menu, {MenuItem} from 'react-native-material-menu';

class MyProducts extends Component {
  ratingCompleted = rating => {
    this.setState({
      starCount: rating,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      starCount: 2,
      isLoading: false,
      showModal: false,
      comment: '',
      totalCount: 0,
      CategoryName: '',
      Products: [],
      wishList: [],
    };
  }
  handleBackButton() {
    console.log('handlebackpress');
    this.props.navigation.navigate('Home');
    return true;
  }

  componentDidMount() {
    
    // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
    Meteor.call('getMyProducts', (err, res) => {
      console.log(err, res);
      if (err) {
        console.log('this is due to error. ' + err);
      } else {
        this.setState({Products: res.result});
      }
    });
    this.setState({
      //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0,
      CategoryName: this.props.Category,
    });
  }
  async componentDidAppear() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
    let wishList = await AsyncStorage.getItem('myWhishList');
    if (wishList) wishList = JSON.parse(wishList);
    else wishList = [];
    let cartList = await AsyncStorage.getItem('myCart');
    if (cartList) {
      cartList = JSON.parse(cartList);
    } else {
      cartList = [];
    }
    this.setState({wishList: wishList, totalCount: cartList.length});
  }

  componentDidDisappear() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  componentWillReceiveProps(newProps) {
    if (this.props.Count != newProps.Count) {
      if (newProps.Count.length > 0) {
        this.setState({totalCount: newProps.Count[0].totalCount});
      }
    }
  }
  componentWillUnmount() {}

  clickEventListener() {
    Alert.alert('Success', 'Product has been added to cart');
  }

  editProduct = _product => {
    this.props.navigation.navigate( 'AddProduct', {Product: _product});
  };

  removeProduct = _product => {
    Alert.alert(
      'Remove Product',
      `Do you want to remove product '${_product.title}'?`,
      [
        {
          text: 'Yes Remove',
          onPress: () =>
            Meteor.call('removeProduct', _product._id, (err, res) => {
              if (!err) {
                ToastAndroid.showWithGravityAndOffset(
                  'Removed Successfully',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  0,
                  50,
                );
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  err.reason,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  0,
                  50,
                );
              }
            }),
        },
        {
          text: 'Cancel',
          onPress: () => {
            return true;
          },
        },
      ],
      {cancelable: false},
    );
  };

  _renderProduct = (data, index) => {
    let item = data.item;
    console.log(item);
    return (
      <View style={styles.col}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate( 'ProductDetail', {
              Id: item._id,
              data: item,
            })
          }
          style={styles.containerStyle}>
          <Product
            key={item._id}
            product={item}
            componentId={this.props.componentId}
          />
          <Button
            transparent
            style={{height: 40, width: 40}}
            onPress={() => this[`menu${item._id}`].show()}
            style={{position: 'absolute', top: 0, right: 5}}>
            {/*<Icon name={'ios-menu'} style={{fontSize:25,color:colors.danger }}/>*/}
            <Menu
              ref={ref => (this[`menu${item._id}`] = ref)}
              button={
                <Button
                  transparent
                  onPress={() => this[`menu${item._id}`].show()}>
                  <FIcon
                    name={'more-vertical'}
                    size={20}
                    color={colors.whiteText}
                  />
                </Button>
              }>
              <MenuItem
                onPress={() => {
                  this[`menu${item._id}`].hide(), this.editProduct(item);
                }}>
                Edit Product
              </MenuItem>
              <MenuItem
                onPress={() => {
                  this[`menu${item._id}`].hide(), this.removeProduct(item);
                }}>
                Remove Product
              </MenuItem>
            </Menu>
          </Button>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const Id = this.props.Id;
    return (
      <Container style={styles.container}>
        <Header searchBar rounded
          androidStatusBarColor={colors.statusBar}
          style={{backgroundColor: colors.appLayout}}>
         {/*} <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate('Home');
              }}>
              <FIcon name="arrow-left" color={'white'} size={24} />
            </Button>
          </Left>

          <Body>
            <Title style={styles.screenHeader}>My Products</Title>
          </Body>
          <Right>
            <Button
              onPress={() => this.props.navigation.navigate( 'AddProduct')}
              transparent>
              <FIcon name="plus" style={{fontSize: 27, color: 'white'}} />
            </Button>
          </Right> */}
          <Item>
            <Button style={{paddingHorizontal:10}}
              transparent
              onPress={() => {
                this.props.navigation.navigate('Home');
              }}>
              <FIcon name="arrow-left"  size={24} />
            </Button>

            <Input placeholder="search.." />
             <Button style={{paddingHorizontal:10}}
              onPress={() => this.props.navigation.navigate( 'AddProduct')}
              transparent>
              <FIcon name="plus" style={{fontSize: 28, }} />
            </Button>
          </Item>
        </Header>
        <Content style={styles.content}>
          <FlatList
            contentContainerStyle={styles.mainContainer}
            //data={this.props.Products}
            data={this.state.Products}
            keyExtracter={(item, index) => item._id}
            horizontal={false}
            //numColumns={2}
            renderItem={(item, index) => this._renderProduct(item, index)}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containerStyle: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 8,
  },
  col: {
    width: viewportWidth / 2 - 8,
    maxWidth: 180,
    padding: 4,
  },
});

export default Meteor.withTracker(props => {
  let Id = props.Id;
  //Meteor.subscribe('productsByCategory', Id);
  return {
    detailsReady: true,
    user: Meteor.user(),
    //Products: Meteor.collection('products').find({category: Id}),
    //    Count: Meteor.collection('cartCount').find()
  };
})(MyProducts);