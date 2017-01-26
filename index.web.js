// if (window.history && !localStorage._tradleTimeTraveled) {
//   if (history.length > 2) {
//     localStorage.setItem('_tradleTimeTraveled', 'y')
//     history.go(-(history.length - 2))
//   }
// }

// localStorage.removeItem('_tradleTimeTraveled')

// if we wake up on a non-zero route, go back to route 0
//
// will not be necessary when we switch to redux and save all state including history
// and get our bearings from the url

import {
  isFF,
  isSafari,
  isIE,
  isFFPrivateBrowsing
} from './utils/browser'

if (global.history && global.history.length) {
  const historyIndex = parseInt(location.hash.replace('#/scene_', ''))
  if (historyIndex) {
    history.go(-historyIndex)
  }
}

const Alert = require('./web/shims/Alert')
require('react-native').Alert = Alert
require('./css/customicons.css')
require('./css/ionicons.min.css')
require('./css/styles.css')

testEnvironment().then(init, alertError)

function ensureOneTab () {
  const isOnlyTab = require('onetab')
  isOnlyTab.timeout = 5000
  isOnlyTab(function (err, yes) {
    if (err || !yes) {
      return alertError('This application is open in another tab. Please close one of the two tabs and refresh the page.')
    }
  })
}

function init () {
  ensureOneTab()
  if (!console.table) console.table = console.log

  require('whatwg-fetch')
  require('./web/shims/deviceEventEmitter')
  require('./web/shims/orientation')
  require('./index.common')

  const AppRegistry = require('react-native').AppRegistry
  const app = document.createElement('div')
  document.body.appendChild(app)
  AppRegistry.runApplication('Tradle', {
    rootTag: app
  })

  setTimeout(function () {
    const splash = document.getElementById('splashscreen')
    splash.parentNode.removeChild(splash)
  }, 500)
}

async function testEnvironment () {
  if (isSafari) return

  if (isIE && !window.indexedDB) {
    throw new Error('This application cannot be used in InPrivate Browsing mode, due to storage and security limitations')
  }

  if (!window.indexedDB) {
    throw new Error('This application is not supported in this browser. Please use Chrome, Safari, Firefox or IE11+')
  }

  if (isFF) {
    let isPrivateBrowsing
    try {
      isPrivateBrowsing = await isFFPrivateBrowsing()
    } catch (err) {
      throw new Error('Something has gone wrong. Please refresh.')
    }

    if (isPrivateBrowsing) {
      throw new Error('This application cannot be used in Private Browsing mode, due to storage and security limitations')
    }
  }
}

function alertError (err) {
  if (err.message) err = err.message

  const rootEl = document.createElement('div')
  rootEl.className = 'react-root'
  document.body.appendChild(rootEl)
  Alert.alert('Oh no!', err, [])
}
