// If you're running on a device or in the Android simulator be sure to change
//let METEOR_URL = 'ws://192.168.1.228:3000/websocket';
let METEOR_URL = 'ws://192.168.1.245:3000/websocket';
let GOOGLE_MAP_API_KEY = 'AIzaSyCMar6aw6cYsJXNv8mHLIEaT9TCYGNefXU';
let API_URL='http://192.168.1.245:3000/api/';
if (process.env.NODE_ENV === 'production') {
    METEOR_URL = 'ws://139.59.81.51/websocket';
    API_URL='https://api.krishisansaar.com/'
}
export const MyFunctions = {
    isWithinRange: (lat1,lon1,lat2,lon2,range)=>{
       // debugger;
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return false;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            if(dist<range || dist===range)
                return true;
            else
                return false
        }
    }
};
export default MyFunctions;


