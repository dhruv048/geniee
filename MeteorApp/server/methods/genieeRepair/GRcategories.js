import {Meteor} from 'meteor/meteor';
import {GRcategories} from '../../../lib/collections/genieeRepair/GRcategories';

Meteor.methods({
    'addNewGRCategory': (category) => {
        category.createdAt = new Date(new Date().toUTCString);
        return  GRcategories.insert(category)
    },

    'removeGRCategory': (id) => {
        GRcategories.remove(id);
    }
});