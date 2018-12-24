// If you're running on a device or in the Android simulator be sure to change
let METEOR_URL = 'ws://192.168.1.245:3000/websocket';
let GOOGLE_MAP_API_KEY='AIzaSyCMar6aw6cYsJXNv8mHLIEaT9TCYGNefXU';
if (process.env.NODE_ENV === 'production') {
  METEOR_URL = 'ws://0.0.0.0/websocket'; // your production server url
}
export const settings = {
  env: process.env.NODE_ENV,
  METEOR_URL,
  GOOGLE_MAP_API_KEY,
};
export default settings;