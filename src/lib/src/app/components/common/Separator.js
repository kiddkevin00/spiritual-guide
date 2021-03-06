import {
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';


const styles = StyleSheet.create({
  separator: {
    flexGrow: 1,
    marginLeft: 10,
    marginRight: 10,
    height: 1,
    backgroundColor: '#E4E4E4',
  },
});

function Separator() {
  return (
    <View style={ styles.separator } />
  );
}

export { Separator as default };
