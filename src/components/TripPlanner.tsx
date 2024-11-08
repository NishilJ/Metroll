// Worked on by Yoel and Nishil

import React, { useState, useEffect, useRef } from 'react';
import { Flex, TextField, Button, View, Heading } from '@adobe/react-spectrum';
import './TripPlanner.css'; // Import custom CSS for styling

const TripPlanner: React.FC = () => {
  interface SuggestionProps {
    name: string;
    lat: number;
    lon: number;
    id: string;
  }

  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [startSuggestions, setStartSuggestions] = useState<SuggestionProps[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<SuggestionProps[]>([]);
  const [startDetails, setStartDetails] = useState<{ lat: number; lon: number; id: string } | null>(null);
  const [endDetails, setEndDetails] = useState<{ lat: number; lon: number; id: string } | null>(null);

  // Refs for suggestion containers
  const startSuggestionsRef = useRef<HTMLDivElement>(null);
  const endSuggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch location suggestions (Station Guesser)
  const fetchLocationSuggestions = async (input: string) => {
      const response = await fetch(`http://motis.metroll.live/api/v1/geocode?text=${input}`);
      const data = await response.json();
      return data.map((loc: { name: string; lat: number; lon: number; id: string }) => ({
        name: loc.name,
        lat: loc.lat,
        lon: loc.lon,
        id: loc.id,
      }));
  };

  // Effect to fetch suggestions for start location
  useEffect(() => {
    if (startLocation) {
      const getSuggestions = async () => {
        const suggestions = await fetchLocationSuggestions(startLocation);
        setStartSuggestions(suggestions);
      };
      getSuggestions();
    } else {
      setStartSuggestions([]); // Clear suggestions if input is empty
    }
  }, [startLocation]);

  // Effect to fetch suggestions for end location
  useEffect(() => {
    if (endLocation) {
      const getSuggestions = async () => {
        const suggestions = await fetchLocationSuggestions(endLocation);
        setEndSuggestions(suggestions);
      };
      getSuggestions();
    } else {
      setEndSuggestions([]); // Clear suggestions if input is empty
    }
  }, [endLocation]);

  // Fetch trip itinerary using MOTIS
  const fetchTripItinerary = async () => {

    if (!startDetails?.id || !endDetails?.id) {
      alert('Please select a valid start and end location');
      return;
    }

    // Fetch trip details if ids are valid
    const response = await fetch(
        `http://motis.metroll.live/api/v1/plan?time=2024-10-28T01%3A22%3A00.000Z&fromPlace=${startDetails.id}&toPlace=${endDetails.id}&arriveBy=false&timetableView=true&wheelchair=false&mode=TRANSIT,WALK`,
        { method: 'GET' }
    );

    const data = await response.json();
    if (data) {
      setTripDetails(data); // Set trip details if data is valid
    } else {
      setTripDetails(null); // Clear trip details if no valid trip data is found
    }

  };

  // Handle clicks outside of suggestion boxes to close them
  const handleClickOutside = (event: MouseEvent) => {
    if (startSuggestionsRef.current && !startSuggestionsRef.current.contains(event.target as Node)) {
      setStartSuggestions([]);
    }
    if (endSuggestionsRef.current && !endSuggestionsRef.current.contains(event.target as Node)) {
      setEndSuggestions([]);
    }
  };

  useEffect(() => {
    // Add event listener for click events
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Flex>
      {/* Left Side: Trip Planner Form */}
      <View padding="size-200" width="40%">
        <Heading level={2}>Trip Planner</Heading>
        <Flex direction="column" gap="size-200">
          <div className="autocomplete-container" ref={startSuggestionsRef}>
            <TextField

              placeholder="Origin"
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
                      setStartLocation(suggestion.name);
                      setStartDetails({ lat: suggestion.lat, lon: suggestion.lon, id: suggestion.id });
                      setStartSuggestions([]); // Clear suggestions on selection
                    }}
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="autocomplete-container" ref={endSuggestionsRef}>
            <TextField
              //label="Destination"
              placeholder="Destination"
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
                      setEndLocation(suggestion.name);
                      setEndDetails({ lat: suggestion.lat, lon: suggestion.lon, id: suggestion.id });
                      setEndSuggestions([]); // Clear suggestions on selection
                    }}
                  >
                    {suggestion.name}
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

      {/* Right Side: Trip Details */}
      <View padding="size-200" width="60%">
        <Heading level={3}>Trip Details</Heading>
        {tripDetails && (
          <View>
            {/* testing if working */}
            {<pre>{JSON.stringify(tripDetails, null, 2)}</pre>}
          </View>
        )}
      </View>
    </Flex>
  );
};

export default TripPlanner;
