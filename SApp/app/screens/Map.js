import React ,{Component} from 'react';
import MapView ,{PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import {Container,Content} from 'native-base';
import {View,Alert,StyleSheet,Dimensions,PermissionsAndroid,TouchableWithoutFeedback} from 'react-native';
var {height, width} = Dimensions.get('window');
import {Text,Item} from 'native-base';
import {withNavigation} from 'react-navigation';

class Map extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            region: {
                latitude:27.712020,
                longitude:85.312950,
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
            },
            markers:[]
        }

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
            navigator.geolocation.getCurrentPosition(
                ( position) => {
                    console.log(position)
                 //   const location = JSON.stringify(position);
                    let region= {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.4,
                    };
                    this.setState({ region:region });
                },
                // error => Alert.alert(error.message),
                { enableHighAccuracy: true, timeout: 5000}
            );
        } else {
            console.log("Location permission denied")
        }

    }

    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    handleClick=(id)=>{
        this.props.navigation.navigate('Service',{'Id':id});
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

export default withNavigation(Map)