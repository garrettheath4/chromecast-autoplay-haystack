'use strict';

const util = require('util');
const nodecastor = require('nodecastor');

function main() {
  nodecastor.scan()
    .on('online', device => {
      if (device.friendlyName == 'Catalist Kitchen') {
        console.log('Found Catalist Kitchen device!');
        device.on('connect', () => {
          launchHaystack(device);
        })
        .on('status', status => {
          console.log('Chromecast status updated', util.inspect(status))
        });
      } else {
        console.log('New device', util.inspect(device));
      }
    })
    .on('offline', device => {
      console.log('Removed device', util.inspect(device));
    })
    .start();
}

function launchYouTube(connectedDevice) {
  connectedDevice.status((statusErr, statusData) => {
    if (!statusErr) {
      console.log('Chromecast status', util.inspect(statusData));
      //TODO: change to if(statusData.applications[0].isIdleScreen)
      if (true) {
        connectedDevice.application('YouTube', (appErr, appObj) => {
          if (!appErr) {
            console.log('YouTube application', util.inspect(appObj));
            appObj.run('urn:x-cast:com.google.cast.demo.tictactoe', (sessionJoinErr, sessionObj) => {
              if (!sessionJoinErr) {
                console.log('Got a YouTube session', util.inspect(sessionObj));
              } else {
                console.log('Unable to create a YouTube session', sessionJoinErr);
              }
            });
          } else {
            console.log('Error while fetching YouTube application', appErr);
          }
        });
      } else {
        console.log('Chomecast is not idle, so will not launch YouTube app');
      }
    }
  });
}

function launchHaystack(connectedDevice) {
  // displayName: 'Haystack TV', appId: '898AF734'
  connectedDevice.status((statusErr, statusData) => {
    if (!statusErr) {
      console.log('Chromecast status', util.inspect(statusData));
      //TODO: change to if(statusData.applications[0].isIdleScreen)
      if (true) {
        connectedDevice.application('898AF734', (appErr, appObj) => {
          if (!appErr) {
            console.log('Haystack application', util.inspect(appObj));
            // appObj.join('urn:x-cast:com.google.cast.demo.tictactoe', ...)
            // join session if one already exists
            //TODO: use 'urn:x-cast:com.haystack.android' or 'urn:x-cast:com.google.cast.media'?
            appObj.join('urn:x-cast:com.google.cast.media', (sessionJoinErr, sessionJoinObj) => {
              if (!sessionJoinErr) {
                console.log('Joined a Haystack session', util.inspect(sessionJoinObj));
                sendHaystackPlay(sessionJoinObj);
              } else {
                // fallback: run session instead of join
                appObj.run('urn:x-cast:com.google.cast.media', (sessionRunErr, sessionRunObj) => {
                  if (!sessionRunErr) {
                    console.log('Created a Haystack session', util.inspect(sessionRunObj));
                    sendHaystackPlay(sessionRunObj);
                  } else {
                    console.log('Unable to join or create a Haystack session', sessionRunErr);
                  }
                });
              }
            });
          } else {
            console.log('Error while fetching Haystack application', appErr);
          }
        });
      } else {
        console.log('Chomecast is not idle, so will not launch Haystack app');
      }
    }
  });
}

function sendHaystackPlay(sessionObj) {
  var playMessage = {
    type: "message",
    Aa: !1,
    defaultPrevented: !1,
    bd: !0,
    senderId: "7d2430ae-db4d-efbd-b250-b11d491f9832.249:sender-0",
    data: '{"currentTime": 0, "customData": {"platform": "google cast"}, "requestId": 5, "type": "GET_STATUS", "autoplay": true}'
  };
  sessionObj.send(playMessage, (messageErr, messageResponse) => {
    if (!messageErr) {
      console.log('Got an answer!', util.inspect(messageResponse));
    } else {
      console.log('Unable to send message', messageErr);
    }
  });
  s.on('message', data => {
      console.log('Got an unexpected message', util.inspect(data));
  });
}

main();


/* vim: set ts=2 sw=2 sta sts=2 sr et: */
