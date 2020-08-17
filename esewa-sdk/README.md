
# react-native-esewa-sdk

## Getting started

`$ npm install react-native-esewa-sdk --save`

### Mostly automatic installation

`$ react-native link react-native-esewa-sdk`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-esewa-sdk` and add `RNEsewaSdk.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNEsewaSdk.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.roshan.esewa.RNEsewaSdkPackage;` to the imports at the top of the file
  - Add `new RNEsewaSdkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-esewa-sdk'
  	project(':react-native-esewa-sdk').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-esewa-sdk/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-esewa-sdk')
  	```


## Usage
```javascript
import RNEsewaSdk from 'react-native-esewa-sdk';

// TODO: What to do with the module?
RNEsewaSdk;
```
  