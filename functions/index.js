// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const server = require('./src/server');
const api = functions.runWith({
        memory: '2GB',
        timeoutSeconds: 128
    })
    .https
    .onRequest(server);

module.exports = {
    api
};