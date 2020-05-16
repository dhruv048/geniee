import React, {Component} from 'react';
import {
    Container,
    Header,
    Left,
    Body,
    Right,
    Content,
    Button, Title, StyleProvider, Text
} from 'native-base';
import Moment from 'moment';
import {
    FlatList, ToastAndroid, View
} from 'react-native';
import {colors, customStyle} from "../../config/styles";
import Meteor from '../../react-native-meteor';
import settings, {getProfileImage} from "../../config/settings";
import Icon from 'react-native-vector-icons/Feather';
import CommentBlock from "../../components/Comment/CommentBlock";
import {goBack} from "../../Navigation";
import Loading from "../../components/Loading/Loading";


export default class ServiceRatings extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.subsHandle = '';
        this.state = {
            Comment: '',
            height: 40,
            totalCount: 0,
            ratings:null,
            loading:false,
        }
        this.skip = 0;
        this.subsHandle = null;
        this.subsHandle1 = null;
    }

    componentDidMount() {
       Meteor.call('getRatings', this.props.Id,this.skip, (err,res)=>{
           if(!err){
               this.setState({ratings:res.result});
               this.skip = this.skip + 20;
           }
       });

    }

    componentWillUnmount() {
        if (this.subsHandle)
            this.subsHandle.stop();
        if (this.subsHandle1)
            this.subsHandle1.stop();
    }


    componentWillReceiveProps(newProps) {
    }

    _handleEndReach = () => {
        if(!this.state.loading) {
            this.setState({loading:true});
            Meteor.call('getRatings', this.props.Id, this.skip, (err, res) => {
                if (!err) {
                    let totalRatings = this.state.ratings.concat(res.result);
                    this.setState({ratings: totalRatings});
                    this.skip = this.skip + 20;
                    this.setState({loading:false});
                }
            });
        }
    }
    _getListItem = (data, index) => {
        var Rating = data.item;
        // console.log(Comment);
        return (
            <CommentBlock
                source={Rating.RatedBy.profile.profileImage ? {uri:getProfileImage(Rating.RatedBy.profile.profileImage)} : require("../../images/duser.png")}
                name={Rating.RatedBy.profile.name}
                rating={Rating.rating.count}
                Comment={Rating.rating.comment}
                CommentDate={Moment(Rating.rateDate).fromNow()}
            />
        )
    };

    render() {
        console.log(this.state.totalCount, Meteor.userId())
        return (
                <Container style={{backgroundColor: colors.appBackground, flex: 1}}>
                    <Header androidStatusBarColor={colors.statusBar}
                            style={{backgroundColor: colors.appLayout}}>
                        <Left>
                            <Button transparent onPress={() => {
                                goBack(this.props.componentId)
                            }}>
                                <Icon name='arrow-left' size={24} color='#fff'/>
                            </Button>

                        </Left>
                        <Body>
                        <Title>Ratings</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Content padder>
                        {this.state.ratings && this.state.ratings.length > 0 ?
                            <FlatList
                                data={this.state.ratings}
                                renderItem={this._getListItem}
                                KeyExtractor={(item, index) => item._id}
                                horizontal={false}
                                onEndReached={this._handleEndReach}
                                onEndReachedThreshold={0.2}
                            >
                            </FlatList>
                            : null}
                        {this.state.ratings && this.state.ratings.length < 1 ?<View style={customStyle.noList}>
                                <Text style={customStyle.noListTextColor}>No reviews available right now.</Text>
                            </View>:null}
                        {!this.state.ratings?
                        <Loading/>:null}
                    </Content>
                </Container>
        );
    };
}



//
// export default Meteor.withTracker((props) => {
//     return {
//        // Ratings: Meteor.collection('profileRatinsDetail').find(),
//         Count: Meteor.collection('profileRateCount').find({})
//     }
// })(ServiceRatings);