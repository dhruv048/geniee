/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Navigation } from "react-native-navigation";

// AppRegistry.registerComponent(appName, () => App);

Navigation.registerComponent(appName, () => App);

Navigation.events().registerAppLaunchedListener(() => {
    // set the root component
    Navigation.setRoot({
        root: {
            component: {
                name: appName
            }
        }
    });
});
