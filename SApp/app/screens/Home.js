import React, { Component } from 'react';

import { Container, Header, Left, Body, Title, Subtitle, Right, Content, List, ListItem, Thumbnail, Footer, FooterTab, Button, Icon, Text, Item, Input, Drawer } from 'native-base';

import {StyleSheet, Image, StatusBar, TouchableWithoutFeedback, Keyboard} from 'react-native';

import Sidebar from '../components/MenuNav/MenuNav';

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
    
    closeDrawer(){ this.drawer._root.close(); }
    openDrawer(){ this.drawer._root.open(); }

    render() {

        return (
            
            <Drawer ref={(ref) => { this.drawer = ref; }} content={<Sidebar navigator={this.navigator} />} onClose={() => this.closeDrawer()} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <Container>
                
                    <Header style={{backgroundColor:'#094c6b'}}>
                        {/*<Left>
                            <Button transparent>
                                <Icon name="cog" />
                            </Button>                        
                        </Left>*/} 
                        <Body>
                        <Item><Input placeholder="Search" style={styles.searchInput}
                                placeholderTextColor='#ffffff'
                                selectionColor='#ffffff'
                                underlineColorAndroid="transparent"
                            />
                            <Button transparent><Icon style={styles.activeTabIcon} name='search' /></Button>    

                            <Button transparent onPress={()=>this.openDrawer()}>
                                <Icon name='more' style={styles.activeTabIcon}/>
                            </Button>
                        </Item>
                        
                        </Body>
                        {/*<Right>                            
                            <Button transparent onPress={()=>this.openDrawer()}>
                                <Icon name='more' />
                            </Button>
                        </Right>    */}                    
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
                </TouchableWithoutFeedback>
            </Drawer>
            
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
    },
    searchInput: {
        //borderBottomWidth: 3,
        //borderBottomColor: '#000000',
        color: '#ffffff',
        //backgroundColor: '#898e907a',
        height: 40,
        width: 300,
        paddingHorizontal: 16,
        borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
    }
});

export default  Home;