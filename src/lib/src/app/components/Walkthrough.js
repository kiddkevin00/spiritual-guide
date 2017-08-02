import Events from './Events';
import Swiper from 'react-native-swiper';
import {
  Container,
  Content,
  Button,
  Text,
} from 'native-base';
import {
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


// [TODO] Check the sample styles on GitHub.
const styles = StyleSheet.create({
  backgroundImage: {
    //flexGrow: 1,
    justifyContent: 'flex-end',
    //alignItems: 'center',
    //resizeMode: 'stretch',
  },
});

class Walkthrough extends Component {

  static propTypes = {
    updateNavbarVisibility: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  _checkoutEvents = () => {
    this.props.navigator.push({
      title: 'Events List',
      component: Events,
      passProps: { updateNavbarVisibility: this.props.updateNavbarVisibility },
    });
  }

  render() {
    const backgroundImageInlineStyle = {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    };

    return (
      <Swiper showsButtons={ false } loop={ false } index={ 0 } activeDotColor="white">
        <Image
          style={ [styles.backgroundImage, backgroundImageInlineStyle] }
          source={ require('../../../static/assets/images/walkthrough_1.jpg') }
        />
        <Image
          style={ [styles.backgroundImage, backgroundImageInlineStyle] }
          source={ require('../../../static/assets/images/walkthrough_2.jpg') }
        />
        <Image
          style={ [styles.backgroundImage, backgroundImageInlineStyle] }
          source={ require('../../../static/assets/images/walkthrough_3.jpg') }
        >
          <Button
            block
            light
            style={ { marginBottom: 80, marginLeft: 20, marginRight: 20, paddingTop: 25, paddingBottom: 25 } }
            onPress={ this._checkoutEvents }
          >
            <Text style={ { fontSize: 15 } }>Explore now</Text>
          </Button>
        </Image>
      </Swiper>
    );
  }

}

export { Walkthrough as default };
