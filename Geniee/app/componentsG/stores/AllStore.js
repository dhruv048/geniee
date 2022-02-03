import React, { Component, useCallback, useEffect, useState } from 'react';
import Meteor from '../../react-native-meteor';
import {
    StyleSheet,
    Dimensions,
    View,
    ToastAndroid,
    TouchableOpacity,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    RefreshControl,
} from 'react-native';
import {
    Header,
    Container,
    Content,
    Item,
    Body,
    Left,
    Button,
    Right,
    Text,
    ListItem,
    Thumbnail,
    Icon as NBIcon,
    Spinner,
    Card,
    CardItem,
    Picker,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { colors, customStyle, variables } from '../../config/styles';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../config/settings';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import Moment from 'moment';
import AIcon from 'react-native-vector-icons/AntDesign';
import productHandler from '../../store/services/product/handlers';
import Statusbar from '../Shared/components/Statusbar';
import { customPaperTheme } from '../../config/themes';

const AllStore = (props) => {
    const [loggedUser, setLoggedUser] = useState(Meteor.user());
    const [storesList, setStoresList] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(true);

    const stores = props.route.params.data;

    useEffect(() => {
        //
        if (stores) {
            setIsRefreshing(false);
            setStoresList(stores);
        } else {
            getAllStore();
        }
    }, [])

    const getAllStore = useCallback(() => {
        productHandler.getAllStores((res) => {
            setIsRefreshing(false);
            if (res.result) {
                setStoresList(res.result);
            }
        });
    });

    const _handleProductPress = (item) => {
        props.navigation.navigate('StoreDetail', { data: item });
    }

    const onRefreshPage = () => {
        getAllStore();
    }

    const _renderStore = (data, index) => {
        let item = data.item;
        return (
            <View
                key={item._id}
                // onPress={() => _handleProductPress(item)}
                style={[
                    customStyle.productContainerStyle,
                    { borderTopLeftRadius: 4, borderTopRightRadius: 5 },
                ]}>
                <View
                    key={item._id}
                    style={[customStyle.Card, { top: 0, left: 0, rigth: 0 }]}>
                    <View style={{ width: '100%', borderRadius: 5 }}>
                        <Image
                            source={{ uri: settings.IMAGE_URLS + item.registrationImage }}
                            style={styles.imageStyle}
                        />
                    </View>
                    {item.isApproved ? <View style={{ flexDirection: 'row', position: 'absolute', top: 55, left: 6 }}>
                        <AIcon name='checkcircle' style={{ marginRight: 3, color: colors.statusBar }} />
                        <Text style={{ fontSize: 10 }}>Verified</Text>
                    </View> : null}
                    <View>
                        <View>
                            <Text numberOfLines={1} style={{ fontSize: 10 }}>{item.city}</Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, fontWeight: 'bold', color: colors.gray_100 }}>
                                {item.businessName}
                            </Text>
                            <View style={{ marginTop: 5, marginRight: 5 }}>
                                <RNPButton
                                    mode='text'
                                    uppercase={false}
                                    onPress={() => { _handleProductPress(item) }}
                                >
                                    <Text style={{ fontSize: 10 }}>Visit</Text>
                                    <Icon name='chevron-right' style={{ marginLeft: 10, marginTop: 10 }} />
                                </RNPButton>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.whiteText }}>
                <Statusbar />
                <View style={{ marginVertical: customPaperTheme.headerMarginVertical }}>
                    <Header
                        androidStatusBarColor={colors.statusBar}
                        style={{ backgroundColor: colors.statusBar }}
                    >
                        <RNPButton
                            transparent
                            uppercase={false}
                            style={{ width: '100%', alignItems: 'flex-start' }}
                            onPress={() => {
                                props.navigation.goBack();
                            }}>
                            <Icon style={{ color: '#ffffff', fontSize: 20 }} name="arrow-left" />
                            <Text style={{ color: colors.whiteText, fontSize: 20 }}>Stores List</Text>
                        </RNPButton>
                    </Header>
                </View>
                <Content
                    // onScroll={_onScroll}
                    refreshControl={<RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefreshPage}
                    />}
                    style={{
                        //width: '100%',
                        flex: 1,
                        paddingTop: 2,
                        marginHorizontal: 10
                    }}>
                    {/* Search bar */}
                    <View>
                        {/* STORE*/}
                        {storesList && storesList.length > 0 ? (
                            <View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={storesList}
                                    //horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    numColumns={3}
                                    renderItem={(item, index) => _renderStore(item, index)}
                                />
                            </View>
                        ) : null}
                    </View>

                </Content>
                {/* <FooterTabs route={'Home'} componentId={props.componentId}/> */}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({

    inputBox: {
        width: '100%',
        height: 40,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 18,
        //backgroundColor: colors.transparent,
        marginBottom: 10,
    },
    locationDropdown: {
        height: 40,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 17,
        marginBottom: 10,
    },
    imageStyle: {
        flex: 1,
        width: undefined,
        height: 70,
        width: 100,
        resizeMode: 'cover',
        borderRadius: 4,
        marginBottom: 8,
    }
});
export default AllStore;
