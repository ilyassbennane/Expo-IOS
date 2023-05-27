import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

// Header component
const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>A M I S T A</Text>
    </View>
  );
};


// Footer component
const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2023 Amista. All rights reserved.</Text>
    </View>
  );
};

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedRestaurantLocation, setSelectedRestaurantLocation] = useState({
    latitude: 35,
    longitude: 33,
  });
  const [totalScore, setTotalScore] = useState(null);
  const [selectedRestaurantAddress, setSelectedRestaurantAddress] = useState('');
  const [selectedRestaurantStreet, setSelectedRestaurantStreet] = useState('');

  const mapRef = useRef(null);

  const handleCitySelect = (value) => {
    setSelectedCity(value);
    setSelectedZone('');
    setSelectedRestaurant('');
    setTotalScore(null);
  };

  const handleZoneSelect = (value) => {
    setSelectedZone(value);
    setSelectedRestaurant('');
    setTotalScore(null);
  };

  const handleRestaurantSelect = (value) => {
    setSelectedRestaurant(value.value);
    setSelectedRestaurantLocation({
      latitude: value.location.lat,
      longitude: value.location.lng,
    });
    setSelectedRestaurantAddress(value.address);
    setSelectedRestaurantStreet(value.street);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: value.location.lat,
        longitude: value.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }

    axios
      .get(`https://data-hazel-six.vercel.app/restaurants/${selectedCity}`)
      .then((res) => {
        const selectedCityData = res.data.find(
          (restaurant) => restaurant._id === value.value
        );
        if (selectedCityData) {
          setTotalScore(selectedCityData.totalScore);
        }
      });
  };

  useEffect(() => {
    if (selectedCity && selectedZone) {
      const startIndex = (selectedZone - 1) * 20;
      const endIndex = selectedZone * 20;
      axios
        .get(`https://data-hazel-six.vercel.app/restaurants/${selectedCity}`)
        .then((res) => {
          const uniqueItems = res.data
            .slice(startIndex, endIndex)
            .map((restaurant) => ({
              label: restaurant.title,
              value: restaurant._id,
              location: {
                lat: restaurant.location.lat,
                lng: restaurant.location.lng,
              },
              address: restaurant.address,
              street: restaurant.street,
            }))
            .filter((item, index, self) => {
              return index === self.findIndex((i) => i.value === item.value);
            });

          setRestaurants(res.data.slice(startIndex, endIndex));
          setItems3(uniqueItems);
        });
    }
  }, [selectedCity, selectedZone]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);

  const [items, setItems] = useState([
    { label: 'Select a city', value: '', key: 'city-select' },
    { label: 'Casablanca', value: 'Casablanca', key: 'casablanca' },
    { label: 'Tanger', value: 'Tanger', key: 'tanger' },
    { label: 'El Jadida', value: 'El Jadida', key: 'el-jadida' },
  ]);

  const [items2, setItems2] = useState([
    { label: 'Select a zone', value: '', key: 'zone-select' },
    { label: 'Zone 1', value: '1', key: 'zone-1' },
    { label: 'Zone 2', value: '2', key: 'zone-2' },
    { label: 'Zone 3', value: '3', key: 'zone-3' },
    { label: 'Zone 4', value: '4', key: 'zone-4' },
  ]);

  const [items3, setItems3] = useState([]);
  return (
    <SafeAreaView style={styles.container}>
      <Header /> 


      <View style={styles.content} >
        <Text  style={styles.label}>Select a city</Text>
        <DropDownPicker 
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          defaultValue={selectedCity}
          onChangeValue={(value) => handleCitySelect(value)}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          arrowColor="#000"
          zIndex={2000}
          elevation={3}
        />

        <Text  style={styles.label}>Select a zone</Text>
        <DropDownPicker  
          open={open2}
          value={value2}
          items={items2}
          setOpen={setOpen2}
          setValue={setValue2}
          setItems={setItems2}
          defaultValue={selectedZone}
          onChangeValue={(value) => handleZoneSelect(value)}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          arrowColor="#000"
          zIndex={1500}
          elevation={2}
        />

        <Text   style={styles.label}>Select a restaurant</Text>
        <DropDownPicker 
          open={open3}
          value={value3}
          items={items3}
          setOpen={setOpen3}
          setValue={setValue3}
          setItems={setItems3}
          defaultValue={selectedRestaurant}
          onChangeValue={(newValue) => setValue3(newValue)}
          onSelectItem={(value) => handleRestaurantSelect(value)}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          arrowColor="#000"
          zIndex={1000}
          elevation={1}
        />

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: selectedRestaurantLocation.latitude,
              longitude: selectedRestaurantLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {selectedRestaurantLocation.latitude && (
              <Marker
                coordinate={{
                  latitude: selectedRestaurantLocation.latitude,
                  longitude: selectedRestaurantLocation.longitude,
                }}
                title="Selected Restaurant"
                description="This is the selected restaurant"
              />
            )}
          </MapView>
        </View>

        {selectedRestaurant && (
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantAddress}>
              Address: {selectedRestaurantAddress}
            </Text>
            <Text style={styles.totalScoreText}>
      Total Score:{' '}
      {[...Array(5)].map((_, index) => (
        <Text key={index} style={index < totalScore ? styles.yellowStar : styles.blackStar}>
          ★
        </Text>
      ))}
    </Text>
          </View>
        )}
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdownContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    zIndex: 1000, // Adjust the zIndex to control the dropdown's layering
  },
  dropdownText: {
    fontSize: 16,
    textAlign: 'center', // Add textAlign to center the text in the dropdown
  },
  mapContainer: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  restaurantDetails: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantStreet: {
    fontSize: 16,
    marginBottom: 5,
  },
  restaurantScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  yellowStar: {
    color: 'black',
  },
  blackStar: {
    color: 'gray',
  },
  footer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
});