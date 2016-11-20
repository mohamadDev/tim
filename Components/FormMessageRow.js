'use strict';

var utils = require('../utils/utils');
var translate = utils.translate
var ArticleView = require('./ArticleView');
var MessageView = require('./MessageView');
var NewResource = require('./NewResource');
var dateformat = require('dateformat')
var PhotoList = require('./PhotoList');
var Icon = require('react-native-vector-icons/Ionicons');
var constants = require('@tradle/constants');
var RowMixin = require('./RowMixin');
var equal = require('deep-equal')
import { makeResponsive } from 'react-native-orient'
var StyleSheet = require('../StyleSheet')

var reactMixin = require('react-mixin');

var STRUCTURED_MESSAGE_COLOR

import {
  // StyleSheet,
  Text,
  TouchableHighlight,
  Navigator,
  View
} from 'react-native'

import React, { Component } from 'react'

class FormMessageRow extends Component {
  constructor(props) {
    super(props);
    var resource = this.props.resource;
    var model = utils.getModel(resource[constants.TYPE] || resource.id).value;
    var me = utils.getMe();
    STRUCTURED_MESSAGE_COLOR = this.props.bankStyle.STRUCTURED_MESSAGE_COLOR
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props.resource, nextProps.resource) ||
           !equal(this.props.to, nextProps.to)             ||
           this.props.orientation != nextProps.orientation ||
           this.props.sendStatus !== nextProps.sendStatus
  }
  render() {
    var resource = this.props.resource;
    var model = utils.getModel(resource[constants.TYPE] || resource.id).value;

    var me = utils.getMe();

    var isMyMessage = this.isMyMessage();
    // var isVerifier = utils.isVerifier(resource)
    var to = this.props.to;
    var ownerPhoto = this.getOwnerPhoto(isMyMessage)
    let hasOwnerPhoto = !isMyMessage &&  to  &&  to.photos;

    var renderedRow = [];
    var ret = this.formatRow(isMyMessage, renderedRow);
    let onPressCall = ret ? ret.onPressCall : null

    var photoUrls = [];
    var photoListStyle = {height: 3};
    var addStyle, inRow;
    var noMessage = !resource.message  ||  !resource.message.length;
    if (!renderedRow.length) {
      var vCols = noMessage ? null : utils.getDisplayName(resource, model.properties);
      if (vCols)
        renderedRow = <Text style={styles.resourceTitle} numberOfLines={2}>{vCols}</Text>;
    }
    else {
      var fromHash = resource.from.id;
      if (isMyMessage) {
        if (!noMessage)
          addStyle = styles.myCell
      }
      else
        addStyle = [styles.verificationBody, {flex: 1, borderColor: '#efefef', backgroundColor: '#ffffff', borderTopLeftRadius: 0}];

      if (isMyMessage)
        addStyle = [addStyle, styles.verificationBody, {backgroundColor: STRUCTURED_MESSAGE_COLOR, borderColor: '#C1E3E8', borderTopRightRadius: 0}]; //model.style];
      // }
    }
    var properties = model.properties;
    var photoStyle = {}
    if (properties.photos  &&  resource.photos) {
      var len = resource.photos.length;
      inRow = len === 1 ? 1 : (len == 2 || len == 4) ? 2 : 3;
      var style;
      if (inRow === 1)
        photoStyle = styles.bigImage;
      else if (inRow === 2)
        photoStyle = styles.mediumImage;
      else
        photoStyle = styles.image;
      resource.photos.forEach((p) => {
        photoUrls.push({url: utils.getImageUri(p.url)});
      })

      photoListStyle = {
        flexDirection: 'row',
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        marginLeft: isMyMessage ? 30 : 45, //(hasOwnerPhoto ? 45 : 10),
        borderRadius: 10,
        marginBottom: 3,
        paddingRight: isMyMessage ? 10 : 0
      }
    }
    var rowStyle = [styles.row, {backgroundColor: this.props.bankStyle.BACKGROUND_COLOR}];
    var val = this.getTime(resource);
    var date = val
             ? <Text style={styles.date} numberOfLines={1}>{val}</Text>
             : <View />;

    var sendStatus = <View />
    if (this.props.sendStatus  &&  this.props.sendStatus !== null)
      sendStatus = this.getSendStatus()
    var sealedStatus = (resource.txId)
                     ? <View style={styles.sealedStatus}>
                         <Icon name={'ios-ribbon'} size={30} color='#316A99' style={{opacity: 0.5}} />
                       </View>
                     : <View />

    let cellStyle = addStyle
                  ? [styles.textContainer, addStyle]
                  : styles.textContainer
    // HACK that solves the case when the message is short and we don't want it to be displayed
    // in a bigger than needed bubble
    var messageBody;
    var width = utils.dimensions(FormMessageRow).width
    let msgWidth = Math.floor(width * 0.8)
    var viewStyle = {width: msgWidth, flexDirection: 'row', alignSelf: isMyMessage ? 'flex-end' : 'flex-start', paddingRight: isMyMessage ? 10 : 0};

    messageBody =
      <TouchableHighlight onPress={onPressCall ? onPressCall : () => {}} underlayColor='transparent'>
        <View style={[rowStyle, viewStyle]}>
          {ownerPhoto}
          <View style={cellStyle}>
            <View style={{flex: 1}}>
            {this.isShared()
              ? <View style={[styles.verifiedHeader, {backgroundColor: this.props.bankStyle.SHARED_WITH_BG}]}>
                  <Text style={styles.youSharedText}>{translate('youShared', resource.to.organization.title)}</Text>
                </View>
              : <View />
            }

              {renderedRow}
           </View>
           {sealedStatus}
          </View>
        </View>
      </TouchableHighlight>

    var len = photoUrls.length;
    var inRow = utils.isWeb()
              ? Math.floor(msgWidth / 145)
              : len === 1 ? 1 : (len == 2 || len == 4) ? 2 : 3;
    // var photoStyle = {};
    // var height;

    // if (!utils.isWeb()  &&  inRow > 0) {
    //   if (inRow === 1) {
    //     if (utils.isWeb())
    //       photoStyle = styles.bigImage
    //     else {
    //       var ww = Math.max(240, msgWidth / 2)
    //       var hh = ww * 280 / 240
    //       photoStyle = {
    //         width:  ww,
    //         height: hh,
    //         margin: 1,
    //         borderRadius: 10
    //       }
    //     }
    //   }
    //   else if (inRow === 2)
    //     photoStyle = styles.mediumImage;
    //   else
    //     photoStyle = styles.image;
    //   photoStyle = [photoStyle, {marginTop: '-5'}]
    // }

    return (
      <View style={{margin: 1, backgroundColor: this.props.bankStyle.BACKGROUND_COLOR}}>
        {date}
        {messageBody}
        <View style={photoListStyle}>
          <PhotoList photos={photoUrls} resource={this.props.resource} style={photoStyle} navigator={this.props.navigator} numberInRow={inRow} />
        </View>
        {sendStatus}
      </View>
    )
  }

  onPress(event) {
    this.props.navigator.push({
      id: 7,
      component: ArticleView,
      passProps: {url: this.props.resource.message}
    });
  }
  verify(event) {
    var resource = this.props.resource;
    var isVerification = resource[constants.TYPE] === constants.TYPES.VERIFICATION;
    var r = isVerification ? resource.document : resource

    var passProps = {
      resource: r,
      bankStyle: this.props.bankStyle,
      currency: this.props.currency
    }
    if (!isVerification)
      passProps.verify = true
    else
      passProps.verification = resource

    var model = utils.getModel(r[constants.TYPE]).value;
    var route = {
      id: 5,
      component: MessageView,
      backButtonTitle: 'Back',
      passProps: passProps,
      title: translate(model)
    }
    if (this.isMyMessage()) {
      route.rightButtonTitle = 'Edit'
      route.onRightButtonPress = {
        title: 'Edit',
        component: NewResource,
        // titleTextColor: '#7AAAC3',
        id: 4,
        passProps: {
          resource: r,
          metadata: model,
          bankStyle: this.props.bankStyle,
          currency: this.props.currency,
          callback: this.props.onSelect.bind(this, r)
        }
      };
    }
    this.props.navigator.push(route);
  }

  formatRow(isMyMessage, renderedRow) {
    var resource = this.props.resource;
    var model = utils.getModel(resource[constants.TYPE] || resource.id).value;

    var viewCols = model.gridCols || model.viewCols;
    if (!viewCols)
      return
    var first = true;
    var self = this;

    var properties = model.properties;
    var onPressCall;

    var self = this
    var vCols = [];
    viewCols.forEach(function(v) {
      if (properties[v].type === 'array')
        return;
      if (properties[v].ref) {
        if (resource[v]) {
          vCols.push(self.getPropRow(properties[v], resource, resource[v].title || resource[v]))
          first = false;
        }
        return;
      }
      var style = styles.resourceTitle
      if (isMyMessage)
        style = [style, styles.myMsg];

      if (resource[v]                      &&
          properties[v].type === 'string'  &&
          (resource[v].indexOf('http://') == 0  ||  resource[v].indexOf('https://') == 0)) {
        onPressCall = self.onPress.bind(self);
        vCols.push(<Text style={style} numberOfLines={first ? 2 : 1} key={self.getNextKey()}>{resource[v]}</Text>);
      }
      else if (!model.autoCreate) {
        let val
        if (properties[v].type === 'date')
          // val = dateformat(new Date(resource[v]), 'mmm d, yyyy')

          val = resource[v] ? dateformat(new Date(resource[v]), 'mmm d, yyyy') : null

        else
           val = (properties[v].displayAs)
                ? utils.templateIt(properties[v], resource)
                : properties[v].type === 'boolean' ? (resource[v] ? 'Yes' : 'No') : resource[v];

        if (!val)
          return
        if (model.properties.verifications  &&  !isMyMessage && !utils.isVerifier(resource))
          onPressCall = self.verify.bind(self);
        if (!isMyMessage)
          style = [style, {paddingBottom: 10, color: '#2892C6'}];
        vCols.push(self.getPropRow(properties[v], resource, val))
      }
      else {
        if (!resource[v]  ||  !resource[v].length)
          return
        vCols.push(<Text style={style} key={self.getNextKey()}>{resource[v]}</Text>);
      }
      first = false;

    });
    let title = translate(model)
    if (title.length > 30)
      title = title.substring(0, 27) + '...'

    vCols.push(<Text style={[styles.resourceTitle, styles.formType, {color: isMyMessage ? '#EBFCFF' : this.props.bankStyle.STRUCTURED_MESSAGE_BORDER}]} key={this.getNextKey()}>{title}</Text>);

    if (vCols  &&  vCols.length) {
      vCols.forEach(function(v) {
        renderedRow.push(v);
      })
    }
    if (onPressCall)
      return {onPressCall: onPressCall}
    return {onPressCall: this.props.onSelect.bind(this, resource, null)}
  }
}

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  resourceTitle: {
    // flex: 1,
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 2,
  },
  date: {
    flex: 1,
    color: '#999999',
    fontSize: 12,
    alignSelf: 'center',
    paddingTop: 10
  },
  row: {
    // alignItems: 'center',
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
  },
  myCell: {
    paddingVertical: 5,
    // borderTopRightRadius: 0,
    paddingHorizontal: 7,
    justifyContent: 'flex-end',
    borderRadius: 10,
    backgroundColor: '#77ADFC' //#569bff',
  },
  bigImage: {
    width: 240,
    height: 280,
    margin: 1,
    borderRadius: 10
  },
  bigImageH: {
    width: 270,
    height: 200,
    margin: 1,
    borderRadius: 10
  },
  mediumImage: {
    width: 120,
    height: 120,
    margin: 1,
    borderRadius: 10
  },
  image: {
    width: 88,
    height: 88,
    margin: 1,
    borderRadius: 10
  },
  formType: {
    color: '#EBFCFF',
    fontSize: 18,
    // fontWeight: '600',
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginTop: 10
  },
  verifiedHeader: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 7,
    marginHorizontal: -8,
    marginTop: -6,
    justifyContent: 'center'
  },
  sendStatus: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: -5
  },
  sealedStatus: {
    // alignSelf: 'flex-end',
    // flexDirection: 'row',
    position: 'absolute',
    bottom: 1,
    left: 10,
  },
  verificationBody: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 2
  },
  myMsg: {
    justifyContent: 'flex-end',
    color: '#ffffff'
  },
  youSharedText: {
    color: '#ffffff',
    fontSize: 18
  }
});
reactMixin(FormMessageRow.prototype, RowMixin);
FormMessageRow = makeResponsive(FormMessageRow)

module.exports = FormMessageRow;
