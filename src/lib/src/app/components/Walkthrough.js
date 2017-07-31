import Events from './Events';
import Swiper from 'react-native-swiper';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


// [TODO] Check the sample styles on GitHub.
const styles = StyleSheet.create({
  slide: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //marginTop: 731,
    marginTop: '195%',
  },
  backgroundImage: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    resizeMode: 'stretch',
  },
  heading: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'white',
    padding: 8,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#111',
    fontSize: 12,
  },
});

class Walkthrough extends Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _checkoutEvents = () => {
    this.props.navigator.push({
      title: 'Events List',
      component: Events,
    });
  }

  render() {
    const backgroundImageInlineStyle = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };

    return (
      <Swiper showsButtons={ false }>
        <View style={ styles.slide }>
          <Image
            source={ require('../../../static/assets/images/walkthrough_1.jpg') }
            style={ [styles.backgroundImage, backgroundImageInlineStyle] }
          />
        </View>
        <View style={ styles.slide }>
          <Image
            source={ require('../../../static/assets/images/walkthrough_2.jpg') }
            style={ [styles.backgroundImage, backgroundImageInlineStyle] }
          />
        </View>
        <View style={ styles.slide }>
          <Image
            source={ require('../../../static/assets/images/walkthrough_3.jpg') }
            style={ [styles.backgroundImage, backgroundImageInlineStyle] }
          >
            <TouchableOpacity style={ styles.button } onPress={ this._checkoutEvents }>
              <Text style={ styles.buttonText }>GO VENTURE</Text>
            </TouchableOpacity>
          </Image>
        </View>
      </Swiper>
    );
  }

}

export { Walkthrough as default };
