import Badge from './common/__Badge__';
import WebViewWrapper from './common/WebViewWrapper';
import Separator from './common/Separator';
import GithubProxy from '../proxies/GithubProxy';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  rowContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    padding: 10,
  },
  name: {
    color: '#48BBEC',
    fontSize: 18,
    paddingBottom: 5,
  },
  stars: {
    color: '#48BBEC',
    fontSize: 14,
    paddingBottom: 5,
  },
  description: {
    fontSize: 14,
    paddingBottom: 5,
  },
});

class Repositories extends Component {

  static propTypes = {
    userInfo: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  state = {
    repos: [],
    error: '',
  };

  componentDidMount() {
    GithubProxy.getRepos(this.props.userInfo.login)
      .then((repos) => {
        this.setState({
          repos,
          error: '',
        });
      })
      .catch((err) => {
        this.setState({ error: JSON.stringify(err, null, 2) });
      });
  }

  _openPage = (url) => {
    this.props.navigator.push({
      title: 'Web Page',
      component: WebViewWrapper,
      passProps: { url },
    });
  }

  render() {
    const userInfo = this.props.userInfo;
    const list = this.state.repos.map((item, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <View key={ `repo-${index}` }>
        <View style={ styles.rowContainer }>
          <TouchableHighlight
            onPress={ this._openPage.bind(this, item.html_url) }
            underlayColor="transparent"
          >
            <Text style={ styles.name }>{ item.name }</Text>
          </TouchableHighlight>
          <Text style={ styles.stars }>Stars: { item.stargazers_count }</Text>
          { item.description ? (
            <Text style={ styles.description }>{ item.description }</Text>
          ) : (
            <View />
          )}
        </View>
        <Separator />
      </View>
    ));

    return (
      <ScrollView style={ styles.container }>
        <Badge
          avatarUrl={ userInfo.avatar_url }
          name={ userInfo.name }
          login={ userInfo.login }
        />
        { list }
      </ScrollView>
    );
  }

}

export { Repositories as default };
