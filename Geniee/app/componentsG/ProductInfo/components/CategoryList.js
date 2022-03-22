import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    FlatList,
    Image,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import {
    Header,

    Content,
    Text,
    Icon as NBIcon,
} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import { colors, customStyle, variables } from '../../../config/styles';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import settings from '../../../config/settings';
import { Button as RNPButton, TextInput } from 'react-native-paper';
import AIcon from 'react-native-vector-icons/AntDesign';
import Statusbar from '../../Shared/components/Statusbar';
import { customPaperTheme } from '../../../config/themes';

const CategoryList = (props) => {
    const [categoriesList, setCategoriesList] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(true);

    const categories = props.route.params.data;

    useEffect(() => {
        //
        if (categories) {
            setIsRefreshing(false);
            setCategoriesList(categories);
        } else {
            //getCategoriesList();
        }
    }, [])

    const getCategoriesList = useCallback(() => {
        productHandler.getAllStores((res) => {
            setIsRefreshing(false);
            if (res.result) {
                setCategoriesList(res.result);
            }
            else {
                setCategoriesList(categories);
            }
        });
    });

    const _handleProductPress = (item) => {
        props.navigation.navigate('StoreList', { categoryId: item._id, title: item.title });
    }

    const onRefreshPage = () => {
        //getCategoriesList();
    }

    const _renderCategories = (data, index) => {
        var item = data.item;
        return (
            <View>
                <View key={data.index.toString()} style={styles.containerStyle}>
                    <TouchableOpacity onPress={() => onCategoryClick(item)}>
                        <Image
                            style={{ height: 50, width: 50 }}
                            source={{
                                uri: settings.IMAGE_URLS + item.image,
                            }}
                        />
                        {/*</View>
                </ImageBackground>*/}
                    </TouchableOpacity>
                </View>
                <View style={{ width: 65, marginBottom: 5 }}>
                    <Text style={{ textAlign: 'center', fontSize: 10 }}> {item.title}</Text>
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
                            <Text style={{ color: colors.whiteText, fontSize: 20 }}>Categories List</Text>
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
                        {categoriesList && categoriesList.length > 0 ? (
                            <View>
                                <FlatList
                                    contentContainerStyle={{
                                        paddingBottom: 15,
                                        marginHorizontal: 8,
                                        marginTop: 15
                                    }}
                                    data={categoriesList}
                                    //horizontal={true}
                                    keyExtractor={(item, index) => item._id}
                                    //showsHorizontalScrollIndicator={false}
                                    numColumns={5}
                                    renderItem={(item, index) => _renderCategories(item, index)}
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
export default CategoryList;
