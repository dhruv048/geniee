import React, { PureComponent, useEffect, useMemo, useState } from 'react';
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
    const getCartCount = useMemo(() => {
        let cartCount = props.cartItems ? props.cartItems.length : null;
        return cartCount;
    }, [props.cartItems]);

    return (
        <TouchableOpacity style={{ marginHorizontal: 5 }}
            // onPress={() => navigation.navigate('CartEF')}
            onPress={() => props.navigation.navigate('MyCart')}
        >
            <AIcon name="shoppingcart" style={{ color: colors.gray_200 }} size={25} />
            {getCartCount > 0 ? (
                <Badge style={{ position: 'absolute', top: -14, right: -14, borderWidth: 1 }}>
                    {getCartCount}
                </Badge>
            ) : null}
            <Text style={{ color: colors.gray_200, fontSize: 8, marginLeft: 4 }}>CART</Text>
        </TouchableOpacity>
    );
}

export default connect(cartItemSelector)(CartIcon);
