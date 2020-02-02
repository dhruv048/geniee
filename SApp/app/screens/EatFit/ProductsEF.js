import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    StatusBar,
    Modal, ToastAndroid, Linking, Dimensions, TouchableNativeFeedback
} from 'react-native';
import {
    Button,
    Container,
    Content,
    Header,
    Left,
    Body,
    StyleProvider, Right, Badge, Title
} from 'native-base'
import Meteor, {withTracker} from "react-native-meteor";
import Icon from 'react-native-vector-icons/Feather';
import {colors} from "../../config/styles";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import Product from "../../components/ecommerce/Product";

//const { RNEsewaSdk } = NativeModules;


class ProductsEF extends Component {

    ratingCompleted = (rating) => {
        this.setState({
            starCount: rating,
        });
    }


    constructor(props) {
        super(props);
        this.state = {
            starCount: 2,
            isLoading: false,
            showModal: false,
            comment: '',
            totalCount:0,
            CategoryName:'',
            Products:[]
        }

    }

    componentDidMount() {
        // this.handler= DeviceEventEmitter.addListener('onEsewaComplete', this.onEsewaComplete);
        Meteor.call('EFProductsByCategory',this.props.navigation.getParam('Id'), (err, res) => {
            if (err) {
                console.log('this is due to error. '+err);
            }
            else{
                this.setState({Products: res});
            }
        });
        this.setState({
       //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0,
            CategoryName:this.props.navigation.getParam('Category')
        });
    }
    componentWillReceiveProps(newProps) {
        if (this.props.Count != newProps.Count) {
            if (newProps.Count.length > 0) {
                this.setState({totalCount: newProps.Count[0].totalCount})
            }
        }
    }
    componentWillUnmount() {
        // this.handler.unsubscribe()
    }


    clickEventListener() {
        Alert.alert("Success", "Product has been added to cart")
    }


    _renderProduct = (data, index) => {
        let item = data.item;
        return (
            <View style={styles.col}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("ProductDetailEF", {'Id': item._id,data:item})} style={styles.containerStyle}>
                    <Product key={item._id} product={item}/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const Id = this.props.navigation.getParam('Id');

        const {navigator} = this.props.navigation;
        return (
            
                <Container style={styles.container}>
                    <Header androidStatusBarColor={colors.statusBar}
                            style={{backgroundColor: colors.appLayout}}>
                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.pop()
                            }}>
                                <Icon name="arrow-left" color={'white'} size={24}/>
                            </Button>
                        </Left>

                        <Body>
                            <Title style={styles.screenHeader}>{this.state.CategoryName}</Title>
                        </Body>
                        <Right>
                            {/*<Button onPress={() => this.props.navigation.navigate('WishList')} transparent>*/}
                                {/*<Icon name='heart' size={24} color={'white'}/>*/}
                                {/*{this.props.user.profile.hasOwnProperty('wishList') && this.props.user.profile.wishList.length>0?*/}
                                    {/*<Badge*/}
                                        {/*style={{position: 'absolute', height: 18}}>*/}
                                        {/*<Text style={{*/}
                                            {/*fontSize: 10,*/}
                                            {/*fontWeight: '100',*/}
                                            {/*color: 'white',*/}
                                            {/*lineHeight: 18*/}
                                        {/*}}>{this.props.user.profile.wishList.length}</Text></Badge>*/}
                                    {/*:null}*/}
                            {/*</Button>*/}
                            <Button onPress={() => this.props.navigation.navigate('Cart')} transparent>
                                <Icon name='shopping-bag' size={24} color={'white'}/>
                                {this.state.totalCount > 0 ?
                                    <Badge
                                        style={{position: 'absolute', height: 18}}>
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: '100',
                                            color: 'white',
                                            lineHeight: 18
                                        }}>{this.state.totalCount}</Text></Badge> : null}
                            </Button>
                        </Right>
                    </Header>
                    <Content style={styles.content}>
                        <FlatList style={styles.mainContainer}
                                  //data={this.props.Products}
                                  data={this.state.Products}
                                  keyExtracter={(item, index) => item._id}
                                  horizontal={false}
                                  numColumns={2}
                                  renderItem={(item, index) => this._renderProduct(item, index)}
                        />
                    </Content>
                </Container>
           
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
    },
    mainContainer: {
    },
    containerStyle: {
        borderRadius: 4,
        overflow: 'hidden'
    },
    content: {
        padding: 8
    },
    col: {
        width: (viewportWidth / 2) - 8,
        padding: 4
    }

});

export default withTracker((props) => {
    let Id = props.navigation.getParam('Id');
    //Meteor.subscribe('productsByCategory', Id);
    return {
        detailsReady: true,
        user: Meteor.user(),
        //Products: Meteor.collection('products').find({category: Id}),
    //    Count: Meteor.collection('cartCount').find()
    };
})(ProductsEF);