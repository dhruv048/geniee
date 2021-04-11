import React, { PureComponent } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Badge } from 'react-native-paper';
import { colors } from '../../config/styles';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';

class CartIcon extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            totalCount: 0
        };
    }
    componentDidMount(){
        console.log('CartDidMount')
      
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
        return (
            <TouchableOpacity  style={{marginHorizontal:5}}
                onPress={() => navigation.navigate('CartEF')}
            >
                <Icon name="shopping-bag" style={{ fontSize: 22, color: 'white' }} />
                {this.state.totalCount > 0 ? (
                    <Badge style={{ position: 'absolute', top: -10, right: -7, borderWidth: 2, borderColor: colors.appLayout }}>
                        {this.state.totalCount}
                    </Badge>
                ) : null}
            </TouchableOpacity>
        );
    }
}


export default CartIcon;