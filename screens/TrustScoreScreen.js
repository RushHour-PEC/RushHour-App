import React, { useState, useEffect ,useRef,memo,useCallback } from 'react';
import { View,  StyleSheet,Text,TouchableOpacity,Image} from 'react-native';
import MapView, { Marker, Polyline,Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import junctionsData from '../data/junctions.json';
import arrowIcon from '../assets/navigation.png';
import MapViewDirections from 'react-native-maps-directions';


import {GOOGLE_API_KEY1,OPEN_WEATHER_API_KEY} from '@env'
import memoizeOne from 'memoize-one';
import _ from 'lodash';
import { Loading } from '../components/Loading';

const weatherValues = {
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
const TrustScoreScreen = memo(() =>  {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestJunction, setNearestJunction] = useState(null);
  const [connectedJunctions,setConnectedJunctions] = useState([])
  const [trust,setTrust] = useState({});
  const [isLoading,setIsLoading] = useState(true);
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
          distanceInterval: 0.1,
          timeInterval: 30000,
        },
        location => {
          console.log("location head Trust-->",location.coords.heading);
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
  


  useEffect(() => {
   
    if (!currentLocation) {
      return;
    }

      const nearestJunction = findNearestJunction(
        currentLocation,currentLocation.heading
      );

     const connectedJunctionsData = nearestJunction?.connected_junctions
        ?.map((connectedJunction, index) => {
          const connectedJunctionData = junctionsData.junctions.find(
            j => j.id === connectedJunction,
          );
          return connectedJunctionData
            ? {
                ...connectedJunctionData,
                alphabet: String.fromCharCode(65 + index),
              }
            : null;
        }).filter(Boolean);

      setNearestJunction(nearestJunction);
      setConnectedJunctions(connectedJunctionsData);

  }, [currentLocation]);
  

  
  // define the debounced function
const debouncedFetch = _.debounce(async () => {
  if (!nearestJunction) {
    return;
  }

  const fetchedJunctions = new Set();

  const fetchTrafficAndWeatherData = async (connectedJunction) => {
    const s_lat = nearestJunction.lat;
    const s_long = nearestJunction.long;
    const d_lat = connectedJunction.lat;
    const d_long = connectedJunction.long;

    const trafficUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${s_lat}%2C${s_long}&destinations=${d_lat}%2C${d_long}&mode=driving&departure_time=now&traffic_model=best_guess&key=${GOOGLE_API_KEY1}&alternatives=true`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${d_lat}&lon=${d_long}&appid=${OPEN_WEATHER_API_KEY}`;

    const [trafficResponse, weatherResponse] = await Promise.all([
      fetch(trafficUrl),
      fetch(weatherUrl),
    ]);

    const trafficData = await trafficResponse.json();
    const weatherData = await weatherResponse.json();

    const trafficStatus = trafficData.rows[0].elements[0].status;
    let congestion_score = 0;

    if (trafficStatus === "OK") {
      const congestionTime = trafficData.rows[0].elements[0].duration_in_traffic.text;
      const minutes = parseInt(congestionTime.match(/\d+/g)[0]);
      const scaled_time = minutes / 60;
      congestion_score = ((1.0 - scaled_time) * weightage);
     
    } else {
      console.log("Error: Traffic information is not available for this location.");
    }

    const description = weatherData.weather[0].description;
    let weather_score = 0;
    for (const key in weatherValues) {
      if (key.toLowerCase().includes(description.toLowerCase())) {
        weather_score = (weatherValues[key] * weightage);
        break;
      }
    }

    setTrust(prevTrust => ({ ...prevTrust, [connectedJunction.alphabet]: (congestion_score + weather_score).toFixed(2) }));
  };

  Promise.all(
    connectedJunctions.map((connectedJunction) => {
      // if (!fetchedJunctions.has(connectedJunction)) {
      fetchedJunctions.add(connectedJunction);
      return fetchTrafficAndWeatherData(connectedJunction);
      // }
    })
  );
}, 1000); // set the debounce time (in milliseconds)


  // call the debounced function in useEffect
useEffect(() => {
  debouncedFetch();
}, [nearestJunction]);
  
  
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
      <View style={{ 
        transform: [{ rotate: `${currentLocation.heading}deg` }],
        zIndex:1000
    }}>
        <Image source={arrowIcon} style={{ width: 25, height: 25 }} />
      </View>
    );
  };
  
  const connectedJunctionsMap = useCallback(
    (connectedJunction) => (
      <Marker
        key={`${nearestJunction.id}-${connectedJunction.id}`}
        coordinate={{
          latitude: connectedJunction.lat,
          longitude: connectedJunction.long,
        }}
        title={`Junction ${connectedJunction.alphabet}`}
        // zIndex={998} 
        // alphaHitTest={true}
      />
    ),
    [nearestJunction]
  );
  
  return (


    <View style={styles.container}>
      
        {isLoading ? ( // show loading component until currentLocation is available
        <Loading text={"Loading..."} color={'black'}/>
      ) : currentLocation ? ( // render the map view when currentLocation is available
  
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
                title={""}
                // zIndex={999}
              >
              <Callout 
              tooltip  
              alphaHitTest={true}
              zIndex= {1}
              // style={zIndex=1}
              >
              <View>
                <View style={styles.bubble}>
                  <Text style={styles.name}>
                  
                  {Object.entries(trust)
                    .sort(([key1], [key2]) => key1.localeCompare(key2))
                    .map(([key, value]) => `Trust ${key}: ${value}`)
                    .join(' ')
                  }
                  </Text>
                  {/* <Text>A short description</Text> */}
                </View>
                <View style={styles.arrowBorder} />
                <View style={styles.arrow} />
              </View>
            </Callout>
              </Marker>

              {connectedJunctions.map(connectedJunctionsMap)}

              <MapViewDirections
                    origin={currentLocation}
                    destination={{
                      latitude: nearestJunction.lat,
                      longitude: nearestJunction.long,
                    }}
                    apikey={GOOGLE_API_KEY1}
                    strokeColor="#111111"
                    // resetOnChange={false}
                    strokeWidth={4}
                    mode='WALKING'  // BICYCLING , WALKING,  DRIVING
                />


            
            </>

            
          )}

         
        </MapView>
          ): (
            <Text>No location available</Text>
          )}
    </View>
  )
})



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
  flex:1
},

// Callout bubble
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -2,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
    marginBottom: -0.5
  },

  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },

})

export default TrustScoreScreen;
