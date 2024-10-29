// Worked on by Yoel
import React, { useState, useEffect, useRef } from 'react';
import { Flex, TextField, Button, View, Heading } from '@adobe/react-spectrum';
import './TripPlanner.css'; // Import custom CSS for styling

const TripPlanner: React.FC = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);

  // Refs for suggestion containers
  const startSuggestionsRef = useRef<HTMLDivElement>(null);
  const endSuggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch location suggestions (Station Guesser)
  const fetchLocationSuggestions = async (input: string) => {
    const response = await fetch(`https://europe.motis-project.de/api/v1/geocode?text=${input}&language=en`);
    const data = await response.json();
    return data; // Assuming the API response contains the location names
  };

  // Effect to fetch suggestions for start location
  useEffect(() => {
    if (startLocation) {
      const getSuggestions = async () => {
        const suggestions = await fetchLocationSuggestions(startLocation);
        setStartSuggestions(suggestions.map((loc: any) => loc.name)); // Adjust based on actual structure
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
        setEndSuggestions(suggestions.map((loc: any) => loc.name)); // Adjust based on actual structure
      };
      getSuggestions();
    } else {
      setEndSuggestions([]); // Clear suggestions if input is empty
    }
  }, [endLocation]);

  // Fetch trip itinerary using MOTIS
  const fetchTripItinerary = async () => {
    if (!startLocation || !endLocation) {
      alert('Please enter both start and end locations');
      return;
    }

    // Placeholder for actual coordinates
    const fromCoordinates = '48.8534951,2.3483915'; // Replace with actual coordinates of startLocation
    const toCoordinates = 'eu-blablacar-bus_XCA'; // Replace with actual coordinates of endLocation

    const response = await fetch(`https://europe.motis-project.de/api/v1/plan?time=2024-10-28T01%3A22%3A00.000Z&fromPlace=${fromCoordinates}&toPlace=${toCoordinates}&arriveBy=false&timetableView=true&wheelchair=false&mode=TRANSIT,WALK`, {
      method: 'GET',
    });

    const data = await response.json();
    setTripDetails(data); // Display the trip data
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
                      setStartSuggestions([]); // Clear suggestions on selection
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
                      setEndSuggestions([]); // Clear suggestions on selection
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

      {/* Right Side: Trip Details */}
      <View padding="size-200" width="60%">
        <Heading level={3}>Trip Details</Heading>
        {tripDetails && (
          <View>
            {/* Display a simple message instead of the full details */}
            <p>Trip info found.</p>
            {/* Uncomment the line below to see the detailed trip info again if needed */}
            {/* <pre>{JSON.stringify(tripDetails, null, 2)}</pre> */}
          </View>
        )}
      </View>
    </Flex>
  );
};

export default TripPlanner;
