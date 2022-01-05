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

const StoreList = (props) => {
    const [loggedUser, setLoggedUser] = useState(Meteor.user());
    const [storesList, setStoresList] = useState([]);
    const [filterStoreList, setfilterStoreList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterItem, setFilterItem] = useState();
    const [isRefreshing, setIsRefreshing] = useState(true);
    let storeLocationList = [];

    const categoryId = props.route.params.categoryId;
    const categoryTitle = props.route.params.title;

    useEffect(() => {
        //
        //Get Categorieswise store
        getStoreCategoriesWise();
    }, [])

    const getStoreCategoriesWise = useCallback(() => {
        productHandler.getStoreCategoriesWise(categoryId, (res) => {
            setIsRefreshing(false);
            if (res) {
                console.log(res);
                setStoresList(res);
                setfilterStoreList(res);
            }
        });
    });
    const _handleProductPress = (item) => {
        props.navigation.navigate('StoreDetail', { data: item });
    }

    const loadStoreLocation = () => {
        if (storesList && storesList.length > 0) {
            storesList.map(item => {
                storeLocationList.push(item.city)
            });
        };
        const storeLocations = Array.from(new Set(storeLocationList));
        return storeLocations.map(item => (
            <Picker.Item label={item} value={item} style={styles.locationDropdown} />
        ))
    };

    const _handleSearchText = (text) => {
        setSearchText(text);
        if (text) {
            let filterData = storesList.filter(item => {
                const itemData = item.businessName ? item.businessName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setfilterStoreList(filterData);
        } else {
            setfilterStoreList(storesList);
        }
    }

    const _handleLocationChange = (filterLocation) => {
        if (filterLocation === 'Store Location') {
            setfilterStoreList(storesList);
        } else {
            let filterData = storesList.filter(item => {
                const itemData = item.city ? item.city.toUpperCase() : ''.toUpperCase();
                const textData = filterLocation.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            if (filterData) {
                setfilterStoreList(filterData);
            }
            else {
                setfilterStoreList(storesList);
            }
        }
    }

    const onRefreshPage = () => {
        getStoreCategoriesWise();
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
                            <Text style={{ color: colors.whiteText, fontSize: 20 }}>{categoryTitle}</Text>
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
                        <View>
                            <TextInput
                                mode="outlined"
                                //color={customGalioTheme.COLORS.INPUT_TEXT}
                                label="Search in here"
                                placeholder="Search in here"
                                placeholderTextColor="#808080"
                                value={searchText}
                                onChangeText={(value) => { _handleSearchText(value) }}
                                style={styles.inputBox}
                                theme={{ roundness: 6 }}
                            />
                        </View>
                        {/* STORE*/}
                        {storesList && storesList.length > 0 ? (
                            <View style={styles.block}>
                                <View style={{ width: '50%' }}>
                                    <Picker
                                        placeholder='Store Location'
                                        selectedValue={filterItem}
                                        onValueChange={(itemValue, itemIndex) => _handleLocationChange(itemValue)
                                        }>
                                        <Picker.Item label='Store Location' value='0' style={styles.locationDropdown} />
                                        {loadStoreLocation()}
                                    </Picker>
                                </View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={filterStoreList}
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
export default StoreList;
