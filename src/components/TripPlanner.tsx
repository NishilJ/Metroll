import React, { useState } from "react";
import {
    Flex,
    ComboBox,
    Item,
    View,
    Button,
    Heading,
    Divider,
    Text,
    useAsyncList,
    Tabs,
    TabList,
    TabPanels,
    Content
} from '@adobe/react-spectrum';

interface Place {
    type: string;
    name: string;
    id: string;
    lat: number;
    lon: number;
}

interface Trip {
    id: string;
    duration: string;
    segments: Array<{
        mode: string;
        from: string;
        to: string;
        start_time: string;
        end_time: string;
    }>;
}

const usePlaceSuggestions = () => {
    return useAsyncList<Place>({
        async load({ signal, filterText }) {
            if (!filterText) return { items: [] };
            const response: Response = await fetch(`http://motis.metroll.live/api/v1/geocode?text=${filterText}`, { signal });
            const data = await response.json();
            const places = data.map((pl: Place) => ({
                type: pl.type,
                name: pl.name,
                id: pl.id || null,
                lat: pl.lat,
                lon: pl.lon
            }));
            return { items: places.slice(0, 5) };
        }
    });
};

const getTripSuggestions = async (fromPlace: string, toPlace: string): Promise<Trip[]> => {
    const currentTime = new Date().toISOString();
    const response = await fetch(`http://motis.metroll.live/api/v1/plan?time=${currentTime}&fromPlace=${fromPlace}&toPlace=${toPlace}&arriveBy=false`);

    if (!response.ok) {
        console.error("Error fetching trip data:", response.status);
        return [];
    }

    const data = await response.json();
    if (!data.itineraries || data.itineraries.length === 0) {
        return [];
    }

    return data.itineraries.slice(0, 5).map((itinerary: any) => ({
        id: itinerary.id || "N/A",
        duration: itinerary.duration || "N/A",
        segments: itinerary.legs.map((leg: any) => ({
            mode: leg.mode,
            from: leg.from.name || "N/A",
            to: leg.to.name || "N/A",
            start_time: leg.startTime || "N/A",
            end_time: leg.endTime || "N/A"
        }))
    }));
};

const TripPlanner: React.FC = () => {
    const [fromPlace, setFromPlace] = useState<Place | null>(null);
    const [toPlace, setToPlace] = useState<Place | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTripIndex, setSelectedTripIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fromPlaceSuggestions = usePlaceSuggestions();
    const toPlaceSuggestions = usePlaceSuggestions();

    const handlePlanTripButton = async () => {
        setError(null);

        if (!fromPlace && !toPlace) {
            setError("Both origin and destination are required.");
        } else if (!fromPlace) {
            setError("Origin is required.");
        } else if (!toPlace) {
            setError("Destination is required.");
        } else {
            const tripData = await getTripSuggestions(fromPlace.id, toPlace.id);
            if (tripData.length > 0) {
                setTrips(tripData);
                setSelectedTripIndex(0);
            } else {
                setTrips([]);
                setError("No trip found. Please try different locations.");
            }
        }




    };

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        let formattedDuration = "";

        if (hours > 0) {
            formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
        }

        if (minutes > 0) {
            if (hours > 0) formattedDuration += " ";
            formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }

        return formattedDuration || "0 minutes";
    };

    return (
        <Flex direction="column" alignItems="center" gap="size-200">
            <View backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000">
                <Heading level={3}>Trip Planner</Heading>
                <Divider marginBottom="size-200" />

                <Flex direction="column" gap="size-150">
                    <ComboBox
                        label="Origin"
                        items={fromPlaceSuggestions.items}
                        inputValue={fromPlaceSuggestions.filterText}
                        onInputChange={fromPlaceSuggestions.setFilterText}
                        onSelectionChange={(key) => {
                            const selectedItem = fromPlaceSuggestions.items.find(item => item.id === key);
                            setFromPlace(selectedItem || null);
                        }}
                        loadingState={fromPlaceSuggestions.loadingState}
                        placeholder="Select origin"
                        width="100%"
                    >
                        {(item) => <Item key={item.id}>{item.name}</Item>}
                    </ComboBox>

                    <ComboBox
                        label="Destination"
                        items={toPlaceSuggestions.items}
                        inputValue={toPlaceSuggestions.filterText}
                        onInputChange={toPlaceSuggestions.setFilterText}
                        onSelectionChange={(key) => {
                            const selectedItem = toPlaceSuggestions.items.find(item => item.id === key);
                            setToPlace(selectedItem || null);
                        }}
                        loadingState={toPlaceSuggestions.loadingState}
                        placeholder="Select destination"
                        width="100%"
                    >
                        {(item) => <Item key={item.id}>{item.name}</Item>}
                    </ComboBox>

                    <Button variant="cta" onPress={handlePlanTripButton}>
                        Plan Trip
                    </Button>
                </Flex>
            </View>

            <View backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000" marginTop="size-300" maxHeight="size-3600" overflow="auto">
                {error ? (
                    <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {error}</Text>
                ) : trips.length > 0 ? (
                    <Tabs selectedKey={String(selectedTripIndex)} onSelectionChange={(key) => setSelectedTripIndex(Number(key))}>
                        <TabList>
                            {trips.map((_, index) => (
                                <Item key={String(index)}>Trip {index + 1}</Item>
                            ))}
                        </TabList>
                        <TabPanels>
                            {trips.map((trip, index) => (
                                <Item key={String(index)}>
                                    <Content>
                                        <Heading level={4}>Trip Details</Heading>
                                        <Text><strong>Duration:</strong> {formatDuration(Number(trip.duration))}</Text>
                                        <Divider marginY="size-150" />
                                        {trip.segments.map((segment, segIndex) => (
                                            <View key={segIndex} marginBottom="size-200">
                                                <Text>
                                                    <strong>{segIndex === 0 ? "START: " : ""}{segment.mode}{segIndex === trip.segments.length - 1 ? " END" : ""}</strong> - {new Date(segment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                                <Text><br />{segment.from} <br /> to <br /> {segment.to}</Text>
                                                <Divider size="S" marginTop="size-150" />
                                            </View>
                                        ))}
                                    </Content>
                                </Item>
                            ))}
                        </TabPanels>
                    </Tabs>
                ) : (
                    <Text>Enter an Origin and Destination to receive a planned trip.</Text>
                )}
            </View>
        </Flex>
    );
};

export default TripPlanner;
