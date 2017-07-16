import EventDetail from './EventDetail';
import Login from './Login';
import Separator from './common/Separator';
import BaseComponent from './common/BaseComponent';
import { firebaseAuth, firebaseDb } from '../proxies/FirebaseProxy';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Card,
  CardItem,
  Left,
  Body,
  Thumbnail,
  Button,
  Icon,
  Text,
} from 'native-base';
import {
  StyleSheet,
  //Text,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  Image,
} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    //flexDirection: 'column',
  },
  main: {
    flexGrow: 70,
  },
  footer: {
    flexGrow: 3,
    flexDirection: 'row',
    backgroundColor: '#E3E3E3',
    //alignItems: 'center',
  },
  rowContainer: {
    //flexGrow: 1,
    padding: 10,
  },
  itemName: {
    paddingBottom: 5,
    fontSize: 18,
    color: '#1558c4',
  },
  itemText: {
    paddingBottom: 5,
    fontSize: 14,
    color: '#48BBEC',
  },
  eventInput: {
    flexGrow: 20,
    //height: 60,
    padding: 8,
    fontSize: 18,
    color: '#111',
  },
  submitEventButton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //height: 60,
    backgroundColor: '#48BBEC',
  },
  logoutButton: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //height: 60,
    backgroundColor: 'orange',
  },
  submitEventButtonText: {
    fontSize: 18,
    color: 'white',
  },
  logoutButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

class Events extends BaseComponent {

  constructor(props) {
    super(props);

    this.listViewDataSource = new ListView.DataSource({
      rowHasChanged: (originalRow, newRow) => newRow._id !== originalRow._id,
    });
    this.dataRef = firebaseDb.ref('/nyc').child('events');

    this.state = {
      events: [],
      eventListViewDataSource: this.listViewDataSource.cloneWithRows([]),
      newEvent: '',
    };
    this._bind('_handleLogout', '_handleClick', '_handleChange', '_renderEvent', '_checkoutEventDetail');
  }

  static propTypes = {
    userInfo: PropTypes.object//.isRequired,
  };

  componentDidMount() {
    this.dataRef.on('value', (eventsSnapshot) => {
      const events = [];

      eventsSnapshot.forEach((eventSnapshot) => {
        events.push(eventSnapshot.val());
      });

      this.setState({
        events,
        eventListViewDataSource: this.listViewDataSource.cloneWithRows(events),
      });
    });
  }

  componentWillUnmount() {
    this.dataRef.off();
  }

  render() {
    //const userInfo = this.props.userInfo;

    return (
      <Container>
        <Header style={ { height: 64, backgroundColor: '#f4f7f9', } } />
        <Content>
          <List
            dataArray={ this.state.events }
            renderRow={ this._renderEvent }
          >
          </List>
        </Content>
      </Container>
    );

    return (
      <View style={ styles.container }>
        <ListView
          style={ styles.main }
          dataSource={ this.state.eventListViewDataSource }
          renderRow={ this._renderEvent }
          enableEmptySections={ true }
          renderHeader={ () => null }
        />
        <View style={ styles.footer }>
          <TextInput
            style={ styles.eventInput }
            value={ this.state.newEvent }
            onChange={ this._handleChange }
            placeholder="Submit an event here..."
            placeholderTextColor="white"
          />
          <TouchableHighlight
            style={ styles.submitEventButton }
            onPress={ this._handleClick }
            underlayColor="#88D4F5"
          >
            <Text style={ styles.submitEventButtonText }>Submit</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={ styles.logoutButton }
            onPress={ this._handleLogout }
            underlayColor="#ffcc00"
          >
            <Text style={ styles.logoutButtonText }>Logout</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _renderEvent(event) {
    return (
      <ListItem onPress={ this._checkoutEventDetail.bind(this, event) }>
        <Card>
          <CardItem>
            <Left>
              <Thumbnail source={ require('../../../static/assets/images/v4_background.png') } />
              <Body>
                <Text>{ event.name }</Text>
                <Text note>{ event.address }</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image source={ require('../../../static/assets/images/v3_background.png') } style={ { height: 200, width: null, flex: 1 } } />
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent onPress={ () => alert('Added to your calender!') }>
                <Icon active name="chatbubbles" />
                <Text>Going</Text>
              </Button>
              <Button transparent onPress={ () => alert('Saved!') }>
                <Icon active name="thumbs-up" />
                <Text>Save</Text>
              </Button>
            </Left>
            <Body>
              <Text note>{ new Date(event.startDate).toDateString() }</Text>
              <Text note>~ { new Date(event.endDate).toDateString() }</Text>
            </Body>
          </CardItem>
        </Card>
      </ListItem>
    );

    return (
      <View>
        <View style={ styles.rowContainer }>
          <TouchableHighlight
            onPress={ this._checkoutEventDetail.bind(this, event) }
            underlayColor="transparent"
          >
            <Text style={ styles.itemName }>{ event.name }</Text>
          </TouchableHighlight>
          <Text style={ styles.itemText }>{ event.address }</Text>
          <Text style={ styles.itemText }>{ new Date(event.startDate).toDateString() } - { new Date(event.endDate).toDateString() }</Text>
        </View>
        <Separator />
      </View>
    );
  }

  _handleClick() {
    this.dataRef
      .push({
        name: this.state.newEvent,
        address: '123 42nd street, New York, NY',
        startDate: Date.now(),
        endDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
        type: 'General',
        description: 'Here is some detail...',
        cost: 0,
        externalLink: 'https://www.timeout.com/newyork/things-to-do/sunset-sail-happy-hour',
        photoUrls: [],
      })
      .then(() => {
        this.setState({
          newEvent: '',
        });
      })
      .catch((err) => {
        alert(JSON.stringify(err, null, 2));
      });
  }

  _handleChange(event) {
    this.setState({
      newEvent: event.nativeEvent.text,
    });
  }

  async _handleLogout() {
    this.setState({
      isLoading: true,
    });

    try {
      await firebaseAuth.signOut();

      this.props.navigator.push({
        title: 'Log In',
        component: Login,
      });

      this.setState({
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error.message;

      alert(errorMessage);

      this.setState({
        isLoading: false,
      });
    }
  }

  _checkoutEventDetail(event) {
    this.props.navigator.push({
      title: 'Event Detail',
      component: EventDetail,
      passProps: { event },
    });
  }

}

export { Events as default };