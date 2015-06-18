'use strict';
 
var React = require('react-native');
var t = require('tcomb-form-native');
var utils = require('../utils/utils');
var logError = require('logError');
var groupByEveryN = require('groupByEveryN');
var Icon = require('FAKIconImage');

var Form = t.form.Form;

var {
  StyleSheet,
  View,
  Image,
  Text,
  CameraRoll,
  ListView,
  Component,
  TouchableHighlight,
} = React;

class SelectPhotoList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
    this.state = {
      assets: [],
      batchSize: 30,
      groupTypes: 'All',
      lastCursor: null,
      selected: {},
      noMore: false,
      imagesPerRow: this.props.imagesPerRow || 3,
      loadingMore: false,
      dataSource: dataSource,
    };
  }
  componentDidMount() {
    this.fetch();
  }
  fetch(clear) {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, () => { this.fetchAssets(clear); });
    }
  }

  render() {
    if (this.props.metadata.name !== 'photos')
      return false;
    return (
      <View style={{flex: 1}}>
      <ListView
        renderRow={this.renderRow.bind(this)}
        style={styles.photoContainer}
        dataSource={this.state.dataSource}
        onEndReached={this.onEndReached.bind(this)} />
      </View>
    );
  }
  fetchAssets(clear) {
    if (clear) {
      this.fetch();
      this.setState(this.state, this.fetch);
      return;
    }

    var fetchParams: Object = {
      first: this.state.batchSize,
      groupTypes: 'All'
    };
    if (this.state.lastCursor) 
      fetchParams.after = this.state.lastCursor;

    CameraRoll.getPhotos(fetchParams, this._appendAssets.bind(this), logError);
  }
  onEndReached() {
    if (!this.state.noMore) 
      this.fetch();
  }
  renderRow(assets, sectionID, rowID)  {
    var photos = assets.map((asset) => {
      if (asset === null) 
        return null;
      var icon = (this.state.selected[asset.node.image.uri])
               ? 
                 <TouchableHighlight onPress={this.onSelect.bind(this, asset)} underlayColor='#ffffff'>
                   <Icon name={'ion|ios-checkmark-empty'} size={20} color='#eeeeee' style={styles.icon} />
                 </TouchableHighlight>  
               : <View />
      return (
              <View>
                 <TouchableHighlight onPress={this.onSelect.bind(this, asset)} underlayColor='#ffffff'>
                    <Image style={styles.image} source={asset.node.image} />
                 </TouchableHighlight>
                 {icon}
              </View>
      );
    });

    return (
      <View style={styles.row}>
        {photos}
      </View>
    );
  }
  onSelect(asset) {    
    this.props.onSelect(asset);
    var selected = this.state.selected;
    selected[asset.node.image.uri] = asset;

    var newDataSource = this.state.dataSource.cloneWithRows(
      groupByEveryN(this.state.assets, this.state.imagesPerRow)
    );

    this.setState({selected: selected, dataSource: newDataSource});

  }

  _appendAssets(data) {
    var assets = data.edges;
    var state = { loadingMore: false };

    if (!data.page_info.has_next_page) 
      state.noMore = true;    

    if (assets.length > 0) {
      state.lastCursor = data.page_info.end_cursor;
      state.assets = this.state.assets.concat(assets);
      state.dataSource = this.state.dataSource.cloneWithRows(
        groupByEveryN(state.assets, this.state.imagesPerRow)
      );
    }

    this.setState(state);
  }
}

var styles = StyleSheet.create({
  photoContainer: {
    marginTop: 65,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center'
  },
  image: {
    margin: 1,
    marginVertical: 1,
    width: 110,
    height: 110
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: -25,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});
module.exports = SelectPhotoList;
