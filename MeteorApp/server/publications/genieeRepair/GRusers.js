import { Meteor } from 'meteor/meteor';
import {GRusers} from '../../../lib/collections/genieeRepair/GRusers';

Meteor.publish('allGRusers',function(){
    return GRusers.find()
});