import React, { useState,useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { database } from '../firebase';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../store/UserContext';
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();
  const { updateUser } = useContext(UserContext);

  const handleLogin = () => {
    // Basic validation
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Fetch user data from Firebase
    get(ref(database, `Users/${username}`))
      .then((snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.password === password) {
          // Successful login
          updateUser(userData);
          
          console.log('Login successful');
          setUsername('')
          setPassword('')
           // Update the user data using the context
          
          
          navigation.navigate('Profile', {
            screen: 'ProfileScreen',
            params: {
              userData: {
                name: userData.name,
                phone: userData.phone,
                car: userData.car,
              },
            },
          });

          

         

        } else {
          // Invalid credentials
          Alert.alert('Error', 'Invalid username or password');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'An error occurred during login');
      });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.loginText}>Login</Text> */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/Ambulance_Logo.png')} style={styles.logoImage} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
//   loginText: {
//     marginTop:height*0.05,
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: height * 0.005,
//     color: '#333333',
//     textAlign: 'center',
//   },
  imageContainer: {
    marginTop: height*-0.07,
    marginBottom: height * 0.001,
  },
  logoImage: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: height * 0.06,
    width: width * 0.8,
  },
  input: {
    width: '100%',
    height: height * 0.06,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: height * 0.02,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    backgroundColor: 'rgba(254, 0, 0, 0.6)',
    width: width * 0.6,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop:height*-0.03
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;