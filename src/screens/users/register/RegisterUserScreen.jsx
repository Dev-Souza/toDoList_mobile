import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-paper'

export default function RegisterUserScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text >RegisterUserScreen</Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >Voltar</Button>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})