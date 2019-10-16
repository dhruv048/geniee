// If you're running on a device or in the Android simulator be sure to change
//let METEOR_URL = 'ws://192.168.1.228:3000/websocket';
import CryptoJS from "react-native-crypto-js";
import settings from "../config/settings"

import FileViewer from 'react-native-file-viewer';
import {Alert} from "react-native";
import call from "react-native-phone-call";

var RNFS = require('react-native-fs');

const _getLocalPath = (url) => {
    const filename = url.split('/').pop();
    // feel free to change main path according to your requirements
    return `${RNFS.DocumentDirectoryPath}/${filename}`;
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
    },
    calculateDistance: (lat1,lon1,lat2,lon2)=>{
console.log(lat1,lon1,lat2,lon2)
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
            return dist.toFixed(2);
        }
    },

    encryptObj:(data)=>{
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), settings.ENC_KEY).toString();
        return ciphertext;
    },

    decryptData:(ciphertext)=>{
        let bytes  = CryptoJS.AES.decrypt(ciphertext, settings.ENC_KEY);
        let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    },

    validatePassword:(password)=>{
        var matchedCase = new Array();
        //  matchedCase.push("{3,5}"); // Special Charector
        matchedCase.push("[$@$!%*#?&]"); // Special Charector
        matchedCase.push("[A-Z]");      // Uppercase Alpabates
        matchedCase.push("[0-9]");      // Numbers
        matchedCase.push("[a-z]");     // Lowercase Alphabates
        var valid = true;
        var color = "white";
        var message = "";
        if(password.length<2){
            let validPassword = {
                valid: valid,
                message: message,
                color: color
            }
            return validPassword;
        }
        if (password.length < 6) {

            valid = false,
                message = "Password Length is less than 6",
                color = "red";
            let validPassword = {
                valid: valid,
                message: message,
                color: color
            }
            return validPassword;
        }
        // Check the conditions
        var ctr = 0;
        for (var i = 0; i < matchedCase.length; i++) {
            if (new RegExp(matchedCase[i]).test(password)) {
                ctr++;
            }
        }

        switch (ctr) {
            case 0:

                break;
            case 1:
                valid = true;
                message = "Very Weak";
                color = "red";
                break;

            case 2:
                valid = true;
                message = "Weak";
                color = "orange";
                break;
            case 3:
                valid = true;
                message = "Medium";
                color = "orange";
                break;
            case 4:
                // if(password.length<8 && !password.length<1){
                //
                //     valid= false,
                //         message="Requires atleast 8 chracters",
                //         color="red";
                // }
                // else {
                valid:true;
                message = "Strong";
                color = "green";
                // }
                break;
        }
        let validPassword = {
            valid: valid,
            message:message,
            color:color
        }

        return validPassword;
    },


    _openFile: (url, fileName) => {
        let options = {
            fromUrl: settings.API_URL+'chatFiles/'+ url,
            toFile: _getLocalPath(settings.API_URL+'image/' + url)
        };
        RNFS.downloadFile(options).promise
            .then(() => FileViewer.open(_getLocalPath(settings.API_URL+'image/' + url), {
                showOpenWithDialog: true,
                displayName: fileName
            }))
            .then(() => {
                // success
            })
            .catch(error => {
                console.log(error)
            });
    },

    _callPhone:(number) => {
        // let res=  this.onEsewaComplete();
        // alert(res);
        console.log(number)
        if (!number) {
            Alert.alert('Contact No. Unavailable for the Service')
        }
        if(number.includes(',')){
            number=number.split(',')[0]
        }
        const args = {
            number: number, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
        }
        call(args).catch(console.error)
    }
};

export default MyFunctions;


