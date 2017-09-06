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
            appObj.run('urn:x-cast:com.google.cast.demo.tictactoe', (sessionErr, sessionObj) => {
              if (!sessionErr) {
                console.log('Got a YouTube session', util.inspect(sessionObj));
              } else {
                console.log('Unable to create a YouTube session', sessionErr);
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
            //TODO: appObj.run or appObj.join
            // appObj.join('urn:x-cast:com.google.cast.demo.tictactoe', ...)
            appObj.join('urn:x-cast:com.haystack.android', (sessionErr, sessionObj) => {
              if (!sessionErr) {
                console.log('Joined a Haystack session', util.inspect(sessionObj));
                sessionObj.send({ data: 'hello' }, (messageErr, messageResponse) => {
                  if (!messageErr) {
                    console.log('Got an answer!', util.inspect(messageResponse));
                  } else {
                    console.log('Unable to send message:', messageErr);
                  }
                });
              } else {
                console.log('Unable to join a Haystack session', sessionErr);
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

main();


/* vim: set ts=2 sw=2 sta sts=2 sr et: */
