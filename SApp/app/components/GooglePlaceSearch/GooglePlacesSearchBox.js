import React, { Component } from 'react';
import { LayoutAnimation, StyleSheet, Dimensions, Text, View, Image,Modal,ScrollView } from 'react-native';
import stylse from "./styles";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import settings from "../../config/settings";
import Icon  from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

const GooglePlaceSearchBox=(props)=>{
    const {  onPress ,listDisplay} = props;
    return (
        <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={3} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed={false}    // true/false/undefined
            fetchDetails={true}
            //renderDescription={row => row.description} // custom description render
            onPress={onPress}
            //getDefaultValue={() => ''}

            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: settings.GOOGLE_MAP_API_KEY,
                language: 'en', // language of the results
               //  types: '(regions)', // default: 'geocode'
                components:'country:np'
            }}

            styles={{
                textInputContainer: {
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth:0,
                    margin:0,
                    height:60
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
                textInput: {
                    backgroundColor: `rgba(243, 247, 255, 1)`,
                    borderRadius: 5,
                    color: `rgba(0, 0, 0, 1)`,
                    fontFamily: `Source Sans Pro`,
                    fontSize: 18,
                   // padding: 10,
                    paddingLeft: 40,
                    width: `100%`,
                    marginBottom: 4,
                    marginTop: 4,
                    height:50
                },
            }}
            // predefinedPlaces={yourPlace}
          //  currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          //  currentLocationLabel="Your current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            // GoogleReverseGeocodingQuery={{
            //     // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            // // }}
            // GooglePlacesSearchQuery={{
            //     // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            //     rankby: 'distance',
            //     types: 'address',
            //     fields:'geometry'
            // }}
          //  filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            // renderLeftButton={()  => <Icon size={20} name="caret-left"></Icon>}
            // renderRightButton={() => <Text></Text>}
        />
    )
}
GooglePlaceSearchBox.propTypes = {
    onPress: PropTypes.func,
};

export default GooglePlaceSearchBox;

