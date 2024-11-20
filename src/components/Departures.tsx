import React, {useEffect, useState} from 'react';
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
    DatePicker,
} from '@adobe/react-spectrum';
import moment from 'moment-timezone';
import { CalendarDateTime } from '@internationalized/date';
import { Moment } from 'moment/moment';

interface Stop {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface Departure {
    routeShortName: string;
    headsign: string;
    place: {
        arrival: string;
    };
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

// Function to fetch stations near the user's location (NOT WORKING)
const fetchNearbyStations = async (latitude: number, longitude: number) => {
    try {
        // need working API call for lat and lon lines
        const res = await fetch(`http://motis.metroll.live/api/v1/stations?lat=${latitude}&lng=${longitude}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching nearby stations:', error);
        return [];
    }
};

// Function to fetch departures for a given stop
const fetchDepartures = async (stopId: string, time: string) => {
    const res = await fetch(
        `http://motis.metroll.live/api/v1/stoptimes?stopId=${stopId}&time=${time}&arriveBy=false&n=10`
    );
    const data = await res.json();
    return data.stopTimes || [];
};

const Departures: React.FC = () => {
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const currentDate = new Date();

    // for favorites button/toggle
    const [favoriteStops, setFavoriteStops] = useState<string[]>(() => {
        const storedFavorites = localStorage.getItem('favoriteStops');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });

    const [selectedDate, setSelectedDate] = useState(
        new CalendarDateTime(
            //default calander values
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()
        )
    );

    const [showFavorites, setShowFavorites] = useState(false); // New state for toggling favorites display
    const stopSuggestions = useStopSuggestions();


    const customStartDate = moment('2024-11-18');
    const customEndDate = moment('2025-1-5');

    const isValidCustomDate = (date: string | Moment): boolean => {
        const momentDate = moment(date);
        return momentDate.isValid() && momentDate.isBetween(customStartDate, customEndDate, null, '[]');
    };

    const formatTime = (time: string) => {
        return moment.utc(time).tz('America/Chicago').format('MM/DD/YYYY hh:mm:ss A');
    };

    //obtain user position (WORKING, look at console log for explanation)
    const handleGetLocation = async () => {
        console.log('Starting to get location...'); // Initial log to indicate function start

        if (navigator.geolocation) {
            console.log('Geolocation is supported by this browser.');

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Geolocation success:', { latitude, longitude }); // Log coordinates

                    try {
                        const nearbyStations = await fetchNearbyStations(latitude, longitude);
                        console.log('Fetched nearby stations:', nearbyStations); // Log fetched stations

                        if (nearbyStations.length === 0) {
                            console.log('No nearby stations found.'); // Log if no stations found
                            setLocationError('No nearby stations found.');
                        } else {
                            setLocationError(null);
                            setSelectedStop(nearbyStations[0] || null);
                            console.log('Selected stop set to:', nearbyStations[0] || null); // Log selected stop
                        }
                    } catch (error) {
                        console.error('Error fetching nearby stations:', error); // Log if fetching fails
                        setLocationError('Failed to fetch nearby stations.');
                    }
                },
                (err) => {
                    console.error('Geolocation error:', err.message); // Log geolocation error
                    setLocationError('Geolocation error: ' + err.message);
                }
            );
        } else {
            console.warn('Geolocation is not supported by this browser.'); // Log warning if unsupported
            setLocationError('Geolocation is not supported by this browser.');
        }
    };


    // error handling for departure
    const handleGetDepartures = async () => {
        if (!selectedStop) {
            setError('Please select a stop.');
            return;
        }

        if (!selectedDate || !selectedDate.toString()) {
            setError('Please select a valid date and time.');
            return;
        }

        const formattedTime = moment(selectedDate.toString()).toISOString();
        const currentTime = moment().subtract(30, 'minutes');
        const selectedMoment = moment(formattedTime);

        if (!selectedMoment.isValid()) {
            setError('Invalid date/time entered');
            return;
        }

        if (selectedMoment.isBefore(currentTime)) {
            setError('Selected time is in the past. Please choose a future time.');
            return;
        }

        if (!isValidCustomDate(selectedMoment)) {
            setError('Selected date is too far away. Please choose a closer time to today.');
            return;
        }

        setError(null);

        try {
            const departures = await fetchDepartures(selectedStop.id, formattedTime);
            if (departures.length === 0) {
                setError('No departures available for this stop.');
            } else {
                setDepartures(departures);
            }
        } catch (error) {
            setError('Failed to load departures.');
            console.error(error);
        }
    };

