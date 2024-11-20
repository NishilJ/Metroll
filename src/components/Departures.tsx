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
    name: string;
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

// Function to fetch departures for a given stop
const fetchDepartures = async (stopId: string, time: string) => {
    const res = await fetch(
        `http://motis.metroll.live/api/v1/stoptimes?stopId=${stopId}&time=${time}&arriveBy=false&n=10`
    );
    const data = await res.json();
    return data.stopTimes || [];
};

const Departures: React.FC = () => {
    const [showDeparturesHeading, setShowDeparturesHeading] = useState(false);
    const [loadingDepartures, setLoadingDepartures] = useState<boolean>(false);
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showFavoritesMenu, setShowFavoritesMenu] = useState(false); // State to toggle favorites menu
    const [selectedFavoriteStop] = useState<{ name: string } | null>(null);
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });
    const currentDate = new Date();

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);



    // for favorites button/toggle

    const [selectedDate, setSelectedDate] = useState(
        new CalendarDateTime(
            //default calender values
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()
        )
    );

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

/*
// Validates the selected date and time
    const validateDateAndTime = (): string | null => {
        if (!selectedDate || !selectedDate.toString()) {
            return 'Please select a valid date and time.';
        }

        const formattedTime = moment(selectedDate.toString()).toISOString();
        const currentTime = moment().subtract(30, 'minutes');
        const selectedMoment = moment(formattedTime);

        if (!selectedMoment.isValid()) {
            return 'Invalid date/time entered.';
        }
        if (selectedMoment.isBefore(currentTime)) {
            return 'Selected time is in the past. Please choose a future time.';
        }
        if (!isValidCustomDate(selectedMoment)) {
            return 'Selected date is too far away. Please choose a closer time to today.';
        }

        return null; // No validation errors
    };
*/


// Main method to handle departure fetching
    // error handling for departure
    const handleGetDepartures = async () => {
        if (!selectedStop) {
            setError('Please select a stop.');
            return;
        }


        setLoadingDepartures(true); // Set loading state for departures
        //setHasClickedGetDepartures(true); // Mark that the button was clicked
        setShowDeparturesHeading(true);
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
            const departures1 = await fetchDepartures(selectedStop.id, formattedTime);
            if (departures1.length === 0) {
                setError('This stop does not exist.');
            } else {
                setDepartures(departures1);
            }
        } catch (error) {
            setError('Failed to load departures.');
            console.error(error);
        }
        finally{
            setLoadingDepartures(false); // Reset loading state after fetch

        }
    };


    const handleFavoriteClick = (fav: string) => {
        // Set the filterText to the selected favorite stop name
        stopSuggestions.setFilterText(fav);

        // Find the corresponding stop and set it as selected
        const favoriteStop = stopSuggestions.items.find((item) => item.name === fav);
        setSelectedStop(favoriteStop || null);
    };



    // Dynamically determine which stop to display
    const outputStop = selectedFavoriteStop || selectedStop;
    // Use departures if outputStop doesn't manage its own
    const outputDepartures = departures;




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
                    <Button
                        variant="secondary"
                        onPress={() => setShowFavoritesMenu((prev) => !prev)} // Toggle the favorites menu
                    >
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
                    <Button variant="cta" UNSAFE_style={{
                        backgroundColor: "#f68511",
                    }} onPress={handleGetDepartures}>Get Departures</Button>
                    <DatePicker
                        label="Select a Date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        width="100%"
                        marginTop="size-200"
                    />
                </Flex>

                {/* Conditional rendering for Favorites section */}
                {showFavoritesMenu && (
                    <View
                        backgroundColor="gray-100"
                        padding="size-300"
                        borderRadius="medium"
                        marginTop="size-200"
                    >
                        <Heading level={4}>Favorites</Heading>
                        <Divider marginBottom="size-200" />
                        {favorites.length > 0 ? (
                            favorites.map((fav: string, idx: number) => (
                                <Button
                                    key={idx}
                                    onPress={() => {
                                        // Automatically set the search input to the favorite stop
                                        handleFavoriteClick(fav);  // Fetch departures automatically after selecting a favorite stop
                                    }}
                                    width="100%"
                                    marginBottom="size-100"
                                    variant="secondary"
                                >
                                    {fav}
                                </Button>
                            ))
                        ) : (
                            <Text>No favorites added yet.</Text>
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
                {/* Error handling and departures rendering */}
                {error && <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {error}</Text>}

                {/* Base message or error message based on the state */}
                {!stopSuggestions.filterText && !error && (
                    <Text marginTop="size-200" UNSAFE_style={{ fontStyle: 'italic', color: 'gray' }}>
                        Search a stop to find more information
                    </Text>
                )}

                {/* Display "Loading departures..." or results */}
                {loadingDepartures ? (
                    <Text>Loading Departures</Text>
                ) : (
                    !error && outputStop && outputStop === selectedStop && outputDepartures.length > 0 && (
                        <>
                            <Flex direction="row" justifyContent="space-between" alignItems="center" marginBottom="size-200">
                                {showDeparturesHeading && (
                                    <Heading level={2} marginTop="size-200" UNSAFE_style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                                        Departure Information for Stop
                                    </Heading>
                                )}
                                <Button
                                    variant="primary"

                                    onPress={() => {
                                        if (favorites.includes(outputStop.name)) {
                                            setFavorites(favorites.filter((fav: string) => fav !== outputStop.name));
                                        } else {
                                            setFavorites([...favorites, outputStop.name]);
                                        }
                                    }}
                                    marginStart="size-200"
                                    marginTop="0"
                                >
                                    {favorites.includes(outputStop.name) ? 'Remove from Favorites' : 'Add to Favorites'}
                                </Button>
                            </Flex>
                            <Divider marginBottom="size-200" />
                            {outputDepartures.map((selectedStop, idx) => {
                                const arrivalTime = selectedStop.place?.arrival;

                                return (
                                    <View key={idx} marginBottom="size-200" padding="size-200" backgroundColor="gray-200" borderRadius="medium">
                                        <Text>
                                            <strong>Route:</strong> {selectedStop.routeShortName} <br />
                                            <strong>Headsign:</strong> {selectedStop.headsign} <br />
                                            <strong>Arrival Time:</strong> {arrivalTime ? formatTime(arrivalTime) : 'N/A'}
                                        </Text>
                                    </View>
                                );
                            })}
                        </>
                    )
                )}
            </View>
        </Flex>
    );


};
export default Departures;
