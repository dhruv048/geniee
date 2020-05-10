// If you're running on a device or in the Android simulator be sure to change
//let METEOR_URL = 'ws://192.168.1.228:3000/websocket';
//let METEOR_URL = 'ws://192.168.1.245:3000/websocket';
//let GOOGLE_MAP_API_KEY = 'AIzaSyBJ0EFcgmndRnro9Kw7m8cXo-Tsa6kD9zk';
let GOOGLE_MAP_API_KEY = 'AIzaSyAYCukDWLUZUbTR8LYshKUXwFPUNQQ9xhY';


let API_URL='http://192.168.1.245:3000/api/';
let IMAGE_URL='http://192.168.1.245:3000/api/images/';
let WEB_URL='http://192.168.1.245:3000/';
let METEOR_URL = 'ws://192.168.1.245:3000/websocket';


// let API_URL = "https://api.krishisansaar.com/api/";
// let IMAGE_URL='https://api.krishisansaar.com/api/images/';
// let METEOR_URL = 'wss://api.krishisansaar.com/websocket';
// let WEB_URL = "https://api.krishisansaar.com/";


if (process.env.NODE_ENV === 'production') {
    METEOR_URL = 'wss://api.krishisansaar.com/websocket';
    //API_URL = "http://139.59.81.51/api/";
    API_URL = "https://api.krishisansaar.com/api/";
    IMAGE_URL='https://api.krishisansaar.com/api/images/';
    WEB_URL = "https://api.krishisansaar.com/";
}
export const settings = {
    env: process.env.NODE_ENV,
    METEOR_URL,
    GOOGLE_MAP_API_KEY,
    API_URL,
    IMAGE_URL,
    WEB_URL
};
export const userType = {
    NORMAL: 0,
    SERVICE_PROVIDER: 1,
    EAT_FIT:222,
    GENIEE_REPAIR:111
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
}

export const ProductOwner = {
    REGULAR_USERS:0,
    EAT_FIT:1,
    BAADSHAH_BIRYANI:2,
};

export const NotificationTypes = {
    ADD_SERVICE:0,
    ADD_PRODUCT:1,
    RATE_SERVICE:2
};
export default settings;


