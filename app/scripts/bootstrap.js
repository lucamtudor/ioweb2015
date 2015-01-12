/**
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

IOWA.Router.init();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', {
    scope: './'
  }).then(function(registration) {
    // TODO (jeffposnick): This logic needs to change. Take into account whether the page is
    // currently controlled when showing a message, for instance.
    var newServiceWorkerAvailableMessage =
        'A new version of this page is available. Please force-refresh.';

    // If this fires we should check if there's a new Service Worker
    // waiting to be activated. If so, ask the user to force refresh.
    if (registration.waiting) {
      IOWA.Elements.Toast.showMessage(newServiceWorkerAvailableMessage);
      return;
    }

    // We should also start tracking for any updates to the Service Worker.
    registration.onupdatefound = function(event) {

      IOWA.Elements.Toast.showMessage(
          'A new version has been found... Installing...');

      // If an update is found the spec says that there is a new Service Worker
      // installing, so we should wait for that to complete then show a
      // notification to the user.
      registration.installing.onstatechange = function(event) {
        if (this.state === 'installed')
          IOWA.Elements.Toast.showMessage(newServiceWorkerAvailableMessage);
        else
          console.log("New Service Worker state: ", this.state);
      };
    };
  }, function(e) {
    IOWA.Analytics.trackError('navigator.serviceWorker.register() rejection', e);
    console.error('Service worker registration failed:', e);
  });
}

IOWA.Elements.init();
IOWA.Router.init();
