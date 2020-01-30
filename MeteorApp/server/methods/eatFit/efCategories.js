import {Meteor} from 'meteor/meteor';
import {EFCategories} from '../../../lib/collections/eatFit/efCategories';

Meteor.methods({
    'addNewEFCategory': (category) => {
        category.createdAt = new Date(new Date().toUTCString);
        return  EFCategories.insert(category)
    },

    'removeEFCategory': (id) => {
        EFCategories.remove(id);
    }
});