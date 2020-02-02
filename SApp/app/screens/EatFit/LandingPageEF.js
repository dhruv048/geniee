/**
 * This is the Home page
 **/

// React native and others libraries imports
import React, {Component} from 'react';

import {Container, Content, View, Button, Left, Right, Card, CardItem, cardBody, Badge, Text, H1, H2} from 'native-base';
import Navbar from '../../components/ecommerce/Navbar';

import CategoryBlock from '../../components/ecommerce/CategoryBlock';
import Icon from "react-native-vector-icons/Feather";
import Meteor, {withTracker} from "react-native-meteor";
import SideMenuDrawer from "../../components/ecommerce/SideMenuDrawer";
import { customStyle, colors } from '../../config/styles';

class LandingPageEF extends Component {

    constructor(props) {
        super(props);
        this.state={
            totalCount:0,
            categories: [],
        }
    }

    componentDidMount(){
        Meteor.call('GetEFCategories', (err, res) => {
            console.log(err, res)
            if (err) {
                console.log('this is due to error. '+err);
            }
            else{
                console.log('Result'+res);
                this.setState({categories: res.result});
            }
        });
        // this.setState({
        //     totalCount: this.props.Count.length > 0 ? this.props.Count[0].totalCount : 0
        // });
        
    }
    componentWillReceiveProps(newProps) {
        if (this.props.Count != newProps.Count) {
            if (newProps.Count.length > 0) {
                this.setState({totalCount: newProps.Count[0].totalCount})
            }
        }
    }
    render() {
        var left = (
            <Left style={{flex: 1}}>
                {/*<Button onPress={() => this._sideMenuDrawer.open()} transparent>*/}
                    {/*<Icon name='menu' size={24} color={'white'}/>*/}
                {/*</Button>*/}
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                {/*<Button onPress={() => this.props.navigation.navigate('WishList')} transparent>*/}
                    {/*<Icon name='heart' size={24} color={'white'}/>*/}
                    {/*{this.props.loggeduser.profile.hasOwnProperty('wishList') && this.props.loggeduser.profile.wishList.length>0?*/}
                        {/*<Badge*/}
                            {/*style={{position: 'absolute', height: 18}}>*/}
                            {/*<Text style={{*/}
                                {/*fontSize: 10,*/}
                                {/*fontWeight: '100',*/}
                                {/*color: 'white',*/}
                                {/*lineHeight: 18*/}
                            {/*}}>{this.props.loggeduser.profile.wishList.length}</Text></Badge>*/}
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
        );
        console.log('this is category :'+this.state.categories);
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
                                           onPress={() => this.props.navigation.navigate('ProductsEF', {Id: item._id,Category:item.title})}
                            />
                        ))}
                    </View>
                </Content>
            </Container>
            // </SideMenuDrawer>
        );
    }


}

export default withTracker(() => {
    let user=Meteor.user();
    return {
        loggeduser:Meteor.user(),
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