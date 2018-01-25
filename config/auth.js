var firebase = require("firebase");

module.exports = {
    'facebookAuth': {
        'clientID'      : '2015619465174832', // your App ID
        'clientSecret'  : 'f6bd946ee9f12a23e53bb3d311b28385', // your App Secret
        'callbackURL'   : 'http://localhost:4000/auth/facebook/callback',
    }
    
}

var config = {
    apiKey: "AIzaSyDpWBsC1yFclyszgUvpxPvWDMgKb06WdNM",
    authDomain: "avian-concord-176102.firebaseapp.com",
    databaseURL: "https://avian-concord-176102.firebaseio.com",
    projectId: "avian-concord-176102",
    storageBucket: "",
    messagingSenderId: "310905343528"
  };
  firebase.initializeApp(config);
