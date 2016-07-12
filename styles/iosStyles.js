'use strict';

import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    marginTop: 64,
    flex: 1,
  },
  navBarText: {
    marginTop: 10,
    fontSize: 17
  },
  // navBar: {
  //   marginTop: 10,
  //   padding: 3
  // },
  menuButtonNarrow: {
    marginTop: -23,
    paddingVertical: 5,
    paddingHorizontal: 21,
    height: 45,
    borderRadius: 24,
    // shadowOffset:{width: 5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: '#afafaf',
    backgroundColor: 'red'
  },
  menuButtonRegular: {
    marginTop: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 24,
    // shadowOffset:{width: 5, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: '#afafaf',
    backgroundColor: 'red'
  },
})
var menuIcon = {
  name: 'md-more',
  color: '#ffffff'
}
exports.MenuIconIOS = menuIcon
// Object.defineProperty(exports, 'MB', {
//   icon: 'md-more',
//   color: '#ffffff'
// })