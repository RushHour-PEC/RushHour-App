import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import EmergencyScreen from './screens/EmergencyScreen';
import TrustScoreScreen from './screens/TrustScoreScreen';
import RegisterScreen from './screens/RegisterScreen'
import MapScreen from './screens/MapScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import 'react-native-gesture-handler';


const Tab = createBottomTabNavigator()
const EmergencyNavigator = createStackNavigator()
const TrustNavigator = createStackNavigator()
const MapNavigator = createStackNavigator()

function EmergencyNavigatorScreen(){
   return(

 <EmergencyNavigator.Navigator>
    
   <EmergencyNavigator.Screen
   name="EmergencyScreen" 
   component={EmergencyScreen} 
   options={{
    headerShown: false,
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
  }}

  />
  
  </TrustNavigator.Navigator>


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
      }}
   />
  
  </MapNavigator.Navigator>

  )
  

}
export default function App() {
  return (
    <NavigationContainer>
     <Tab.Navigator
     screenOptions={({ route }) => ({
    
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        size = focused? 30:25;
        if (route.name === 'Emergency') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
          
        } else if (route.name === 'Trust') {
          iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      
       tabBarLabel: ({ focused, color }) => (
      <Text style={{ textAlign: 'center', color ,fontSize: 12}}>{route.name}</Text>
    ),

    tabBarOptions:{
      "tabBarActiveTintColor": "black",
      "tabBarInactiveTintColor": "black",
      "tabBarActiveBackgroundColor": "rgba(0, 254, 71, 0.5)",
      "tabBarInactiveBackgroundColor": "rgba(2, 116, 34, 0.47)",
      "tabBarStyle": [
        {
          "display": "flex"
        },
        null
      ]
    }
  })}
  tabBarOptions={{
      initialRouteName: 'Emergency',
      activeBackgroundColor: 'rgba(0, 254, 71, 0.5)',
      inactiveBackgroundColor: 'rgba(2, 116, 34, 0.47)',
      activeTintColor: 'black',
      inactiveTintColor: 'black'
     }}
    
     
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
      name="Register"
      options={{
        headerShown: false,
      }}
      component={RegisterScreen}
     /><Tab.Screen
      name="Login"
      options={{
        headerShown: false,
      }}
      component={LoginScreen}
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

