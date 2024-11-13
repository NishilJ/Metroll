// Worked on by Yoel and Nishil
import React, {useState} from "react";
import {Flex, ComboBox, Item, View, Button, useAsyncList, ListBox, Text} from '@adobe/react-spectrum';

interface Place {
    type: string,
    name: string,
    id: string,
    lat: number,
    lon: number;
}

interface Trip {
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

const getTripSuggestions = async (fromPlace: Place, toPlace: Place) => {
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
        legs: trip.legs.map((leg: Leg) => ({
           ...leg,
        }))
    }));
    return {items: trips.slice(0, 5)};
};

const TripPlanner: React.FC = () => {
    const [fromPlace, setFromPlace] = useState<Place | null>(null);
    const [toPlace, setToPlace] = useState<Place | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [showTrips, setShowTrips] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fromPlaceSuggestions = usePlaceSuggestions();
    const toPlaceSuggestions = usePlaceSuggestions();

    const HandlePlanTripButton = async () => {
        if (fromPlace && toPlace) {
            const result = await getTripSuggestions(fromPlace, toPlace);
            if (result.items.length === 0) {
                setError("No trips found.");
            } else {
                setTrips(result.items);
                setError(null);
            }
        } else {
            setError("Please fill in both the origin and destination fields.");
        }
        setShowTrips(true);
    };

    return (
        <Flex direction="column" gap="size-200">
            <View backgroundColor="gray-50" padding="size-300" marginX="auto" borderRadius="medium">
                <Flex gap="size-100" direction="column" width="size-4600">
                    {/* Start Location ComboBox */}
                    <ComboBox
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
                        placeholder="Origin "
                    >
                        {(item) => <Item key={item.id}>{item.name}</Item>}
                    </ComboBox>
                    {/* End Location ComboBox */}
                    <ComboBox
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
                        placeholder="Destination "
                    >
                        {(item) => <Item key={item.id}>{item.name}</Item>}
                    </ComboBox>
                    {/* Plan Trip Button */}
                    <Button variant="accent" onPress={HandlePlanTripButton}>
                        Plan Trip
                    </Button>
                </Flex>
            </View>
            {/* Display Trip Suggestions */}
            {showTrips && (
                <View backgroundColor="gray-50" padding="size-300" width="size-4600" marginX="auto" borderRadius="medium">
                    {error ? (
                        <Text>{error}</Text>
                    ) : (
                        <ListBox aria-label="Trip Suggestions" items={trips} selectionMode="single">
                                {(item) => (
                                    <Item key={`${item.startTime}-${item.endTime}`}>
                                            <Text justifySelf="start"> {item.legs.map(leg => leg.mode === "WALK" ? "Walk" : leg.routeShortName).join(' • ')}</Text>
                                            <Text justifySelf="end">{item.duration / 60} min </Text>
                                    </Item>
                                )}
                        </ListBox>
                    )}
                </View>
            )}
        </Flex>
    );
};

export default TripPlanner;
