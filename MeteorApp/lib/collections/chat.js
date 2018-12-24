import {Mongo} from 'meteor/mongo';

ChatChannel = new Mongo.Collection('chatChannels');

ChatItem= new Mongo.Collection('chatItems');