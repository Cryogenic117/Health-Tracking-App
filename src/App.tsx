import React from 'react';
import { View, Text, } from 'react-native';
import styles from './styles'
import Navbar from "./navbar";
export default function App(): JSX.Element {
  return (
      <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text>Hello, world!</Text>
          </View>

          <Navbar />
      </View>
  );
}

