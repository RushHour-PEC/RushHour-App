import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import EmergencyScreen from './screens/EmergencyScreen';
import TrustScoreScreen from './screens/TrustScoreScreen';
import ProfileScreen from './screens/ProfileScreen';
import MapScreen from './screens/MapScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { database } from './firebase';
import { getDatabase, ref, get } from 'firebase/database';
import { useEffect } from 'react';

// Fetch the value of the 'flag' variable from the database
get(ref(database, 'flag')).then((snapshot) => {
  const flagValue = snapshot.val();
  console.log('The value of the flag variable is:', flagValue);
});


const Tab = createBottomTabNavigator()
const EmergencyNavigator = createStackNavigator()
const TrustNavigator = createStackNavigator()
const MapNavigator = createStackNavigator()
const ProfileNavigator = createStackNavigator()


function EmergencyNavigatorScreen(){
   return(

 <EmergencyNavigator.Navigator>
    
   <EmergencyNavigator.Screen
   name="EmergencyScreen" 
   component={EmergencyScreen} 
   options={{
    headerShown: false,
    unmountOnBlur: true 
  }}
  
   />
   
   </EmergencyNavigator.Navigator>

   )
  

}


function TrustNavigatorScreen(){
   
  return(

<TrustNavigator.Navigator>
  
  <TrustNavigator.Screen
  name="TrustScreen" 
  component={TrustScoreScreen} 
  options={{
    headerShown: false,
    unmountOnBlur: true 
  }}

  />
  
  </TrustNavigator.Navigator>


  )
  

}

function ProfileNavigatorScreen(){
  return(

<ProfileNavigator.Navigator>
   
  <ProfileNavigator.Screen
  name="ProfileScreen" 
  component={ProfileScreen} 
  options={{
   headerShown: false,
   unmountOnBlur: true 
 }}
 
  />
  
  </ProfileNavigator.Navigator>

  )
 

}

function MapNavigatorScreen(){
  

  return(

<MapNavigator.Navigator>
   <MapNavigator.Screen

      name="MapScreen"     
      component={MapScreen} 
      options={{
        headerShown: false,
        unmountOnBlur: true 
      }}
   />
  
  </MapNavigator.Navigator>

  )
  

}
export default function App() {
  
  //  useFocusEffect(() => {
  //   // Add your code here to refresh the screen
  //   console.log('Screen refreshed');

  //   // Return a cleanup function if needed
  //   return () => {
  //     // Cleanup code here
  //   };
  // });

  return (
    <NavigationContainer>
     <Tab.Navigator
     screenOptions={({ route }) => ({
    
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        size = focused? 40:35;
        if (route.name === 'Emergency') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          
        } else if (route.name === 'Trust') {
          iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
        } else if (route.name === 'Profile'){
          iconName = focused ? 'person-circle' : 'person-circle-outline';
        }
         

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      
       tabBarLabel: ({ focused, color }) => (
      <Text style={{ textAlign: 'center', color ,fontSize: 12}}>{route.name}</Text>
    ),

    
      tabBarActiveTintColor: "black",
      tabBarInactiveTintColor: "black",
      tabBarActiveBackgroundColor: "rgba(0, 254, 71, 0.5)",
      tabBarInactiveBackgroundColor: "rgba(2, 116, 34, 0.47)",
      tabBarStyle: [
        {
          display: "flex",
          height:60
        },
        null
      ]

  })

}
  
     >
     <Tab.Screen
     name="Emergency" 
      component={EmergencyNavigatorScreen}
      options={{
        headerShown: false,
      }}
     />
       
     <Tab.Screen
      name="Trust"
      options={{
        headerShown: false,
      }}
      component={TrustNavigatorScreen}
     />

     <Tab.Screen
      name="Profile"
      options={{
        // headerShown: false,
        headerTitle: 'My Profile',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: 'rgba(0, 254, 71, 0.5)',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },

      }}
      component={ProfileNavigatorScreen}
     />
     
     
     
     </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
