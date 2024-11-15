// Worked on by Yoel and Nishil
import React, {useState} from "react";
import {
    Flex,
    ComboBox,
    Item,
    View,
    Button,
    useAsyncList,
    ListBox,
    Text,
    Content,
    Heading,
    Divider
} from '@adobe/react-spectrum';
import {wait} from "@testing-library/user-event/dist/utils";

interface Place {
    type: string,
    name: string,
    id: string,
    lat: number,
    lon: number;
}

interface Trip {
    id: string;
    duration: number; // Duration in seconds
    startTime: string; // ISO timestamp of start time
    endTime: string; // ISO timestamp of end time
    transfers: number; // Number of transfers
    legs: Leg[]; // List of legs

}

interface Leg {
    mode: string; // e.g., "BUS", "TRAIN", "WALK"
    from: Place; // Starting location details
    to: Place; // Destination location details
    duration: number; // Duration in seconds
    startTime: string; // ISO timestamp of start time
    endTime: string; // ISO timestamp of end time
    distance: number; // Distance in meters (optional if unknown)
    headsign: string; // Vehicle headsign
    tripId: string; // Unique ID for the trip
    routeShortName: string; // Short name for the route (e.g., "Bus 232")
    routeColor: string; // Color of the route, in hex
    routeTextColor: string; // Text color for route, in hex
    intermediateStops: Place[]; // List of intermediate stops
}

const usePlaceSuggestions = () => {
    return useAsyncList<Place>({
        async load({signal, filterText}) {
            if (!filterText) return {items: []}; // Return empty if no input
            let response = await fetch(`http://motis.metroll.live/api/v1/geocode?text=${filterText}`, {signal});
            let data = await response.json();
            let places = data.map((pl: Place) => ({
                type: pl.type,
                name: pl.name,
                id: pl.id || null, // If no id, set to null
                lat: pl.lat,
                lon: pl.lon,
            }));
            return {items: places.slice(0, 5)};
        }
    });
};

