import {StyleSheet} from 'react-native';

export const colors = {
    appBackground: '#ffffff',
    // statusBar: '#4d94ff',
    statusBar: '#4d94ff',
    inputBackground: '#eaf2ff',
    buttonPrimaryBackground: '#4d94ff',
    primaryText: '#4d94ff',
    redText: '#a51822',
    whiteText: '#ffffff',
    appLayout: '#4d94ff',
    primary: '#397CCD',
    warning: '#EFBD6E',
    danger: '#FF7278',
    success: '#45D36B',
    info: 'blue',
    light: '#F2FAFF',
    gray_100: '#2E2E2E',
    gray_200: '#8E8E8E',
};

export const variables = {
    //Font size
    fontSizeLarge: 20,
    fontSizeMedium: 16,
    fontSizeNormal: 14,
    fontSizeSmall: 12,

    //Font family
    fontFamilyDefault: 'Roboto',

    //Random color
    bodyBG: '#EFF5FA',
    //  bodyBG: '#edfafa',
    defaultColor: '#2E2E2E',
    black: '#000',
    white: '#fff',

    //Theme color
    //  primary: '#4FA4F3',
    primary: '#397CCD',
    warning: '#EFBD6E',
    danger: '#FF7278',
    success: '#45D36B',
    info: 'blue',

    //Gray scale color
    gray_100: '#2E2E2E',
    gray_200: '#8E8E8E',

    //Shadow
    elavation_0: 0,
    elavation_1: 1,

    //Padding & Margin
    gapLarge: 30,
    gapMedium: 20,
    gapSmall: 10,
    gapXSmall: 5,

    radioNormal: '#ddd',
    radioActive: colors.primary,

    checkboxNormal: '#ddd',
    checkboxActive: colors.primary,

};

export const customStyle = StyleSheet.create({
    Container: {
        backgroundColor: variables.bodyBG,
        flex: 1
    },
    Card: {
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        shadowRadius: null,
        elevation: variables.elavation_0,
        borderWidth: 0,
        borderColor: 'transparent'
    },
    noList: {
        padding: variables.gapMedium,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noListTextColor: {
        color: variables.gray_200,
        marginTop: 20
    },

    // Custom Tabs
    //<Tabs>
    tabsContainerStyle: {
        //backgroundColor: 'green',
    },
    tabContainerStyle: {
        backgroundColor: variables.primary,
        elevation: variables.elavation_1,
    },
    tabBarUnderlineStyle: {
        height: 2,
        backgroundColor: variables.primary
    },
    //<Tab>
    tabStyle: {
        backgroundColor: '#fff',
    },
    textStyle: {
        color: variables.gray_200
    },
    activeTabStyle: {
        backgroundColor: variables.white,
    },
    activeTextStyle: {
        color: variables.primary,
        fontWeight:'bold'
    },
    //Buttons
    buttonPrimary: {
        elevation: variables.elavation_0,
        backgroundColor: variables.primary,
    },
    buttonPrimaryText: {
        //textTransform: 'capitalize'
        color: '#fff'
    },
    buttonOutlinePrimary: {
        elevation: variables.elavation_0,
        borderColor: variables.primary,
        borderWidth: 1,
        backgroundColor: null
    },
    buttonOutlinePrimaryText: {
        color: variables.primary
    },
    buttonLight: {
        elevation: variables.elavation_0,
        backgroundColor: '#EFF5FA',
    },
    buttonLightText: {},
    buttonSecondary: {},
    buttonSecondaryText: {},
    buttonOutlineSecondary: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: variables.elavation_0,
    },
    buttonOutlineSecondaryText: {
        color: variables.gray_100
    },
    buttonDisabled: {
        elevation: variables.elavation_0,
        backgroundColor: '#C9C6C6',
    },
    buttonDisabledText: {},
    //Buttons Small
    buttonSmall: {
        height: 30,
    },

    //Badges
    badgePrimary: {
        backgroundColor: variables.primary,
        height: 24
    },
    badgePrimaryText: {
        fontSize: variables.fontSizeSmall,
    },
    badgeSuccess: {
        backgroundColor: variables.success,
        height: 24
    },
    badgeSuccessText: {
        fontSize: variables.fontSizeSmall,
    },
    badgeWarning: {
        backgroundColor: variables.warning,
        height: 24
    },
    badgeWarningText: {
        fontSize: variables.fontSizeSmall,
    },
    badgeDanger: {
        backgroundColor: variables.danger,
        height: 24
    },
    badgeDangerText: {
        fontSize: variables.fontSizeSmall,
    },

    //List
    list: {},
    list: {},
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2
    },
    listLabel: {
        flex: 1,
        paddingRight: variables.gapSmall
    },
    listText: {
        flex: 1,
        textAlign: 'right'
    },
    listItemStacked: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 10
    },
    listData: {
        fontSize: variables.fontSizeMedium
    },
    listTitle: {
        fontSize: variables.fontSizeMedium
    },
    listSubtitle: {
        fontSize: variables.fontSizeNormal
    },
    //Footer
    footer: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: variables.gapSmall
    },
    //Grid
    row: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: -(variables.gapXSmall)
    },
    col: {
        flex: 1,
        paddingHorizontal: variables.gapXSmall
    },
    // Modal
    modal: {},
    modalDialog: {
        flex: 1,
        flexDirection: 'column',
    },
    modalScrollView: {
        padding: 20
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    modalTitleHolder: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 10
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '100%'
    },
    modalFooter: {
        backgroundColor: '#fff',
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: variables.elavation_1
    },
    modalForm: {
        flex: 1,
        padding: 15,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 4,
        position: 'relative',
        marginVertical: 5
    },
    modalFormContent: {
        paddingVertical: 10
    },
    placeholderTextColor: {
        color: '#777'
    },
    autoComplete: {},
    autoCompleteListItem: {
        backgroundColor: '#f4f4f4'
    },
    formCloseButton: {
        position: 'absolute',
        top: 5,
        right: 15
    },
    formGroup: {
        marginVertical: 15
    },
    formLabel: {
        fontSize: 15
    },
    formControl: {},
    datePickerPlaceHolderText: {
        color: '#777777'
    },
    datePickerActiveText: {
        color: '#2E2E2E'
    },
    radioGroup: {
        flexDirection: 'row'
    },
    radioInline: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0,
        marginRight: 20,
    },
    radioButton: {
        marginRight: 5
    },
    sectionHeader: {
        paddingVertical: 10,
    },
    sectionHeaderTitle: {
        fontWeight: 'bold'
    },
    sectionContent: {
        paddingVertical: 10
    },
    columnNormal: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        position: 'relative'
    },
    columnActive: {
        backgroundColor: colors.light,
        borderColor: variables.primary,
    },
    columnCheckedIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        color: variables.primary
    }
})

