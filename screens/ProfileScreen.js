import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({navigation}) => {

    const [image, setImage] = useState(null);
    // console.log(navigation);

    const route = useRoute();
    const userData = route?.params?.userData;
    
  
    const selectImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            // Use the selected image
            setImage(result.assets[0].uri);
          }
        
      }
    };
  
    const signout = () => {
      // Handle signout logic here
      

    };
     

   
    return (
        <View style={styles.container}>
        <View style={styles.imageContainer}>
        <TouchableOpacity  onPress={selectImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Select Image</Text>
              </View>
            )}
           
          </TouchableOpacity>
        
        </View>
          
          <View style={styles.fieldsContainer}>
          <View style={styles.field}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.label}>{userData.name}</Text>
          </View>

           <View style={styles.field}>
           <Text style={styles.label}>Phone Number</Text>
           <Text style={styles.label}>{userData.phone}</Text>
           </View>
            
           <View style={styles.field}>
            <Text style={styles.label}>Vehicle Number</Text>
            <Text style={styles.label}>{userData.car}</Text>
           </View>
           
            
          </View>
          <TouchableOpacity style={styles.signoutButton} onPress={signout}>
            <Text style={styles.signoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 20,
    },
    imageContainer: {
    
    justifyContent:'flex-start',
    position: 'relative',
    // marginBottom: 20,
    // marginTop:-100
    
    },
    image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode:"contain"
    },
    placeholder: {
    width: 150,
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    },
    placeholderText: {
    fontSize: 16,
    color: '#666',
    },
    pencilIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    },

    field:{
      flexDirection:'row',
      justifyContent:'space-between',
      margin:10
    },
    fieldsContainer: {
    marginBottom: 20,
    width: '100%',
    },
    label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    },
    input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    },
    signoutButton: {
    // backgroundColor: 'white',
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    // marginBottom:5
    },
    signoutButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    
    },
});

export default ProfileScreen;