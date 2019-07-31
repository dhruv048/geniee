// If you're running on a device or in the Android simulator be sure to change
//let METEOR_URL = 'ws://192.168.1.228:3000/websocket';
let METEOR_URL = 'ws://192.168.1.245:3000/websocket';
let GOOGLE_MAP_API_KEY = 'AIzaSyCMar6aw6cYsJXNv8mHLIEaT9TCYGNefXU';
let API_URL='http://192.168.1.245:3000/api/';
let IMAGE_URL='http://192.168.1.245:3000/api/';
if (process.env.NODE_ENV === 'production') {
    METEOR_URL = 'ws://139.59.81.51/websocket';
    API_URL = 'ws://139.59.81.51/api/';
    IMAGE_URL='https://krishisansaar.com/api/'
}
export const settings = {
    env: process.env.NODE_ENV,
    METEOR_URL,
    GOOGLE_MAP_API_KEY,
    API_URL
};
export const userType = {
    NORMAL: 0,
    SERVICE_PROVIDER: 1
}
export default settings;


