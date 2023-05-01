import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import auth from '@react-native-firebase/auth'
import {auth } from '../firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";

// import {onAuthStateChanged} from 'firebase/auth'


export default LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 const handleRegister = ()=>{
  navigation.navigate('Register')
 }

 const handleLogin = ()=>{
   signInWithEmailAndPassword(auth, email, password)
     .then((userCredential) => {
       // Signed in 
       const user = userCredential.user;
       // ...
     })
     .catch((error) => {
       // const errorCode = error.code;
       const errorMessage = error.message;
       alert(errorMessage)
     });
 }

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        navigation.replace('Emergency')
      }
    })
    return unsubscribe
  },[])
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>SIGN IN!</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder='E-mail'
        keyboardType='email-address'
        autoCompleteType='off'
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder='Password'
        secureTextEntry={true}
      />
      <View style={styles.buttons}>
        <Button title='Login' onPress={handleLogin}/>
      </View>
      <View style={styles.buttons}>
       <Text>Don't have a account?</Text>
        <Button title='Register' onPress={handleRegister} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 21,
    marginBottom: 30,
  },
  input: {
    width: 300,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6d69c3',
    marginVertical: 10,
    padding: 15,
  },
  buttons: {
    width: 150,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})