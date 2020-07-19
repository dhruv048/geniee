import React ,{Component} from 'react';
import MapView ,{PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import {Container,Content} from 'native-base';
import {View,Alert,StyleSheet,Dimensions,PermissionsAndroid,TouchableWithoutFeedback} from 'react-native';
var {height, width} = Dimensions.get('window');
import Geolocation from 'react-native-geolocation-service';
import {goToRoute} from '../Navigation';
import Navigation from 'react-native-navigation';

class Map extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            region: {
                latitude:27.712020,
                longitude:85.312950,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            },
            markers:[]
        }
        this.watchID=null;

    }
  componentWillUnmount(){
      this.watchID != null && Geolocation.clearWatch(this.watchID);
  }
  async  componentDidMount(){
        // this.setState({
        //     markers:this.props.markers
        // })
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'This App needs access to your location ' +
                'so we can know where you are.'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            console.log("You can use locations ")
           Geolocation.getCurrentPosition(
                ( position) => {
                    console.log(position)
                 //   const location = JSON.stringify(position);
                    let region= {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    };
                    this.setState({ region:region });
                },
                // error => Alert.alert(error.message),
                { enableHighAccuracy: true, timeout: 5000}
            );
        } else {
            console.log("Location permission denied")
        }

      this.watchID = Geolocation.watchPosition(
          (position) => {
              console.log(position);
              let region= {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
              };
              this.setState({ region:region });
          },
          (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
      );

    }

    getInitialState() {
        return {
            region: this.region,
        };
    }

    handleClick=(id)=>{
        console.log(this.props.componentId,id);
        goToRoute(this.props.componentId,'ServiceDetail',{'Id':id});
}

    onRegionChange(region) {
        // this.setState({ region:region });
    }
    render(){
   //     console.log(height,width,this.props.markers[0])
        return(
            <View >
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        region={this.state.region}
                        onRegionChange={this.onRegionChange}
                        showsUserLocation={true}
                        showsCompass={true}
                        style={{
                           // ...StyleSheet.absoluteFillObject,
                            height: height,
                            // top:10,
                            // bottom:10,
                            width: width,
                         //  flex:1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',}}
                    >
                        {this.props.markers.map((marker,i) => (
                            <Marker
                                key={i}
                                coordinate={marker.latlng}
                                onPress={() => {this.handleClick(marker._id)}}
                               title={marker.title}
                                description= {marker.description}
                            >
                            </Marker>
                        ))}
                    </MapView>

            </View>
    )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marker: {
        backgroundColor: "#550bbc",
        padding: 5,
        borderRadius: 5,
    },
    text: {
        color: "#FFF",
        fontWeight: "bold"
    }
});

export default (Map)