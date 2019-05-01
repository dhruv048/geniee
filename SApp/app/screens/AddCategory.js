import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import Autocomplete from 'native-base-autocomplete';
import {
    Container,
    Content,
    Text,
    Item,
    Input,
    ListItem,
    Textarea, CheckBox
} from 'native-base';
import Meteor, {createContainer} from "react-native-meteor";
import {colors} from "../config/styles";

class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            query: '',
            selectedCategory: null,
            title:'',
            homeDelivery:false,
        };

    }

    componentWillMount() {
        this.mounted = true;

    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _findCategory(query) {
        if (query === '') {
            return [];
        }

        const  categories  = this.props.categories;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return categories.filter(category => category.name.search(regex) >= 0);
    }

    _AddCategory=()=>{

        if(this.state.selectedCategory==null  && this.state.query.length>0){
            Meteor.call('addCategory',this.state.query,(err,res)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(res);
                }
            })
        }
    }

    render() {
        const { query, selectedCategory } = this.state;
        const categories = this._findCategory(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <Container style={styles.container}>
                <Content>
                    <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        data={categories.length === 1 && comp(query, categories[0].name)
                            ? [] : categories}
                        defaultValue={query}
                        hideResults={selectedCategory && selectedCategory.name === query}
                        onChangeText={text => this.setState({ query: text })}
                        placeholder="Enter Category's name"
                        renderItem={emp => <ListItem
                            onPress={() => (
                                this.setState({ query: emp.name, selectedCategory: emp })
                            )}
                        >
                            <Text>{emp.name} ({emp._id})</Text>
                        </ListItem>}
                    />
                    <View style={styles.descriptionContainer}>

                            <Text style={styles.titleText}>{this.state.query}</Text>
                        {/*<TextInput style={styles.inputBox}*/}
                                   {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                                   {/*placeholder='Title'*/}
                                   {/*placeholderTextColor='#ffffff'*/}
                                   {/*selectionColor='#ffffff'*/}
                                   {/*onSubmitEditing={() => this.title.focus()}*/}
                                   {/*onChangeText={(name) => this.setState({name})}*/}
                        {/*/>*/}
                        <Item regular>
                            <Input placeholder='Title'
                                   underlineColorAndroid='rgba(0,0,0,0)'
                                   onSubmitEditing={() => this.title.focus()}
                                   onChangeText={(title) => this.setState({title})}
                            />
                        </Item>
                        <Textarea rowSpan={5} bordered placeholder="Description"

                        // onSubmitEditing={() => this.contactNumber.focus()}
                        onChangeText={(description) => this.setState({description})}
                        />
                        <Item regular>
                        <Input  underlineColorAndroid='rgba(0,0,0,0)'
                                   placeholder='Radius in KiloMeter'
                                   keyboardType='phone-pad'
                                   onChangeText={(radius) => this.setState({radius})}
                        />
                        </Item>
                        {/*<Body>*/}
                        <Text>Home Delivery</Text>
                        {/*</Body>*/}
                        <CheckBox checked={this.state.homeDelivery} onPress={(homeDelivery) => this.setState({homeDelivery})} />
                    </View>
                    {/*<View style={{ height: 500, backgroundColor: 'transparent' }} />*/}
                    {/*<TextInput style={styles.inputBox}*/}
                               {/*underlineColorAndroid='rgba(0,0,0,0)'*/}
                               {/*placeholder='Title'*/}
                               {/*placeholderTextColor='#ffffff'*/}
                               {/*selectionColor='#ffffff'*/}
                               {/*onSubmitEditing={() => this.title.focus()}*/}
                               {/*onChangeText={(name) => this.setState({name})}*/}
                    {/*/>*/}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fcfdff',
        flex: 1,
        paddingTop: 25
    },
    itemText: {
        fontSize: 15,
        margin: 2,
        backgroundColor:'green',
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        marginTop: 10
    },
    infoText: {
        textAlign: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    directorText: {
        color: 'grey',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center'
    },
    openingText: {
        textAlign: 'center'
    },
    buttonContainer: { flex: 1, alignSelf: 'center', paddingTop: 20 },
    centerButton: { margin: 10, alignSelf: 'center' },

    inputBox: {
        width: 300,
        backgroundColor: colors.inputBackground,
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.whiteText,
        marginVertical: 5
    },
});
export default  createContainer(()=>{
    Meteor.subscribe('categories');
    return{
        categories:Meteor.collection('categories').find()
    }
},AddCategory);