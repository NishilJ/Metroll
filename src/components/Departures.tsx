import React, { useState } from 'react';
import {
    ComboBox,
    Item,
    Button,
    Flex,
    View,
    Heading,
    Text,
    Divider,
    useAsyncList,
} from '@adobe/react-spectrum';

interface Stop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface Departure {
    routeShortName: string;
    headsign: string;
    departure: string;
}

const useStopSuggestions = () => {
    return useAsyncList<Stop>({
        async load({ filterText, signal }) {
            if (!filterText) return { items: [] };
            const res: Response = await fetch(`http://motis.metroll.live/api/v1/geocode?text=${filterText}`, { signal });
            const data = await res.json();
            return { items: data.slice(0, 5) };
        },
    });
};

// Function to fetch stations near the user's location
const fetchNearbyStations = async (latitude: number, longitude: number) => {
    try {
        // Example API call - update with actual endpoint if necessary
        const res = await fetch(`http://motis.metroll.live/api/v1/stations?lat=${latitude}&lng=${longitude}`);
        const data = await res.json();

        console.log('Nearby stations:', data);
        return data; // Return station data
    } catch (error) {
        console.error('Error fetching nearby stations:', error);
        return [];
    }
};

// Function to fetch departures for a given stop
const fetchDepartures = async (stopId: string) => {
    const res = await fetch(
        `http://motis.metroll.live/api/v1/stoptimes?stopId=${stopId}&arriveBy=false&n=10`
    );
    const data = await res.json();
    return data.stopTimes || [];
};

const Departures: React.FC = () => {
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const stopSuggestions = useStopSuggestions();

    const handleGetLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Fetch nearest stations based on the user's location
                        const nearbyStations = await fetchNearbyStations(latitude, longitude);
                        console.log('Nearby Stations:', nearbyStations);
                        setLocationError(null); // Reset location error
                        // You can select the nearest station or update your UI here
                        setSelectedStop(nearbyStations[0] || null); // Example: Select the first station
                    } catch {
                        setLocationError('Failed to fetch nearby stations.');
                    }
                },
                (err) => {
                    setLocationError('Geolocation error: ' + err.message);
                }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
        }
    };

    const handleGetDepartures = async () => {
        if (!selectedStop) {
            setError('Please select a stop.');
            return;
        }

        try {
            setError(null);
            const departures = await fetchDepartures(selectedStop.id);
            console.log('Fetched Departures:', departures);
            setDepartures(departures);
        } catch {
            setError('Failed to load departures.');
        }
    };

    //const formatTime = (time: string) => utc(time).local().format('DD/MM/YYYY HH:mm:ss');

    return (
        <Flex direction="column" alignItems="center" gap="size-200">
            <View backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000">
                <Heading level={3}>Stop Departures</Heading>
                <Divider marginBottom="size-200" />

                <Button variant="cta" onPress={handleGetLocation} marginTop="size-200">
                    Get Nearest Stops
                </Button>

                {locationError && <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {locationError}</Text>}

                <ComboBox
                    label="Stop"
                    items={stopSuggestions.items}
                    inputValue={stopSuggestions.filterText}
                    onInputChange={stopSuggestions.setFilterText}
                    onSelectionChange={(key) => setSelectedStop(stopSuggestions.items.find(item => item.id === key) || null)}
                    loadingState={stopSuggestions.loadingState}
                    placeholder="Select a stop"
                    width="100%"
                >
                    {(item) => <Item key={item.id}>{item.name}</Item>}
                </ComboBox>

                <Button variant="cta" onPress={handleGetDepartures} marginTop="size-200">
                    Get Departures
                </Button>
            </View>

            <View marginTop="size-300" backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000">
                {error && <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {error}</Text>}
                {!error && departures.length === 0 && <Text>Enter a stop to receive information.</Text>}
                {departures.map((departure, idx) => {
                    console.log(`Departure ${idx + 1}:`, departure);
                    return (
                        <View key={idx} marginBottom="size-200" padding="size-200" backgroundColor="gray-200" borderRadius="medium">
                            <Text>
                                <strong>Route:</strong> {departure.routeShortName} <br />
                                <strong>Headsign:</strong> {departure.headsign} <br />
                                <strong>Departure:</strong> {departure.departure}
                            </Text>
                            <Divider size="S" marginTop="size-150" />
                        </View>
                    );
                })}
            </View>
        </Flex>
    );
};

export default Departures;
