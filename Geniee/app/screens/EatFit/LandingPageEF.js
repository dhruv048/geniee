/**
 * This is the Home page
 **/

// React native and others libraries imports
import React, {Component} from 'react';

import {
    Container,
    Content,
    View,
    Button,
    Left,
    Right,
    cardBody,
    Badge,
    Text,
    H1,
   Icon
} from 'native-base';
import Navbar from '../../components/ecommerce/Navbar';

import CategoryBlock from '../../components/ecommerce/CategoryBlock';
import FIcon from "react-native-vector-icons/Feather";
import FontIcon from "react-native-vector-icons/FontAwesome";
import Meteor from "../../react-native-meteor";
import SideMenuDrawer from "../../components/ecommerce/SideMenuDrawer";
import {customStyle, colors} from '../../config/styles';
import {AsyncStorage} from "react-native";
import {goToRoute} from "../../Navigation";
import {Navigation} from "react-native-navigation/lib/dist/index";
import CogMenu from "../../components/CogMenu";

class LandingPageEF extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0,
            categories: [],
            wishList: []
        }
    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
        Meteor.call('GetEFCategories', (err, res) => {
            console.log(err, res)
            if (err) {
                console.log('this is due to error. ' + err);
            }
            else {
                console.log('Result' + res);
                this.setState({categories: res.result});
            }
        });
        // this.setState({
        //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0
        // });
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

    componentWillUnmount() {
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                {/*<Button transparent onPress={() => {*/}
                    {/*this.props.navigation.openDrawer()*/}
                {/*}}>*/}
                    {/*<FontIcon name="ellipsis-v" color={'white'} size={24}/>*/}
                {/*</Button>*/}
                <CogMenu componentId={this.props.componentId} />
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                <Button onPress={() => goToRoute(this.props.componentId,'WishListEF')} transparent>
                    <FIcon name='heart' style={{fontSize:24,color:'white'}}/>
                    {this.state.wishList.length > 0 ?
                        <Badge
                            style={{position: 'absolute', height: 18}}>
                            <Text style={{
                                fontSize: 10,
                                fontWeight: '100',
                                color: 'white',
                                lineHeight: 18
                            }}>{this.state.wishList.length}</Text></Badge>
                        : null}
                </Button>
                <Button onPress={() => goToRoute(this.props.componentId,'CartEF')} transparent>
                    <Icon name='ios-cart' style={{fontSize:27,color:'white'}} />
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
        );
        console.log('this is category :' + this.state.categories);
        return (

            <Container style={styles.container}>
                <Navbar left={left} right={right} title="Eat Fit"/>
                <Content style={styles.content}>
                    <View style={styles.header}>
                        <H1 style={styles.title}>Choose a category</H1>
                    </View>
                    <View>
                        {this.state.categories.map((item, index) => (
                            <CategoryBlock key={item._id} id={item._id}
                                //image={'https://e-flyers.co.za/wp-content/uploads/2019/09/home_page_bg.jpg'}
                                           title={item.title}
                                           count={item.hasOwnProperty('products') ? item.products.count : 0}
                                           onPress={() => goToRoute(this.props.componentId,'ProductsEF', {
                                               Id: item._id,
                                               Category: item.title
                                           })}
                            />
                        ))}
                    </View>
                </Content>
            </Container>
            // </SideMenuDrawer>
        );
    }


}

export default Meteor.withTracker(() => {
    let user = Meteor.user();
    return {
        loggeduser: Meteor.user(),
        //categories: Meteor.collection('category').find(),
        //Count: Meteor.collection('cartCount').find({_id: user._id})
    };
})(LandingPageEF)

const styles = {
    container: {
        backgroundColor: '#fff'
    },
    content: {
        //padding: 30
    },
    header: {
        paddingHorizontal: 30,
        paddingTop: 40,
        paddingBottom: 30
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    }
}