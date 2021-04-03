/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Appp from './Appp';
import {name as appName} from './app.json';
import settings from './app/config/settings';
import Meteor from './app/react-native-meteor';

Meteor.connect(settings.METEOR_URL);
AppRegistry.registerComponent(appName, () => Appp);
