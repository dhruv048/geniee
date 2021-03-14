// If you're running on a device or in the Android simulator be sure to change
//let METEOR_URL = 'ws://192.168.1.228:3000/websocket';
//let METEOR_URL = 'ws://192.168.1.245:3000/websocket';
//let GOOGLE_MAP_API_KEY = 'AIzaSyBJ0EFcgmndRnro9Kw7m8cXo-Tsa6kD9zk';
let GOOGLE_MAP_API_KEY = 'AIzaSyAYCukDWLUZUbTR8LYshKUXwFPUNQQ9xhY';


// let API_URL = 'http://192.168.1.245:3000/api/';
// let IMAGE_URL = 'http://192.168.1.245:3000/api/images/';
// let WEB_URL = 'http://192.168.1.245:3000/';
// let METEOR_URL = 'ws://192.168.1.245:3000/websocket';


 let API_URL = "http://139.59.59.117/api/";
 let IMAGE_URL = 'http://139.59.59.117/api/images/';
 let METEOR_URL = 'ws://139.59.59.117/websocket';
 let WEB_URL = "http://139.59.59.117/";


const USER_TOKEN_KEY = 'USER_TOKEN_KEY_GENNIE';

if (process.env.NODE_ENV === 'production') {
    API_URL = "http://139.59.59.117/api/";
    IMAGE_URL = 'http://139.59.59.117/api/images/';
    METEOR_URL = 'ws://139.59.59.117/websocket';
    WEB_URL = "http://139.59.59.117/";
}

export const settings = {
    env: process.env.NODE_ENV,
    METEOR_URL,
    GOOGLE_MAP_API_KEY,
    API_URL,
    IMAGE_URL,
    WEB_URL,
    USER_TOKEN_KEY

};
export const userType = {
    NORMAL: 0,
    SERVICE_PROVIDER: 1,
    EAT_FIT: 222,
    GENIEE_REPAIR: 111
};

export const PaymentType = {
    CASH: 0,
    ESEWA: 1
};

export const OrderStatus = {
    ORDER_REQUESTED: 0,
    ORDER_DISPATCHED: 1,
    ORDER_DELIVERED: 2,
    ORDER_CONFIRMED: 3,
    ORDER_CANCELLED: 4,
    ORDER_DECLINED: 5,
}

export const ProductOwner = {
    REGULAR_USERS: 0,
    EAT_FIT: 1,
    BAADSHAH_BIRYANI: 2,
};

export const BusinessType = {
    SERVICE_PROVIDER: 0,
    PRODUCTS_GOODS_SELLER: 1,
    RESTURANT: 2,
};

export const ProductType={
    SERVICE: 0,
    PRODUCT: 1,
};

export const NotificationTypes = {
    ORDER_REQUESTED: 0,
    ORDER_DISPATCHED: 1,
    ORDER_DELIVERED: 2,
    ORDER_CONFIRMED: 3,
    ORDER_CANCELLED: 4,
    ORDER_DECLINED: 5,
    ADD_SERVICE: 10,
    ADD_PRODUCT: 11,
    RATE_SERVICE: 12,

};

export const ServiceDuration = {
    Min: 0,
    Hr: 1,
    Day: 2,
    Month: 3,
    Yr: 4,
    SQ_Feet: 5,
};
export default settings;
export const getProfileImage = (url) => {

    if (url.includes('https://'))
        return url;
    else
        return settings.IMAGE_URL + url;
}

