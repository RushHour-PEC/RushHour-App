import React, { useState, useEffect ,useRef,useLayoutEffect,useCallback,memo } from 'react';
import { View,  StyleSheet,Text,TouchableOpacity,Image} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import junctionsData from '../data/junctions.json';
import arrowIcon from '../assets/navigation.png';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY1} from '@env'
// import { DeviceSensor, Magnetometer} from 'expo-sensors';
// import spawnPythonProcess from '../utils/spawn';
import memoizeOne from 'memoize-one';   
import { Loading } from '../components/Loading';
 
const EmergencyScreen = memo(() => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestJunction, setNearestJunction] = useState(null);
  const [isLoading,setIsLoading] = useState(true)
  const mapRef = useRef(null);
  

  useEffect(() => {
     
    
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setIsLoading(false)
     
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.01,
          timeInterval: 10000,
        },
        location => {
         
          
            console.log("location head Emgy-->",location.coords.heading);
            setCurrentLocation(location.coords);
              if (mapRef.current) {
                mapRef.current.animateToRegion(
                  {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  },
                  10000 // duration in milliseconds
                );
              }

        },
      );
    
      return () => {
        locationSubscription.remove();
       
      };
    })();
  }, [mapRef]);

  const findNearestJunction = useCallback(
    memoizeOne((currentLocation, heading) => {
      const filteredJunctions = junctionsData.junctions.filter(junction => {
        const angle = bearing(
          currentLocation.latitude,
          currentLocation.longitude,
          junction.lat,
          junction.long,
        );
        const angleDiff = Math.abs(angle - heading);
        return angleDiff <= 45; // Use a 45-degree threshold
      });
    
      let minDistance = Infinity;
      let nearestJunction = null;
      filteredJunctions.forEach(junction => {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          junction.lat,
          junction.long,
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestJunction = junction;
        }
      });
    
      return nearestJunction;
    }),
  []);

  const handleRequestGreenCorridor = () => {
    // Find the nearest junction to the current location
    if (!currentLocation) {
      return;
    }
  
    const nearestJunction = findNearestJunction(
      currentLocation,
      currentLocation?.heading
    );
  
    setNearestJunction(nearestJunction);
  
    // Call the spawnPythonProcess function
    // spawnPythonProcess()
  }
  
  // Calculate the bearing angle between two coordinates
const bearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return Math.atan2(y, x) * (180 / Math.PI);
};

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };


  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  const MarkerView = () => {
    return (
      <View style={{ transform: [{ rotate: `${currentLocation.heading}deg` }],zIndex:100 }}>
        <Image 
        fadeDuration={0}
        source={arrowIcon} 
        style={{ width: 25, height: 25 }} />
      </View>
    );
  };

  
  return (
    <View style={styles.container}>
      {isLoading ? ( // show loading component until currentLocation is available
        <Loading text={"Loading..."} color={'black'}/>
      ) : currentLocation ? ( // render the map view when currentLocation is available
      <>
      
       <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          // showsUserLocation={true}
        >
          <Marker
            coordinate={currentLocation}
            identifier='origin'
          >
            <MarkerView />
          </Marker>

          {nearestJunction && (
            <>
              <Marker
                coordinate={{
                  latitude: nearestJunction.lat,
                  longitude: nearestJunction.long,
                }}
                identifier='destination'
              />
              <MapViewDirections
                origin={currentLocation}
                destination={{
                  latitude: nearestJunction.lat,
                  longitude: nearestJunction.long,
                }}
                apikey={GOOGLE_API_KEY1}
                strokeColor="#111111"
                strokeWidth={4}
                mode='WALKING' // BICYCLING , WALKING,  DRIVING
              />
            </>
          )}
        </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRequestGreenCorridor}>
          <Text style={styles.buttonText}>Request Green Corridor</Text>
        </TouchableOpacity>
      </View>
      </>  
     
      ) : (
        <Text>No location available</Text>
      )}
     
    </View>
  );}
  )


const styles = StyleSheet.create({

buttonContainer:{
  flex: 1, 
  alignItems: 'center', 
  justifyContent: 'center'
},

button:{
  backgroundColor: 'rgba(254, 0, 0, 0.6)',
    height: 60,
    width: 300,
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
  },

buttonText:{
  
  textAlign:'center',
  fontWeight: 400,
  fontSize: 20,
  color: '#000000'

},

container:{
    flex:1

  },
map:{
  flex:4
},

})

export default EmergencyScreen;
