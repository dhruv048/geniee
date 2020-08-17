import { Meteor } from 'meteor/meteor';
import {GRcategories} from '../../../lib/collections/genieeRepair/GRcategories';

Meteor.publish('allgrcategories',function(){
    return GRcategories.find()
});