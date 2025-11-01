import React from 'react';
import { View } from 'react-native';
import { Text } from './components/Text';

export default function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="heading">Hello World</Text>
      <Text>This is the body</Text>
    </View>
  );
}
