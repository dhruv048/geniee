import React, {PureComponent} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Modal,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import {Button} from 'react-native-paper';
import MapView from 'react-native-maps';
import settings from '../config/settings';
import Geolocation from 'react-native-geolocation-service';
import {colors} from '../config/styles';
import Icon from 'react-native-vector-icons/Feather';
import {Input, Item, ListItem} from 'native-base';
import Autocomplete from 'native-base-autocomplete';
import _ from 'lodash';
// Disable yellow box warning messages
console.disableYellowBox = true;

export default class LocationPicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      region: {
        latitude: 27.71202,
        longitude: 85.31295,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      isMapReady: false,
      marginTop: 1,
      userLocation: '',
      regionChangeProgress: false,
      query: '',
      locations: [],
    };
    this.granted;
    this.watchID;
    this.backHandler;
    this.debounceFindLocation = _.debounce(this.findLocation, 500);
  }

  async componentDidMount() {
    await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(result => {
        //  console.log(result);  // would be "granted"
        this.granted = result;
      })
      .catch(error => {
        console.log('error', error);
      });
    // if (this.granted === PermissionsAndroid.RESULTS.GRANTED) {
    if (this.granted) {
      Geolocation.getCurrentPosition(
        position => {
          //   console.log(position);
          let region = {
            latitude: 27.71202,
            longitude: 85.31295,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          };
          region.latitude = position.coords.latitude;
          region.longitude = position.coords.longitude;
          this.setState({region});
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      console.log('Location permission denied');
    }
    this.watchID = Geolocation.watchPosition(
      position => {
        //  console.log(position);
        let region = {
          latitude: 27.71202,
          longitude: 85.31295,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        };
        region.latitude = position.coords.latitude;
        region.longitude = position.coords.longitude;
        this.setState({region});
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress() {
    console.log('should close');
    this.props.close();
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
    //   this.backHandler.remove();
  }

  onMapReady = () => {
    this.setState({isMapReady: true, marginTop: 0});
  };

  _handleLocationSelect(location) {
    //  alert('clicked');
    this.setState({query: location.description});
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${location.place_id}&fields=formatted_address,geometry,address_component,adr_address&key=${settings.GOOGLE_MAP_API_KEY}`,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        let region = {
          latitude: '',
          longitude: '',
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        };
        this.setState({regionChangeProgress: true, region: region});
        region.latitude = responseJson.result.geometry.location.lat;
        region.longitude = responseJson.result.geometry.location.lng;

        console.log(region, responseJson.result);

        this.setState({
          locations: [],
          region: region,
          userLocation: responseJson.result,
          regionChangeProgress: false,
        });
        //     formatted_address: responseJson.result.formatted_address,
        //     geometry: {
        //         type: "Point",
        //         coordinates: [responseJson.result.geometry.location.lng, responseJson.result.geometry.location.lat]
        //     },
        //     location: responseJson.result.geometry.location
        // };
      });
  }
  findLocation(query) {
    let API = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${settings.GOOGLE_MAP_API_KEY}&input=${query}&types=geocode&components=country:np`;
    if (!query || query.length <= 2) {
      this.setState({
        // loading: false,
        locations: [],
      });
    } else if (query.length > 2) {
      fetch(API)
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({
            // loading: false,
            locations: responseJson.predictions,
          });
          //   return responseJson.predictions;
        })
        .catch(error => console.log(error));
    }
  }

  // Fetch location details as a JOSN from google map API
  fetchAddress = region => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        this.state.region.latitude +
        ',' +
        this.state.region.longitude +
        '&key=' +
        settings.GOOGLE_MAP_API_KEY,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        const userLocation = responseJson.results[0];
        userLocation.geometry.location.lat = this.state.region.latitude;
        userLocation.geometry.location.lng = this.state.region.longitude;
        this.setState({
          userLocation: userLocation,
          regionChangeProgress: false,
        });
      });
  };

  // Update state on region change
  onRegionChange = region => {
    //   console.log(region);
    this.setState(
      {
        region,
        regionChangeProgress: true,
      },
      () => this.fetchAddress(region),
    );
  };

  // Action to be taken after select location button click
  onLocationSelect = () => {
    this.fetchAddress();
    this.props.onLocationSelect(this.state.userLocation);
    //  alert(this.state.userLocation);
  };

  render() {
    const {query} = this.state;
    //  const locations = this.debounceFindLocation(query)||[];
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    console.log('locations', this.state.locations);

    if (this.state.loading) {
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.modalVisible}
          onRequestClose={() => this.props.close()}>
          <View style={styles.container}>
            {/*<View   style={{ backgroundColor: '#F5FCFF',*/}
            {/*flex: 1,*/}
            {/*left: 20,*/}
            {/*position: 'absolute',*/}
            {/*right: 20,*/}
            {/*top: 10,*/}
            {/*zIndex: 1}}>*/}
            <Autocomplete
              // style={{   width: '100%',
              //     height: 40,
              //     backgroundColor: colors.inputBackground,
              //     borderRadius: 25,
              //     paddingHorizontal: 16,
              //     fontSize: 16,
              //     color: colors.whiteText,
              //     marginVertical: 5,}}
              autoCapitalize="none"
              containerStyle={{flex: this.state.locations.length > 0 ? 1 : 0.2}}
              autoCorrect={false}
              //      containerStyle={styles.autocompleteContainer}
              data={
                this.state.locations.length === 1 &&
                comp(query, this.state.locations[0].description)
                  ? []
                  : this.state.locations
              }
              defaultValue={query}
              onChangeText={text => {
                this.setState({query: text}), this.debounceFindLocation(text);
              }}
              placeholder="Search Location"
              renderItem={item => (
                <ListItem
                  key={item.id}
                  onPress={() => this._handleLocationSelect(item)}>
                  <View>
                    <Text style={styles.itemText}>{item.description}</Text>
                  </View>
                </ListItem>
              )}
            />
            {/*</View>*/}
            <View style={{flex: 2}}>
              {!!this.state.region.latitude &&
                !!this.state.region.longitude && (
                  <MapView
                    style={{...styles.map, marginTop: this.state.marginTop}}
                    initialRegion={this.state.region}
                    showsUserLocation={true}
                    onMapReady={this.onMapReady}
                    onRegionChangeComplete={this.onRegionChange}></MapView>
                )}

              <View style={styles.mapMarkerContainer}>
                <Icon
                  name={'map-pin'}
                  style={{fontSize: 42, color: colors.primary}}
                />
              </View>
            </View>
            <View style={styles.deatilSection}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '400',
                  fontFamily: 'roboto',
                  marginBottom: 10,
                  color: colors.body_color,
                }}>
                Move map for location
              </Text>
              <Text style={{fontSize: 10, color: '#999'}}>LOCATION</Text>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#000',
                  paddingVertical: 10,
                  borderBottomColor: 'silver',
                  borderBottomWidth: 0.5,
                  marginBottom: 20,
                }}>
                {!this.state.regionChangeProgress
                  ? this.state.userLocation.formatted_address
                  : 'Identifying Location...'}
              </Text>
              {/* <View style={styles.btnContainer}> */}
              <Button
                // round
                color={colors.primary}
                mode="contained"
                onPress={this.onLocationSelect}
                style={{
                  width: '100%',
                  marginBottom: 28,
                  elevation: 0,
                }}>
                PICK THIS LOCATION
              </Button>
              {/* <Button
                  color={colors.primary}
                  title="PICK THIS LOCATION"
                  disabled={this.state.regionChangeProgress}
                  onPress={this.onLocationSelect}></Button> */}
              {/* </View> */}
            </View>
          </View>
        </Modal>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  map: {
    flex: 1,
  },
  mapMarkerContainer: {
    left: '47%',
    position: 'absolute',
    top: '42%',
  },
  mapMarker: {
    fontSize: 40,
    color: 'red',
  },
  deatilSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  spinnerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    width: Dimensions.get('window').width - 20,
    position: 'absolute',
    bottom: 100,
    left: 10,
  },
  // container: {
  //     backgroundColor: '#F5FCFF',
  //     flex: 1,
  //     paddingTop: 25
  // },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    // backgroundColor:colors.gray_200
  },
  itemText: {
    fontSize: 15,
    margin: 2,
    color: colors.primary,
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 25,
  },
  infoText: {
    textAlign: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  openingText: {
    textAlign: 'center',
  },
});
