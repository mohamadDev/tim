console.log('requiring TourPage.js')
import React, { Component, PropTypes } from 'react'
import {
  WebView,
  View,
  StatusBar
} from 'react-native'
import AppIntro from 'react-native-app-intro'
import utils from '../utils/utils'

import { makeResponsive } from 'react-native-orient'

class TourPage extends Component {
  props: {
    navigator: PropTypes.object.isRequired,
    tour: PropTypes.string.isRequired,
    callback: PropTypes.func,
  };
  render() {
    let {pages, doneBtnLabel, skipBtnLabel, nextBtnLabel, dotColor, activeDotColor, leftTextColor, rightTextColor} = this.props.tour
    if (!pages)
      return <View/>
    StatusBar.setHidden(true)
    let {width, height} = utils.dimensions(TourPage)
    let tpages = []
    if (pages)
      tpages = pages.map((p, i) => (
         <WebView style={{width, height}} key={'tour_' + i}
                 source={{uri: p}}
                 startInLoadingState={true}
                 automaticallyAdjustContentInsets={false} />
      ))

    return (
      <AppIntro
        onNextBtnClick={this.nextBtnHandle}
        onDoneBtnClick={this.doneBtnHandle}
        onSkipBtnClick={this.onSkipBtnHandle}
        onSlideChange={this.onSlideChangeHandle}
        dotColor={dotColor || '#eeeeee'}
        activeDotColor={activeDotColor || '#ffffff'}
        rightTextColor={rightTextColor || '#ffffff'}
        leftTextColor={leftTextColor || '#ffffff'}
      >
        {tpages}
      </AppIntro>
    )
  }
  onSkipBtnHandle = (index) => this.action();
  doneBtnHandle = () => this.action();

  action() {
    let { callback, navigator, noTransitions } = this.props
    if (!utils.isWeb()  &&  !noTransitions)
      navigator.pop()
    if (callback)
      callback()
    StatusBar.setHidden(false)
  }

  nextBtnHandle = (index) => {
    console.log(index);
  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }
}

module.exports = makeResponsive(TourPage)
