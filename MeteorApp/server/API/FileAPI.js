if (Meteor.isServer) {

    // Global API configuration
    var Api = new Restivus({
        useDefaultAuth: false,
        prettyJson: true
    });

    Api.addRoute('serviceImage/:id', {authRequired: false}, {
        get: function () {
            try {
                console.log(this.urlParams.id,ServiceImage.findOne({_id: this.urlParams.id}).link())
                return JSON.parse(JSON.stringify(ServiceImage.findOne({_id: this.urlParams.id}).link()));
            }
            catch (e) {
                console.log(e.message)
            }
        },
        delete: {
            roleRequired: ['author', 'admin'],
            action: function () {
                if (ServiceImage.remove(this.urlParams.id)) {
                    return {status: 'success', data: {message: 'Article removed'}};
                }
                return {
                    statusCode: 404,
                    body: {status: 'fail', message: 'Article not found'}
                };
            }
        }
    });
    };