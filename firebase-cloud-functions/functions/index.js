/* eslint-disable consistent-return */

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');


const messagingTopic = 'nyc-events';

admin.initializeApp();

/*
 * Takes the text parameter passed to this HTTP endpoint and insert it into the
 * Realtime Database under the path /messages/:pushId/original
 */
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grabs the text parameter.
  const original = req.query.text;

  // Pushes the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/messages').push({ original })
    .then((snapshot) => {
      // Redirects with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      res.redirect(303, snapshot.ref);
    });
});

/*
 * Listens for new messages added to /messages/:pushId/original and creates an
 * uppercase version of the message to /messages/:pushId/uppercase
 */
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();

    console.log('Uppercasing', context.params.pushId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('uppercase').set(uppercase);
  });

//exports.makeUppercase = functions.database.ref('/messages/{pushId}/original').onWrite((event) => {
//  const currentEventSnapshot = event;
//  const previousEventSnapShot = currentEventSnapshot.previous;
//
//  // Edits data only when it is first created.
//  if (previousEventSnapShot.exists()) {
//    return;
//  }
//
//  // Exits when the data is deleted.
//  if (!currentEventSnapshot.exists()) {
//    return;
//  }
//
//  // Grabs the current value of what was written to the Realtime Database.
//  const original = currentEventSnapshot.val();
//  const uppercase = original.toUpperCase();
//
//  console.log(`Uppercasing ${original} in ${event.params.pushId} to ${uppercase}`);
//
//  /*
//   * You must return a Promise when performing asynchronous tasks inside a Functions such as
//   * writing to the Firebase Realtime Database.
//   * Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//   */
//  return currentEventSnapshot.ref.parent.child('uppercase').set(uppercase);
//});

exports.sendPushNotification = functions.https.onRequest((req, res) => {
  const title = req.query.title || 'LocalDetour';
  const body = req.query.content;

  if (!body) return res.status(400)
    .send('Please include content parameter in your query string.<br /><br />Here is the ' +
      'sample URL:<br />https://us-central1-spiritual-guide-476dd.cloudfunctions.net/' +
      'sendPushNotification?title=LocalDetour&content=Five+events+are+coming+up+this+weekend');

  const notification = {
    title,
    body,
    //badge: '1',
  };

  admin.messaging()
    .sendToTopic(messagingTopic, { notification })
    .then(() => {
      res.sendStatus(200);
    });
});

exports.sendEventPushNotification = functions.database.ref('/nyc/events/{eventId}').onCreate((snapshot, context) => {
  const notification = {
    title: 'LocalDetour',
    body: `Check out the new event:\n${snapshot.val().name || 'N/A'}`,
    //badge: '1',
  };

  console.log(`Sending push notification: ${JSON.stringify(notification, null, 2)} to ${messagingTopic}`);

  return admin.messaging()
    .sendToTopic(messagingTopic, { notification }, { priority: 'high' });
});

//exports.sendEventPushNotification = functions.database.ref('/nyc/events/{eventId}').onWrite((event) => {
//  const currentEventSnapshot = event;
//  const previousEventSnapShot = currentEventSnapshot.previous;
//
//  // Exits when the event is deleted.
//  if (!currentEventSnapshot.exists()) {
//    return;
//  }
//
//  // Sends new event push notification when the event is first created.
//  if (!previousEventSnapShot.exists()) {
//    const notification = {
//      title: 'LocalDetour',
//      body: `Check out the new event:\n${currentEventSnapshot.val().name || 'N/A'}`,
//      //badge: '1', /// TODO
//    };
//
//    console.log(`Sending push notification: ${JSON.stringify(notification, null, 2)} to ${messagingTopic}`);
//
//    return admin.messaging()
//      .sendToTopic(messagingTopic, { notification });
//  }
//
//  // Sends event update push notification when the event is updated.
//  if (currentEventSnapshot.changed()) {
//    const notification = {
//      title: 'LocalDetour',
//      body: `Check out the new information for ${currentEventSnapshot.val().name || 'N/A'}.`,
//      //badge: '1', /// TODO
//    };
//
//    //console.log(`Sending push notification: ${JSON.stringify(notification, null, 2)} to ${messagingTopic}`);
//
//    //return admin.messaging()
//    //  .sendToTopic(messagingTopic, { notification });
//  }
//});
