/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {colors} from './app/config/styles';
import {name as appName} from './app.json';
import { Navigation } from 'react-native-navigation';
Navigation.registerComponent(appName, () => App);

// AppRegistry.registerComponent(appName, () => App);


Navigation.events().registerAppLaunchedListener(() => {

Navigation.setDefaultOptions({
	statusBar: {
		style: 'light',
		backgroundColor:colors.statusBar,
	},

	animations: {
		setRoot: {
			enabled: 'true',
			alpha: {
				from: 0,
				to: 1,
				duration: 400,
				startDelay: 100,
				interpolation: 'accelerate',
			},
		},
	},
});

    Navigation.setRoot({
        root: {
            component: {
                name: appName
            }
        }
    });
});
