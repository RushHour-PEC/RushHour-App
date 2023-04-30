import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useRef } from 'react'
import PhoneInput from 'react-native-phone-number-input'
// import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {auth,db} from '../config'

export default RegisterScreen = ({ navigation }) => {
  const [name,setName] = useState("")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [carNumber, setCarNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const phoneInput = useRef(null)

  const createUser = async (email, password) => {
    try {
      auth.createUserWithEmailAndPassword(email, password).then((authUser)=>{
        authUser.user.updateProfile({
          displayName:name
        })
      })
    } catch (error) {
      alert(error)
    }
    const ifUserExists = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
    console.log(ifUserExists)
    if (!ifUserExists) {
      const addUser = await db.collection('Users').add({
        email: email,
        phone: phoneNumber,
        carNumber,
      })
      // if (addUser) {
      //   console.log('user added')
      // } else console.log('')
      console.log(addUser)
    }
    navigation.navigate('TrustScore')
  }

  const handleLogin = () => {
    navigation.navigate('Login')
  }
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Email/Password Authentication</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder='Full Name'
      />
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
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode='IN'
        onChangeFormattedText={(text) => {
          setPhoneNumber(text)
        }}
        withDarkTheme
        withShadow
        autoFocus
      />
      <TextInput
        style={styles.input}
        value={carNumber}
        onChangeText={setCarNumber}
        placeholder='Eg: CH01AB0000'
      />
      <View style={styles.buttons}>
        <Button title='Create' onPress={createUser} />
      </View>
      <View>
        <Text style={styles.text}>
          Already have a account?
          <Button title='Login' onPress={handleLogin} />
        </Text>
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
