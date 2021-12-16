import React from 'react';
import { StatusBar } from 'react-native';

const Statusbar = () =>{
    return(
        <StatusBar backgroundColor='transparent'
          barStyle='dark-content'
          translucent={true} />
    )
}

export default Statusbar;