const getTripSuggestions = async (fromPlace: Place, toPlace: Place)=> {
    if (!fromPlace || !toPlace) return { items: [] };
    const currentTime = new Date().toISOString();
    let fromPlaceId = fromPlace.id;
    let toPlaceId = toPlace.id;
    if (fromPlace.type === "PLACE" || fromPlace.type === "ADDRESS")
        fromPlaceId = `${fromPlace.lat},${fromPlace.lon}`;
    if (toPlace.type === "PLACE" || toPlace.type === "ADDRESS")
        toPlaceId = `${toPlace.lat},${toPlace.lon}`;
    const response = await fetch(`http://motis.metroll.live/api/v1/plan?time=${currentTime}&fromPlace=${fromPlaceId}&toPlace=${toPlaceId}&arriveBy=false`);
    const data = await response.json();
    let trips = data.itineraries.map((trip: Trip) => ({
        ...trip,
        id: `${trip.startTime}-${trip.endTime}-${trip.transfers}`,
        legs: trip.legs.map((leg: Leg) => ({
           ...leg,
            routeShortName: leg.mode === "WALK" ? "Walk" : leg.routeShortName
        }))

    }));
    return {items: trips.slice(0, 5)};
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


const TripPlanner: React.FC = () => {
    const [fromPlace, setFromPlace] = useState<Place | null>(null);
    const [toPlace, setToPlace] = useState<Place | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [showTrips, setShowTrips] = useState(false);
    const [tripDetails, setTripDetails] = useState<Trip | null>(null);
    const [showTripDetails, setShowTripDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fromPlaceSuggestions = usePlaceSuggestions();
    const toPlaceSuggestions = usePlaceSuggestions();

    const HandlePlanTripButton = async () => {
        setShowTrips(false);
        setShowTripDetails(false);
        if (fromPlace && toPlace) {
            if (fromPlace.id === toPlace.id) {
                setError("Origin and destination cannot be the same.");
            }
            else {
                setIsLoading(true);
                await wait(1000);
                const result = await getTripSuggestions(fromPlace, toPlace);
                if (result.items.length === 0) {
                    setError("No trips found.");
                } else {
                    setError(null);
                    setTrips(result.items);

                }
            }
        } else {
            setError("Please fill in both the origin and destination fields.");
        }
        setIsLoading(false);
        setShowTrips(true);
    };

    return (
        <Flex direction="row" gap="size-200" justifyContent="center">
            <Flex direction="column" justifyContent="space-between" gap="size-200">
                <View backgroundColor="gray-50" padding="size-300" marginX="auto" borderRadius="medium">
                    <Heading level={3}>Trip Planner</Heading>
                    <Divider marginBottom="size-200" />
                    <Flex gap="size-100" direction="column" width="size-6000">
                        {/* Start Location ComboBox */}
                        <ComboBox
                            label="Origin"
                            placeholder="Enter a stop, place, or address"
                            items={fromPlaceSuggestions.items}
                            inputValue={fromPlaceSuggestions.filterText}
                            onInputChange={fromPlaceSuggestions.setFilterText}
                            onSelectionChange={(key) => {
                                const selectedItem = fromPlaceSuggestions.items.find(item => item.id === key);
                                setFromPlace(selectedItem || null);
                            }}
                            loadingState={fromPlaceSuggestions.loadingState}
                            direction="bottom"
                            shouldFlip={true}
                            menuTrigger="input"
                            width="100%"

                        >
                            {(item) => <Item key={item.id}>{item.name}</Item>}
                        </ComboBox>
                        {/* End Location ComboBox */}
                        <ComboBox
                            label="Destination"
                            placeholder="Enter a stop, place, or address"
                            items={toPlaceSuggestions.items}
                            inputValue={toPlaceSuggestions.filterText}
                            onInputChange={toPlaceSuggestions.setFilterText}
                            onSelectionChange={(key) => {
                                const selectedItem = toPlaceSuggestions.items.find(item => item.id === key);
                                setToPlace(selectedItem || null);
                            }}
                            loadingState={toPlaceSuggestions.loadingState}
                            direction="bottom"
                            shouldFlip={true}
                            menuTrigger="input"
                            width="100%"
                        >
                            {(item) => <Item key={item.id}>{item.name}</Item>}
                        </ComboBox>
                        {/* Plan Trip Button */}
                        <Button variant="accent" isPending={isLoading} onPress={HandlePlanTripButton}>
                            Plan Trip
                        </Button>
                    </Flex>
                </View>

                {/* Display Trip Suggestions */}
                {showTrips && (
                    <View backgroundColor="gray-50" padding="size-300" width="size-6000" marginX="auto" borderRadius="medium">
                        {error ? (
                            <Text>{error}</Text>
                        ) : (
                            <ListBox aria-label="Trip Suggestions" items={trips} selectionMode="single"
                                     onSelectionChange={(key) => {
                                         let selectedKey = Array.from(key)[0];
                                         const selectedTrip = trips.find(trip => trip.id === selectedKey);
                                         setTripDetails(selectedTrip || null);
                                         setShowTripDetails(true);

                                     }}

                            >
                                {(item) => (
                                    <Item key={item.id}>
                                            <Text justifySelf="start"> {item.legs.map(leg => leg.routeShortName).join(' • ')}</Text>
                                            <Text justifySelf="end">{item.duration / 60} min </Text>
                                    </Item>
                                )}
                            </ListBox>
                        )}
                    </View>
                )}
            </Flex>
            <Flex direction="column" justifyContent="center">
                {/* Display Trip Details */}
                {showTripDetails && (
                    <View backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000" marginTop="size-300" maxHeight="size-3600" overflow="auto">
                            <Content>
                                <Heading level={4}>{fromPlace?.name} - {toPlace?.name}</Heading>
                                <Text><strong>Duration:</strong> {formatDuration(Number(tripDetails?.duration))}</Text>
                                <Divider marginY="size-150" />
                                {tripDetails?.legs.map((leg: Leg, legIndex: number) => (
                                    <View marginBottom="size-200">
                                        <Text>
                                            <strong>{tripDetails.legs.length > 1 && (legIndex === 0 ? "START: " : legIndex === tripDetails.legs.length - 1 ? " END: " : "")}{leg.routeShortName}</strong>
                                            <br/>{new Date(leg.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(leg.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            <br/>{leg.from.name} to {leg.to.name}
                                        </Text>
                                        <Divider size="S" marginTop="size-150" />
                                    </View>
                                ))}
                            </Content>
                    </View>
                )};
            </Flex>
        </Flex>
    );
};

export default TripPlanner;
