import React, { Component } from 'react';

import { Container, Header, Left, Body, Title, Subtitle, Right, Content, List, ListItem, Thumbnail, Footer, FooterTab, Button, Icon, Text, Item, Input } from 'native-base';

import {StyleSheet, Image, StatusBar} from 'react-native';

import logoImage from '../images/logo2-trans-640X640.png';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            
        }

    }
    componentWillMount() {
        this.mounted = true;

    }

    componentWillUnmount(){
        this.mounted = false;
    }   

    render() {

        return (
            <Container>
                
                <Header noLeft style={{backgroundColor:'#094c6b'}}>
                    <Left>
                        <Button transparent>
                            <Icon name="search" />
                        </Button>                        
                    </Left>
                    <Body>
                        <Title>SAPP</Title>
                        <Subtitle>one place solutions</Subtitle>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="search" />
                        </Button>
                        <Button transparent>
                            <Icon name='more' />
                        </Button>
                    </Right>
                </Header>
                
                <Content style={styles.content}>
                    <List style={styles.contentList}>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                        <ListItem thumbnail>
                            <Left>
                                <Thumbnail square source={logoImage} />
                            </Left>
                            <Body>
                                <Text>Sapp Home Service</Text>
                                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text>View</Text>
                                </Button>
                            </Right>
                        </ListItem>
                    </List>
                </Content>

                <Footer>
                    <FooterTab style={styles.footerTab}>
                        <Button vertical style={styles.activeTab}>
                            <Icon name="list" style={styles.activeTabIcon}/>
                            <Text style={styles.activeTabText}>List View</Text>
                        </Button>
                        <Image source={logoImage} style={styles.image} />
                        <Button vertical>
                            <Icon name="map" />
                            <Text>Map View</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
          );
    };
}

const styles = StyleSheet.create({
    content: {
        backgroundColor:'#05a5d10d',
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
    },
    footerTab: {
        backgroundColor:'#094c6b',
        //borderTopWidth: 3,
        //borderTopColor: '#000000',
    },
    activeTab: {
        //borderBottomWidth: 1,
        //borderBottomColor: '#f2f2f2',        
    },
    activeTabIcon: {
        color: '#ffffff'
    },
    activeTabText: {
        color: '#ffffff'
    }
  });

export default  Home;