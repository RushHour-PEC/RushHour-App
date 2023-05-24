import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import EmergencyScreen from './screens/EmergencyScreen';
import TrustScoreScreen from './screens/TrustScoreScreen';
import ProfileScreen from './screens/ProfileScreen';
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/LoginScreen';
import { UserProvider,UserContext } from './store/UserContext';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { database } from './firebase';
import { getDatabase, ref, get } from 'firebase/database';
import { useContext, useEffect } from 'react';

// // Fetch the value of the 'flag' variable from the database
// get(ref(database, 'flag')).then((snapshot) => {
//   const flagValue = snapshot.val();
//   console.log('The value of the flag variable is:', flagValue);
// });


// // Assuming you have the userId available for the user you want to fetch
// const userId = "bt19103061";

// // Fetch the user data from the database
// get(ref(database, 'Users/' + userId)).then((snapshot) => {
//   const userData = snapshot.val();
//   console.log('User data:', userData);
// }).catch((error) => {
//   console.error('Error fetching user data:', error);
// });




const Tab = createBottomTabNavigator()
const EmergencyNavigator = createStackNavigator()
const TrustNavigator = createStackNavigator()
const MapNavigator = createStackNavigator()
const ProfileNavigator = createStackNavigator()
const LoginNavigator = createStackNavigator()



function LoginNavigatorScreen(){
  return(
<UserProvider>
<LoginNavigator.Navigator>
   
  <LoginNavigator.Screen
  name="LoginScreen" 
  component={LoginScreen} 
  options={{
   headerShown: false,
   unmountOnBlur: true 
 }}
 
  />
  
  </LoginNavigator.Navigator>
</UserProvider>


  )
 

}


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
<UserProvider>
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
</UserProvider>


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
export default function App({route}) {
   
  // const [user,setUser] = useState('');
  // console.log("context -->",useContext(UserContext));
  const userData  = useContext(UserContext);
  
  // if (!userData) {
  //   // Render some loading state or fallback UI
  //   return <Text>Loading...</Text>;
  // }
  return (
    
    <UserProvider>
    
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

        else if (route.name ==='Home')
        {
          iconName = focused ? 'home' : 'home-outline';
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
    
     {true ? (
      <>
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
       
        //  <Tab.Screen
        //   name="Profile"
        //   options={{
        //     // headerShown: false,
        //     headerTitle: 'My Profile',
        //     headerTitleAlign: 'center',
        //     headerStyle: {
        //       backgroundColor: 'rgba(0, 254, 71, 0.5)',
        //     },
        //     headerTitleStyle: {
        //       fontWeight: 'bold',
        //     },
        //   }}
        //   component={ProfileNavigatorScreen}
        />
       
      </>
    ) : (
      <>
      <Tab.Screen
        name="Home"
        options={{
          // headerShown: false,
          headerTitle: 'Home',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: 'rgba(0, 254, 71, 0.5)',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        component={LoginNavigatorScreen}
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
        
      </>

      
      
    )}
     
     </Tab.Navigator>
    </NavigationContainer>
    
    </UserProvider>
    
    
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
