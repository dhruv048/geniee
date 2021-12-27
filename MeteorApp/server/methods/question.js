import {Question} from "../../lib/collections/question";
import {Meteor} from 'meteor/meteor';
import { NotificationTypes } from "../../lib/utils";

Meteor.methods({
    AddQuestionByUser(productId, question) {
        let loggedUser = Meteor.user();
        // console.log(doctorId, data)
        if(question === ""){
            throw new Meteor.Error(403, 'Please add your questions');
        }
        try {
            let Id = Question.insert({
                question: question,
                questionedDate: new Date(new Date().toUTCString()),
                owner: loggedUser._id,
                productId: productId,
                answer: '',
                answerDate: '',
                answerBy: '',
                likesCount: 0,
                viewsCount: 0
            })
            if (Id) {
                let notification = {
                    title: 'Ask question by ' + loggedUser.profile.name,
                    description: question,
                    owner: loggedUser._id,
                    navigateId: Id,
                    receiver: [productId],
                    type: NotificationTypes.ASK_QUESTION
                }
                Meteor.call('addNotification', notification);
                //TO DO:- Push Notification
            }
        }
        catch (e) {
            console.log('This is error:', e.message);
            throw new Meteor.Error(403, e.message);
        }
    },

    'UpdateAnswerByProductOwner': (questionId, answer) => {
        let question = Question.findOne({_id: questionId});
        let loggedUser = Meteor.user();
        if (question) {
            Question.update({_id: questionId},
                {
                    $set: {
                        'answer': answer,
                        'answerDate': new Date(new Date().toUTCString()),
                        'answerBy': loggedUser._id
                    }
                });
            let notification = {
                title: ' Answer by ' + loggedUser.profile.name,
                description: answer,
                owner: loggedUser._id,
                navigateId: questionId,
                receiver: [question.Owner],
                type: NotificationTypes.ANSWER_QUESTION
            }
            Meteor.call('addNotification', notification);
        }
    },

    'getTopQuestion': (productId) => {
        const _skip = 0;
        const _limit = 5;
        const loggedUser = Meteor.userId();
        const collection = Question.rawCollection();
        const aggregate = Meteor.wrapAsync(collection.aggregate, collection);
        let match = {};
        if (!productId) {
            match = {productId: productId}
        }
        const pipeline = [
            {$match: match},
            {$sort: {questionedDate: -1}},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "User"
                }
            },
            {
                $lookup: {
                    from: "business",
                    localField: "productOwner",
                    foreignField: "answerBy",
                    as: "Owners"
                }
            },
            {$sort: {likesCount: -1}},
            // {$sort: {"profile.views": -1}},
            {$limit: _skip + _limit},
            {$skip: _skip},
        ];
        return Async.runSync(function (done) {
            aggregate(pipeline, {cursor: {}}).toArray(function (err, doc) {
                if (doc) {
                    // console.log(doc)
                }
                done(err, doc);
            });
        });
    },

})