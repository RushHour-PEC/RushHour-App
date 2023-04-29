import React, { useState, useEffect ,useRef } from 'react';
import { View,  StyleSheet,Text,TouchableOpacity,Image} from 'react-native';
import MapView, { Marker, Polyline,Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import junctionsData from '../data/junctions.json';
import arrowIcon from '../assets/navigation.png';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY,OPEN_WEATHER_API_KEY} from '@env'
import { DeviceMotion, DeviceSensor, Magnetometer} from 'expo-sensors';


const weatherData = {
  'Thunderstorm': 0,
  'Drizzle': 0.3,
  'rain': 0.4,
  'Snow': 0.3,
  'Mist': 0.4,
  'Smoke': 0.2,
  'Haze': 0.3,
  'Fog': 0.2,
  'Sand': 0.1,
  'Dust': 0.1,
  'Tornado': 0,
  'clear sky': 1,
  'few clouds': 0.8,
  'Scattered clouds': 0.7,
  'Broken clouds': 0.5,
  'overcast clouds': 0.3
};

const weightage = 0.5
const TrustScoreScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestJunction, setNearestJunction] = useState(null);
  const [heading, setHeading] = useState(90);
  const [trust,setTrust] = useState([]);
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


  useEffect(() => {
    const subscribeHeading = async () => {
      if (await DeviceMotion.isAvailableAsync()) {
        const headingSubscription = DeviceMotion.addListener(data => {
          const { x, y, z } = data.acceleration;
          const heading = Math.atan2(y, x) * (180 / Math.PI) + 90;
          setHeading(heading >= 0 ? heading : 360 + heading);
        });
  
        return () => {
          headingSubscription.remove();
        };
      } else {
        console.log('DeviceMotion is not available.');
      }
    };
  
    subscribeHeading();
  }, [heading]);

  
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
  

  useEffect(() => {
    const fetchTrafficAndWeatherData = async () => {
      if (nearestJunction) {

        const trust = []
        for (let i = 0; i < nearestJunction.connected_junctions.length; i++) {
          const connectedJunction = nearestJunction.connected_junctions[i];
          const connectedJunctionData = junctionsData.junctions.find(
            (j) => j.id === connectedJunction
          );
          if (!connectedJunctionData) return null;
          
          console.log("near-->",nearestJunction);
          const s_lat = nearestJunction.lat;
          const s_long = nearestJunction.long;
          const d_lat = connectedJunction.lat;
          const d_long = connectedJunction.long;
  
          // Define the API endpoint for traffic data
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${s_lat}%2C${s_long}&destinations=${d_lat}%2C${d_long}&mode=driving&departure_time=now&traffic_model=best_guess&key=${GOOGLE_API_KEY}&alternatives=true`;
  
          // Make a request to the API endpoint
          const response = await fetch(url);
  
          // Decode the JSON response
          const data = await response.json();
  
          // Get the traffic congestion status
          const status = data.rows[0].elements[0].status;
          
          const congestion_score = 0
          const weather_score = 0
          // Check the status and display the traffic congestion status
          if (status === "OK") {
            const congestionTime = data.rows[0].elements[0].duration_in_traffic.text;
            const minutes = parseInt(congestionTime.match(/\d+/g)[0]);
            const scaled_time = minutes / 60; // 0 to 1
  
            congestion_score = Math.round((1.0 - scaled_time) * weightage * 100) / 100;
            
          } else {
            console.log("Error: Traffic information is not available for this location.");
          }
  
          // Define the API endpoint for weather data
          const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${d_lat}&lon=${d_long}&appid=${OPEN_WEATHER_API_KEY}`;
  
          // Make a request to the API endpoint
          const response2 = await fetch(url2);
  
          // Decode the JSON response
          const data2 = await response2.json();
  
          const description = data2.weather[0].description;
          for (const key in weatherData) {
            if (key.toLowerCase().includes(description.toLowerCase())) {
              weather_score = Math.round(weatherData[key] * weightage * 100) / 100;
              break;
            }
          }

          trust.push(congestion_score + weather_score)
        }
         console.log("trust array-->",trust);
        setTrust(trust)
      }
    };
  
    fetchTrafficAndWeatherData();
  }, [nearestJunction]);
  
  
  


  const handleTrustRequest = () => {
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
      {
        currentLocation && 
         
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
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
                // title={<View>
                //   {trust?.map((item, index) => (
                //     <Text key={index}>
                //       {`Trust${index}: ${item}`}
                //     </Text>
                //   ))}
                // </View>}
              >
              
              </Marker>

              {nearestJunction.connected_junctions.map((connectedJunction) => {

                const connectedJunctionData = junctionsData.junctions.find(j => j.id === connectedJunction);
                if (!connectedJunctionData) return null;
                return (
                  <Marker
                  key={`${nearestJunction.id}-${connectedJunction}`}
                  coordinate={{
                    latitude: connectedJunctionData.lat,
                    longitude: connectedJunctionData.long,
                  }}
                  title={connectedJunctionData.name}
                />

                );
                
                })
              }
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
      <TouchableOpacity style={styles.button} onPress={handleTrustRequest}>
         <Text style={styles.buttonText}>Request Trust Score</Text>
       </TouchableOpacity>
      </View>
    </View>
  )
}



const styles = StyleSheet.create({

buttonContainer:{
  flex: 1, 
  alignItems: 'center', 
  justifyContent: 'center'
},

button:{
  backgroundColor: 'rgba(254, 0, 0, 0.6)',
    // opacity:0.4,
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

export default TrustScoreScreen;
