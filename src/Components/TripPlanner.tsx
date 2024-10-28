// Worked on by Yoel

import React, { useState, useEffect, useRef } from 'react';
import { Flex, TextField, Button, View, Heading } from '@adobe/react-spectrum';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './TripPlanner.css';

// Configure default marker icon for Leaflet
const defaultIcon = L.icon({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
L.Marker.prototype.options.icon = defaultIcon;

const TripPlanner: React.FC = () => {
  // Location and suggestion states
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [startCoordinates, setStartCoordinates] = useState<[number, number] | null>(null);
  const [endCoordinates, setEndCoordinates] = useState<[number, number] | null>(null);
  const [tripDetails, setTripDetails] = useState<any>(null);

  // Refs to close suggestion boxes when clicking outside
  const startSuggestionsRef = useRef<HTMLDivElement>(null);
  const endSuggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch location suggestions based on user input
  const fetchLocationSuggestions = async (input: string) => {
    const response = await fetch(`https://europe.motis-project.de/api/v1/geocode?text=${input}&language=en`);
    const data = await response.json();
    return data; // Assuming the API returns locations
  };

  // Effect to update suggestions for start location
  useEffect(() => {
    if (startLocation) {
      const getSuggestions = async () => {
        const suggestions = await fetchLocationSuggestions(startLocation);
        setStartSuggestions(suggestions.map((loc: any) => loc.name)); // Adjust based on response structure
      };
      getSuggestions();
    } else {
      setStartSuggestions([]);
    }
  }, [startLocation]);

  // Effect to update suggestions for end location
  useEffect(() => {
    if (endLocation) {
      const getSuggestions = async () => {
        const suggestions = await fetchLocationSuggestions(endLocation);
        setEndSuggestions(suggestions.map((loc: any) => loc.name)); // Adjust based on response structure
      };
      getSuggestions();
    } else {
      setEndSuggestions([]);
    }
  }, [endLocation]);

  // Plan the trip using MOTIS API
  const fetchTripItinerary = async () => {
    if (!startLocation || !endLocation) {
      alert('Please enter both start and end locations');
      return;
    }

    // Mock coordinates for demonstration; replace with actual values
    const fromCoordinates = '48.8534951,2.3483915';
    const toCoordinates = 'eu-blablacar-bus_XCA';

    // Set coordinates for the start and end markers on the map
    setStartCoordinates([48.8534951, 2.3483915]);
    setEndCoordinates([48.8566, 2.3522]);

    // Fetch trip itinerary from MOTIS API
    const response = await fetch(`https://europe.motis-project.de/api/v1/plan?time=2024-10-28T01%3A22%3A00.000Z&fromPlace=${fromCoordinates}&toPlace=${toCoordinates}&arriveBy=false&timetableView=true&wheelchair=false&mode=TRANSIT,WALK`, {
      method: 'GET',
    });

    const data = await response.json();
    setTripDetails(data);
  };

  // Close suggestion boxes when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (startSuggestionsRef.current && !startSuggestionsRef.current.contains(event.target as Node)) {
      setStartSuggestions([]);
    }
    if (endSuggestionsRef.current && !endSuggestionsRef.current.contains(event.target as Node)) {
      setEndSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Flex>
      {/* Trip Planner Form */}
      <View padding="size-200" width="40%">
        <Heading level={2}>Trip Planner</Heading>
        <Flex direction="column" gap="size-200">
          <div className="autocomplete-container" ref={startSuggestionsRef}>
            <TextField
              label="Start Location"
              placeholder="Enter starting point"
              value={startLocation}
              onChange={setStartLocation}
            />
            {startSuggestions.length > 0 && (
              <div className="suggestions">
                {startSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item" 
                    onClick={() => {
                      setStartLocation(suggestion);
                      setStartSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="autocomplete-container" ref={endSuggestionsRef}>
            <TextField
              label="Destination"
              placeholder="Enter destination"
              value={endLocation}
              onChange={setEndLocation}
            />
            {endSuggestions.length > 0 && (
              <div className="suggestions">
                {endSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item" 
                    onClick={() => {
                      setEndLocation(suggestion);
                      setEndSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button variant="cta" onPress={fetchTripItinerary}>
            Plan Trip
          </Button>
        </Flex>
      </View>

      {/* Map View */}
      <View padding="size-200" width="60%">
        <Heading level={3}>Map</Heading>
        <MapContainer center={startCoordinates || [48.8534951, 2.3483915]} zoom={13} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {startCoordinates && (
            <Marker position={startCoordinates}>
              <Popup>{startLocation}</Popup>
            </Marker>
          )}
          {endCoordinates && (
            <Marker position={endCoordinates}>
              <Popup>{endLocation}</Popup>
            </Marker>
          )}
        </MapContainer>

        {tripDetails && (
          <View>
            <p>Trip info found.</p>
            {/* Uncomment the line below to see the detailed trip info */}
            {/* <pre>{JSON.stringify(tripDetails, null, 2)}</pre> */}
          </View>
        )}
      </View>
    </Flex>
  );
};

export default TripPlanner;
