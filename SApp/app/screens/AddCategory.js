import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import Autocomplete from 'native-base-autocomplete';
import {
    Container,
    Content,
    Text,
    Button,
    ListItem
} from 'native-base';
import Meteor, {createContainer} from "react-native-meteor";

class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            query: '',
            selectedCategory: null
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

                    <View  style={styles.buttonContainer}>
                        <Button style={styles.centerButton} onPress={this._AddCategory} success={true} ><Text> Save </Text></Button>
                    </View>
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
                    </View>
                    <View style={{ height: 500, backgroundColor: 'transparent' }} />
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
    centerButton: { margin: 10, alignSelf: 'center' }
});
export default  createContainer(()=>{
    Meteor.subscribe('categories');
    return{
        categories:Meteor.collection('categories').find()
    }
},AddCategory);