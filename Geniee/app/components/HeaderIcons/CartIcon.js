import React, { PureComponent, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { Badge } from 'react-native-paper';
import { colors, customStyle } from '../../config/styles';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import AIcon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { cartItemSelector, cartSelector } from '../../store/selectors/shopping';
import shoppingHandlers from "../../store/services/shopping/handlers";

const CartIcon = (props) => {
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        _setCartCount();
        const listener = EventRegister.addEventListener('cartItemsChanged', (data) => {
            _setCartCount();
        });

        return () => { EventRegister.removeEventListener(listener) };
    }, []);

    const _setCartCount = async () => {
        // let cartList = await AsyncStorage.getItem('myCart');
        // cartList = JSON.parse(cartList);
        // cartList = cartList ? cartList : [];
        // setTotalCount(cartList.length);
        // will be used when we get data from db
        //shoppingHandlers.getAllCartItems();
        let cartCount = props.cartItems ? props.cartItems.length : null;
        setTotalCount(cartCount);
    }


    //const { navigation } = this.props;
    return (
        <TouchableOpacity style={{ marginHorizontal: 5 }}
            // onPress={() => navigation.navigate('CartEF')}
            onPress={() => props.navigation.navigate('MyCart')}
        >
            <AIcon name="shoppingcart" style={{ color: colors.gray_200 }} size={25} />
            {totalCount > 0 ? (
                <Badge style={{ position: 'absolute', top: -14, right: -14, borderWidth: 1 }}>
                    {totalCount}
                </Badge>
            ) : null}
            <Text style={{ color: colors.gray_200, fontSize: 8, marginLeft: 4 }}>CART</Text>
        </TouchableOpacity>
    );
}

export default connect(cartItemSelector)(CartIcon);
