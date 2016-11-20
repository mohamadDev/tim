'use strict';

import React, { Component } from 'react'
import {
  ListView,
  // StyleSheet,
  PropTypes,
  TouchableHighlight,
  View,
  Platform,
  Text
} from 'react-native'
// const SearchBar = Platform.OS === 'android' ? null : require('react-native-search-bar')
const SearchBar = Platform.OS !== 'ios' ? null : require('react-native-search-bar')
var translate = require('../utils/utils').translate
var StyleSheet = require('../StyleSheet')

class EnumList extends Component {
  props: {
    navigator: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    returnRoute: PropTypes.object,
    callback: PropTypes.func,
    prop: PropTypes.object.isRequired,
    enumProp: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource({
      rowHasChanged: function(row1, row2) {
        return row1 !== row2
      }
    })
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.enumProp.oneOf),
      filter: ''
    }
  }

  selectResource(resource) {
    this.props.callback(this.props.prop.name, this.props.enumProp.name, resource); // HACK for now
    this.props.navigator.popToRoute(this.props.returnRoute);
    return;
  }
  render() {
    var content = <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          automaticallyAdjustContentInsets={false}
          removeClippedSubviews={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={true}
          initialListSize={10}
          pageSize={20}
          scrollRenderAhead={10}
          showsVerticalScrollIndicator={false} />;
    var searchBar
    if (SearchBar) {
      searchBar = (
        <SearchBar
          onChangeText={this.onSearchChange.bind(this)}
          placeholder={translate('search')}
          showsCancelButton={false}
          hideBackground={true}
          />
      )
    }

    return (
      <View style={styles.container}>
        {searchBar}
        <View style={styles.separator} />
        {content}
      </View>
    );
  }
  onSearchChange(filter) {
    let vals = this.props.enumProp.oneOf
    let list = vals.filter((s) => {
      return Object.keys(s)[0].indexOf(filter) === -1 ? false : true
    })
    this.setState({filter: filter, dataSource: this.state.dataSource.cloneWithRows(list)})
  }

  renderRow(value) {
    var label
    if (typeof value === 'object') {
      var key = Object.keys(value)[0]
      label = key + ' ' + value[key]
    }
    else
      label = value

    return (
      <View style={{padding: 5}}>
        <TouchableHighlight underlayColor='transparent' onPress={this.selectResource.bind(this, value)}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.resourceTitle}>{label}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 64
  },
  resourceTitle: {
    fontSize: 20
  },
  separator: {
    height: 0.5,
    backgroundColor: '#eeeeee',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
});

module.exports = EnumList;