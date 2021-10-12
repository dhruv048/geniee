import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Badge } from 'react-native-paper';
import { colors, customStyle } from '../../config/styles';
import { TouchableOpacity,Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import AIcon from 'react-native-vector-icons/AntDesign';

class CartIcon extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0
        };
    }
    componentDidMount(){
        // console.log('CartDidMount')
        this._setCartCount();
    this.listener = EventRegister.addEventListener('cartItemsChanged', (data) => {
        this._setCartCount();
    })
    
    };

    componentWillUnmount(){
        EventRegister.removeEventListener(this.listener)
    }

   async _setCartCount(){
        let cartList = await AsyncStorage.getItem('myCart');
        cartList= JSON.parse(cartList);
        cartList= cartList? cartList:[];
        this.setState({totalCount: cartList.length})
    }


    render() {
        const {navigation} = this.props;
        return (
            <TouchableOpacity  style={{marginHorizontal:5}}
                onPress={() => navigation.navigate('CartEF')}
                //onPress={() => navigation.navigate('MyCart')}
            >
                <AIcon name="shoppingcart" style={{color:colors.gray_200}} size={25} />
                {this.state.totalCount > 0 ? (
                    <Badge style={{ position: 'absolute', top: -14, right: -14, borderWidth: 1 }}>
                        {this.state.totalCount}
                    </Badge>
                ) : null}
                <Text style={{ color:colors.gray_200, fontSize: 8, marginLeft:4 }}>CART</Text>
            </TouchableOpacity>
        );
    }
}


export default CartIcon;
