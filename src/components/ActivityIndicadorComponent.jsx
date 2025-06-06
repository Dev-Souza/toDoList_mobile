import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const ActivityIndicatorComponent = () => (
  <View style={styles.container}>
    <ActivityIndicator
      animating={true}
      color={MD2Colors.grey600}
      size={35}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicatorComponent;