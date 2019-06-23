// If you're running on a device or in the Android simulator be sure to change
//let METEOR_URL = 'ws://192.168.1.228:3000/websocket';
let METEOR_URL = 'ws://192.168.1.108:3000/websocket';
let API_URL = 'ws://192.168.1.108:3000/api/';
let GOOGLE_MAP_API_KEY = 'AIzaSyCMar6aw6cYsJXNv8mHLIEaT9TCYGNefXU';
if (process.env.NODE_ENV === 'production') {
    METEOR_URL = 'ws://192.168.1.108/websocket'; // your production server url
}
export const settings = {
    env: process.env.NODE_ENV,
    METEOR_URL,
    API_URL,
    GOOGLE_MAP_API_KEY,
};
export const userType = {
    NORMAL: 0,
    SERVICE_PROVIDER: 1
}
export default settings;