    // Function to toggle favorite status with typed parameter
    const toggleFavorite = (stopId: string) => {
        setFavoriteStops((prevFavorites) => {
            if (prevFavorites.includes(stopId)) {
                return prevFavorites.filter((id) => id !== stopId); // Remove from favorites
            } else {
                return [...prevFavorites, stopId]; // Add to favorites
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('favoriteStops', JSON.stringify(favoriteStops));
    }, [favoriteStops]);



    const handleListFavorites = () => {
        setShowFavorites((prevState) => !prevState); // Toggle the state to show/hide favorites

        const favoriteStopNames = favoriteStops.map(stopId => {
            const favoriteStop = stopSuggestions.items.find((item) => item.id === stopId);
            return favoriteStop ? favoriteStop.name : '';
        }).join(', ');

    };


    return (
        <Flex direction="row" gap="size-200" alignItems="start" wrap="nowrap" width="100%">
            {/* First box for the ComboBox and Buttons */}
            <View
                backgroundColor="gray-100"
                padding="size-300"
                borderRadius="medium"
                flex="1"
                overflow="auto"
                marginTop={25}
                marginX={25}
                maxHeight="80vh"
            >
                <Flex direction="row" justifyContent="space-between" alignItems="center">
                    <Heading level={3}>Stop Departures</Heading>
                    {/* Button placed next to the title */}
                    <Button variant="secondary" onPress={handleListFavorites}>
                        Toggle Favorites Menu
                    </Button>
                </Flex>
                <Divider marginBottom="size-200" />
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
                <Flex direction="column" gap="size-200" marginTop={25}>
                    <Button variant="cta" onPress={handleGetDepartures}>Get Departures</Button>
                    <Button variant="cta" onPress={handleGetLocation} width="100%" marginBottom="size-100" alignSelf={"center"}>
                        Get Nearest Stops
                    </Button>
                    <DatePicker
                        label="Select a Date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        width="100%"
                        marginTop="size-200"
                    />
                </Flex>

                {/* Divider and Favorites section */}
                {showFavorites && (
                    <View padding="size-300">
                        <Heading level={4}>Favorites</Heading>
                        <Divider marginBottom="size-800" />
                        {favoriteStops.length === 0 ? (
                            <Text>No favorite stops yet.</Text>
                        ) : (
                            favoriteStops.map((stopId) => {
                                const favoriteStop = stopSuggestions.items.find((item) => item.id === stopId);

                                return (
                                    favoriteStop && (
                                        <View key={favoriteStop.id} marginBottom="size-200" padding="size-200" backgroundColor="gray-200" borderRadius="medium">
                                            <Text>
                                                <strong>Favorites here:</strong>  <br />
                                                {/* Add more information as needed */}
                                            </Text>
                                        </View>
                                    )
                                );
                            })
                        )}
                    </View>
                )}
            </View>

            {/* Second box for departures information */}
            <View
                backgroundColor="gray-100"
                padding="size-300"
                paddingTop="size-200"
                borderRadius="medium"
                flex="2"
                overflow="auto"
                marginTop={25}
                marginX={25}
                maxHeight="65vh"
            >
                {/*regular react because spectrum is dumb w/ colored text*/}
                {locationError && <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {locationError}</Text>}
                {error && <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {error}</Text>}

                {!error && !locationError && selectedStop && departures.length > 0 && (
                    <>
                        <Flex direction="row" justifyContent="space-between" alignItems="center" marginBottom="size-200">
                            <Heading level={4}>
                                Departures for: {selectedStop.name}
                            </Heading>
                            <Button
                                variant="primary"
                                onPress={() => toggleFavorite(selectedStop.id)}
                                marginStart="size-200" // Adds space between the heading and button
                                marginTop="0"          // Removes extra top margin
                            >
                                {favoriteStops.includes(selectedStop.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                            </Button>
                        </Flex>
                        <Divider marginBottom="size-200" />
                        {departures.map((departure, idx) => {
                            const arrivalTime = departure.place?.arrival;
                            return (
                                <View key={idx} marginBottom="size-200" padding="size-200" backgroundColor="gray-200" borderRadius="medium">
                                    <Text>
                                        <strong>Route:</strong> {departure.routeShortName} <br />
                                        <strong>Headsign:</strong> {departure.headsign} <br />
                                        <strong>Arrival Time:</strong> {arrivalTime ? formatTime(arrivalTime) : 'N/A'}
                                    </Text>
                                </View>
                            );
                        })}
                    </>
                )}
            </View>
        </Flex>

    );
};

export default Departures;
