
Template.dashboard.onRendered(()=>{
    Meteor.subscribe('all_users');
    Meteor.subscribe('all_products');
});

Template.dashboard.helpers({
    users: () => {
        console.log(Counts.get('usersCount'))
        return Counts.get('usersCount');
    },
    products: () => {
        console.log(Counts.get("productsCount"))
        return Counts.get("productsCount");
    },
    // QA: () => {
    //     console.log(Counts.get("QACount"))
    //     return Counts.get("QACount");
    // },
});

