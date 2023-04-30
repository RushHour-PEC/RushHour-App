import React, { useState, useEffect ,useRef,useLayoutEffect } from 'react';
import { View,  StyleSheet,Text,TouchableOpacity,Image} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import junctionsData from '../data/junctions.json';
import arrowIcon from '../assets/navigation.png';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY} from '@env'
import { DeviceSensor, Magnetometer} from 'expo-sensors';
// import spawnPythonProcess from '../utils/spawn';


const EmergencyScreen = ({navigation}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestJunction, setNearestJunction] = useState(null);
  const [heading, setHeading] = useState(0);
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

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
          timeInterval: 1000,
        },
        location => {
          setCurrentLocation(location.coords);
        },
      );
     
    
      return () => {
        locationSubscription.remove();
       
      };

    })();
  }, []);


  // useEffect(() => {
  //  let headingSubscription = Magnetometer.addListener(data => {
    
  //   const { x, y} = data;
  //   const heading = Math.atan2(y, x) * (180 / Math.PI) + 90;
  //   // console.log("head-->",heading);
  //   setHeading(heading >= 0 ? heading : 360 + heading);
  // });
  // console.log(heading);
  // Magnetometer.setUpdateInterval(1000);
  //   return () => {
  //     headingSubscription.remove();
  //   };
  // }, [heading]);

  
  // const animateMarkerToCoordinate = (markerRef, coordinate, heading) => {
  //   markerRef.current?.animateMarkerToCoordinate(coordinate, 500);
  //   mapRef.current?.animateCamera(
  //     {
  //       center: coordinate,
  //       heading: heading,
  //       zoom: 15,
  //       pitch: 0,
  //     },
  //     500
  //   );
  // };

  useEffect(() => {
   

    if (currentLocation) {
      // Find the nearest junction to the current location
      // let minDistance = Infinity;
      // let nearestJunction = null;
      // junctionsData.junctions.forEach(junction => {
      //   const distance = calculateDistance(
      //     currentLocation.latitude,
      //     currentLocation.longitude,
      //     junction.lat,
      //     junction.long,
      //   );
      //   if (distance < minDistance) {
      //     minDistance = distance;
      //     nearestJunction = junction;
      //   }
      // });
      // setNearestJunction(nearestJunction);


      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // const markerRef = mapRef.current?.getMarkerRef('origin');
      // if (markerRef) {
      //   animateMarkerToCoordinate(markerRef, currentLocation, heading);
      // }

    //   mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
    //     edgePadding: { top: 200, right: 200, bottom: 200, left: 200 }
    // });
    }
  }, [currentLocation,heading]);
  
  

  const handleRequestGreenCorridor = () => {
    // Find the nearest junction to the current location

    const filteredJunctions = junctionsData.junctions.filter(junction => {
      const angle = bearing(
        currentLocation.latitude,
        currentLocation.longitude,
        junction.lat,
        junction.long,
      );
      const angleDiff = Math.abs(angle - heading);
      return angleDiff <= 30; // Use a 30-degree threshold
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
    setNearestJunction(nearestJunction);

    // Call the spawnPythonProcess function
    // spawnPythonProcess()
  };
  
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
      <View style={{ transform: [{ rotate: `${heading}deg` }] }}>
        <Image source={arrowIcon} style={{ width: 25, height: 25 }} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentLocation && 
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
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
                    apikey={GOOGLE_API_KEY}
                    strokeColor="rgb(0, 122, 255)"
                    strokeWidth={5}
                    mode='WALKING'  // BICYCLING , WALKING,  DRIVING
                />
            
            </>
          )}

         
        </MapView>
      }
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={handleRequestGreenCorridor}>
         <Text style={styles.buttonText}>Request Green Corridor</Text>
       </TouchableOpacity>
      </View>
    </View>
  )}



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
