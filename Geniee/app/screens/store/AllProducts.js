import React, {Component, createRef} from 'react';
import {
    StyleSheet,
    Alert,
    FlatList,
    Dimensions, AsyncStorage, TouchableOpacity, Picker
} from 'react-native';
import {
    Button,
    Container,
    Header,Item, Input, Left,Right,Body, Title, View,Text} from 'native-base';
    import {Headline, RadioButton} from 'react-native-paper';
import Meteor  from "../../react-native-meteor";
import FIcon from 'react-native-vector-icons/Feather';
import {colors} from "../../config/styles";
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import Product from "../../components/Store/Product";
import CartIcon from '../../components/HeaderIcons/CartIcon';
import ActionSheet from "react-native-actions-sheet";

class AllProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 2,
            isLoading: false,
            showModal: false,
            comment: '',
            totalCount:0,
            CategoryName:'',
            Products:[],
            wishList:[],
            loading:false,
            search:false,
            filterOption:'popular',
        };
        this.actionSheetRef = createRef();
        this.arrayHolder=[];
        this.skip=0;
        this.limit=20;
        this.popularProducts=[];
        this.myProducts=[];
    }

    componentDidMount() {
        
        // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
      // this._fetchData()
        this.setState({
            //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0,
            CategoryName:this.props.Category
        });
        this._fetchData();
        Meteor.call('getMyProducts', (err, res) => {
            console.log(err, res);
            if (err) {
              console.log('this is due to error. ' + err);
            } else {
                this.myProducts=res.result;
            }
          });
        
    }

    _fetchData(){
        if(!this.state.loading) {
            this.setState({loading:true})
            Meteor.call('getPopularProducts', this.skip, this.limit, (err, res) => {
                this.setState({loading:false});
                 console.log(err, res);
                if (err) {
                    console.log('this is due to error. ' + err);
                }
                else {
                    this.skip=this.skip+this.limit;
                    // this.arrayHolder=this.arrayHolder.concat(res.result);
                    this.popularProducts=this.arrayHolder.concat(res.result);
                    this.setState({Products: this.popularProducts});
                };
            });
        }
    };
    _onEndReached = (distance) => {
        console.log(distance);
        if(this.state.filterOption=="popular")
            this._fetchData();
    }
    async componentDidAppear() {
        let wishList = await AsyncStorage.getItem('myWhishList');
        if (wishList)
            wishList = JSON.parse(wishList);
        else
            wishList = [];
        let cartList = await AsyncStorage.getItem('myCart');
        if (cartList) {
            cartList = JSON.parse(cartList);
        }
        else {
            cartList = [];
        }
        this.setState({wishList:wishList,totalCount:cartList.length});
    }

    componentWillReceiveProps(newProps) {
        if (this.props.Count != newProps.Count) {
            if (newProps.Count.length > 0) {
                this.setState({totalCount: newProps.Count[0].totalCount})
            }
        }
    }

    _setFilter=(value)=>{
        if(value=="myProducts"){
            this.setState({filterOption:'myProducts', Products:this.myProducts});       
        }
        else{
            this.setState({filterOption:'myProducts', Products:this.popularProducts});
        }
    }

    handleBackButton() {
        console.log('handlebackpress from AllProducts');
        this.props.navigation.navigate('Home');
        return true;
    }

     
    clickEventListener() {
        Alert.alert("Success", "Product has been added to cart")
    }

    editProduct=(_product)=>{
        this.props.navigation.navigate("AddProduct",{Product:_product});
    }

    removeProduct=(_product)=>{
        Alert.alert(
            'Remove Product',
            `Do you want to remove product '${_product.title}'?`,
            [
                {
                    text: 'Yes Remove', onPress: () =>
                        Meteor.call('removeProduct',_product._id,(err,res)=>{
                            if (!err) {
                                ToastAndroid.showWithGravityAndOffset(
                                    "Removed Successfully",
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM,
                                    0,
                                    50,
                                );
                            }
                            else {
                                ToastAndroid.showWithGravityAndOffset(
                                    err.reason,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM,
                                    0,
                                    50,
                                );
                            }
                        })
                },
                {
                    text: 'Cancel', onPress: () => {
                        return true;
                    }
                }
            ],
            {cancelable: false}
        );
    }

    _renderProduct = (data, index) => {
        let item = data.item;
        //  console.log(item);
        return (
            // <View style={styles.col}>
            //     <View  style={styles.containerStyle}>
            //         <Product key={item._id} product={item} bottomTab={true} componentId={this.props.componentId}/>
            //         {item.serviceOwner==Meteor.userId()?
            //         <Button transparent style={{height:40,width:40}} onPress={() => this[`menu${item._id}`].show()} style={{position:'absolute', top:0,right:5}}>
            //             {/*<Icon name={'ios-menu'} style={{fontSize:25,color:colors.danger }}/>*/}
            //             <Menu
            //                 ref={ref => (this[`menu${item._id}`] = ref)}
            //                 button={
            //                     <Button transparent onPress={() => this[`menu${item._id}`].show()}>
            //                         <FIcon name={'more-vertical'} size={20} color={colors.whiteText}/>
            //                     </Button>}>
            //                 <MenuItem onPress={() => {
            //                     this[`menu${item._id}`].hide(), this.editProduct(item)
            //                 }}>Edit Product</MenuItem>
            //                 <MenuItem onPress={() => {
            //                     this[`menu${item._id}`].hide(), this.removeProduct(item)
            //                 }}>Remove Product</MenuItem>
            //             </Menu>
            //         </Button>:null}
            //     </View>
            // </View>

            <Product product={item} navigation={this.props.navigation} />
        )
    }

    render() {
        const Id = this.props.route.params.Id;
        return (

            <Container style={styles.container}>
                <Header searchBar rounded androidStatusBarColor={colors.statusBar}
                        style={{backgroundColor: colors.appLayout}}>
                    <Left style={{flex:1}}>
                        <Button transparent onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <FIcon name="arrow-left" color={'white'} size={24}/>
                        </Button>
                    </Left>

                    {this.state.search?
                    <Item
                        search
                        style={{
                            flex:6.5,
                            backgroundColor: '#cce0ff',
                            height: 40,
                            zIndex: 1,
                            borderRadius:8,
                            borderBottomWidth:0,
                             width:'95%'
                        }}>
                        <Input
                            style={{ fontFamily: 'Roboto' }}
                            placeholder={'Search...'}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            returnKeyType="search"
                            // onSubmitEditing={this._search}
                            // onChangeText={searchText => {
                            //     this.setState({ query: searchText });
                            // }}
                        />
                        <Button
                            transparent
                             onPress={()=>this.setState({search:false})}
                            >
                            <FIcon
                                style={{
                                    paddingHorizontal: 20,
                                    fontSize: 20,
                                    color: colors.whiteText,
                                }}
                                name={'x'}
                            />
                        </Button>
                    </Item>:
                    <Body style={{flex:4}}>
                    <Title>Popular Products</Title>
                    </Body>
                    }
                  
                    <Right style={{alignItems:'center', justifyContent:'center'}} >
                        {/* {!this.state.search?
                    <TouchableOpacity  style={{marginHorizontal:5}}  onPress={() =>this.setState({search:true})}
            >
                <FIcon name="search" style={{ fontSize: 22, color: 'white' }} />

            </TouchableOpacity>:null} */}
                        <CartIcon navigation={this.props.navigation}/>
                        <TouchableOpacity  style={{marginHorizontal:5}}  onPress={() =>this.actionSheetRef.current?.setModalVisible(true)}
            >
                <FIcon name="filter" style={{ fontSize: 22, color: 'white' }} />

            </TouchableOpacity>
                    </Right>  

                    {/* <Item>
                        <Button style={{paddingHorizontal:10}} transparent onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <FIcon name="arrow-left"   size={24}/>
                        </Button> 

                        <Input placeholder="Search..." />
                        {Meteor.userId()?
                        <Button style={{paddingHorizontal:10}} onPress={() => this.props.navigation.navigate('AddProduct')} transparent>
                            <FIcon name='plus' style={{fontSize:28}} />
                        </Button>:null}

                    </Item> */}
                </Header>
                {/* <Content style={styles.content}> */}
                {/* <Item>
                    <Left style={{flex:1}}>
                        <Picker mode='dropdown' style={{width:'50%'}}>
                        <Picker.Item label="Popular"/>
                            <Picker.Item label="Recently Added"/>
                            <Picker.Item label="My products"/>
                        </Picker>
                    </Left>
                </Item> */}
                    <FlatList contentContainerStyle={styles.mainContainer}
                        //data={this.props.Products}
                              data={this.state.Products}
                              keyExtracter={(item, index) => item._id}
                            //   horizontal={false}
                              numColumns={2}
                              renderItem={(item, index) => this._renderProduct(item, index)}
                              onEndReachedThreshold={0.1}
                              onEndReached={(distance) => this._onEndReached(distance)}
                    />
                {/* </Content> */}
                <ActionSheet ref={this.actionSheetRef}
          initialOffsetFromBottom={2}
          statusBarTranslucent
          bounceOnOpen={true}
          bounciness={4}
          gestureEnabled={true}
          defaultOverlayOpacity={0.3}
        >
          <View
            nestedScrollEnabled={true}
            style={styles.actionContentView}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Headline>Filter By</Headline>
              <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false)}}/>
               <FIcon  onPress={()=>{this.actionSheetRef.current?.setModalVisible(false)}} name="x" size={25} />
              </View>
              <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),this._setFilter('popular')}}
              style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10, alignItems:'center'}}>
              <RadioButton   status={this.state.filterOption=="popular"? 'checked' :'unchecked' } color={colors.primary}  />
                <Text note style={{marginLeft:10}}>Popularity</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.actionSheetRef.current?.setModalVisible(false),this._setFilter('myProducts')}} 
              style={{flexDirection:'row' , paddingLeft:20, paddingVertical:10, alignItems:'center'}}>
              <RadioButton   status={this.state.filterOption=="myProducts"? 'checked' :'unchecked'   } color={colors.primary}  />
                <Text note style={{marginLeft:10}}>My Products</Text>
                </TouchableOpacity>
          </View>
        </ActionSheet>
            </Container>

        );
    }
}

const styles = StyleSheet.create({
    actionContentView: {
        width: '100%',
        paddingHorizontal: 12,
        paddingTop:5
      },
    container: {
        flex:1,
        backgroundColor: colors.appBackground,
    },
    mainContainer: {
        // flexDirection:'row',
        // flexWrap:'wrap',
        paddingHorizontal:5,
        width:'100%',
        flex:1,
    },
    containerStyle: {
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor:'white'
    },
    content: {
        flex:1,
        padding: 8
    },
    col: {
        width: (viewportWidth-16)/ 2,
        maxWidth:180,
        padding: 4
    }

});

export default Meteor.withTracker((props) => {
    let Id = props.Id;
    //Meteor.subscribe('productsByCategory', Id);
    return {
        detailsReady: true,
        user: Meteor.user(),
        //Products: Meteor.collection('products').find({category: Id}),
        //    Count: Meteor.collection('cartCount').find()
    };
})(AllProducts);