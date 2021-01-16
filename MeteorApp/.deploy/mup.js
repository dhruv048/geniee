module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '139.59.59.117',
      username: 'geniee',
      pem: '~/.ssh/id_rsa',
      //password: '1ay04cs064'
    }
  },

  app: {
    // TODO: change app name and path
    name: 'Geniee',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
      server: 'https://139.59.59.117',
      executable: 'meteor'
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://139.59.59.117/',
      // MONGO_URL: 'mongodb://roshan:roshan123@cluster0-shard-00-00-wi05u.gcp.mongodb.net:27017,cluster0-shard-00-01-wi05u.gcp.mongodb.net:27017,cluster0-shard-00-02-wi05u.gcp.mongodb.net:27017/sapp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
      MONGO_URL: 'mongodb://localhost:27017/Geniee',
      //  MONGO_OPLOG_URL: 'mongodb://mongodb/local',
      PORT: 3000,
    },
    
    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      //image: 'abernix/meteord:base',
      image: 'abernix/meteord:node-12.16.1-base',
      prepareBundle: false,
      args: [
        //use network of host
        // '--network host' 
      ],
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
    deployCheckWaitTime: 180,

  },

  mongo: {
    version: '4.2.8',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
