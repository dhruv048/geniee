import React, { Component } from 'react';

import { Container, Header, Left, Body, Title, Subtitle, Right, Content, List, ListItem, Thumbnail, Footer, FooterTab, Button, Icon, Text, Item, Input } from 'native-base';

import {StyleSheet, Image, StatusBar} from 'react-native';

import logoImage from '../../images/logo2-trans-640X640.png';

class MenuNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }

    }

    render() {
        return (
            <Content style={styles.content}>
                <List style={styles.contentList}>
                    <ListItem thumbnail>
                        <Left>
                            <Icon name="search" />
                        </Left>
                        <Body>
                            <Text>Category</Text>
                        </Body>
                        <Right>
                            <Icon name="search" />
                        </Right>
                    </ListItem>
                    <ListItem thumbnail>
                        <Left>
                            <Icon name="search" />
                        </Left>
                        <Body>
                            <Text>About Us</Text>
                        </Body>
                        <Right>
                            <Icon name="search" />
                        </Right>
                    </ListItem>
                    <ListItem thumbnail>
                        <Left>
                            <Icon name="search" />
                        </Left>
                        <Body>
                            <Text>Privacy Policy</Text>
                        </Body>
                        <Right>
                            <Icon name="search" />
                        </Right>
                    </ListItem>
                </List>
            </Content>
        );
    };
}

const styles = StyleSheet.create({
    content: {
        backgroundColor:'#c2c2c2',
        //borderTopWidth: 3,
        //borderTopColor: '#000000',
        //borderBottomWidth: 3,
        //borderBottomColor: '#000000',        
    },
    contentList: {
        //marginVertical: 3,
        //paddingVertical: 3
    },
    image: {
      width: 56,
      height: 56,
      borderRadius: 50,
      backgroundColor: '#000000'
    }
});

export default MenuNav;