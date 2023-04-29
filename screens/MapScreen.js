import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import junctionsData from '../data/junctions.json';

const MapScreen = ()=> {

  // console.log(junctionsData);
  return (

    <View style={styles.container}>
    
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 30.767012,
        longitude: 76.791282,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
    {junctionsData.junctions.map((junction) => (
        <React.Fragment key={junction.id}>
          <Marker
            coordinate={{ latitude: junction.lat, longitude: junction.long }}
            title={junction.id.toString()}
          />
          {junction.connected_junctions.map((connectedJunction) => {
            const connectedJunctionData = junctionsData.junctions.find(j => j.id === connectedJunction);
            if (!connectedJunctionData) return null;
            return (
              <Polyline
                key={`${junction.id}-${connectedJunction}`}
                coordinates={[
                  { latitude: junction.lat, longitude: junction.long },
                  { latitude: connectedJunctionData.lat, longitude: connectedJunctionData.long },
                ]}
              />
            );
          })}
        </React.Fragment>
      ))}
    </MapView>
    
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default MapScreen;