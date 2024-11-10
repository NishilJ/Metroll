// Worked on by Yoel and Nishil
import React, {useState} from "react";
import {Flex, ComboBox, Item, View, Button, useAsyncList} from '@adobe/react-spectrum';

interface Place {
    type: string,
    name: string,
    id: string,
    lat: number,
    lon: number;
}

interface Trip {
// To Implement
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
                lon: pl.lon
            }))

            return {items: places.slice(0, 5)};
        }
    });
};

const getTripSuggestions = async (fromPlace: string, toPlace: string) => {
    // To Implement

    const currentTime = new Date().toISOString();
    const response = await fetch(`http://motis.metroll.live/api/v1/plan?time=${currentTime}&fromPlace=${fromPlace}&toPlace=${toPlace}&arriveBy=false`);
    const data = await response.json();
}

const TripPlanner: React.FC = () => {

    const [fromPlace, setFromPlace] = useState<Place | null>(null);
    const [toPlace, setToPlace] = useState<Place | null>(null);

    const fromPlaceSuggestions = usePlaceSuggestions();
    const toPlaceSuggestions = usePlaceSuggestions();

    const handlePlanTripButton = async () => {
        console.log(fromPlace);
        console.log(toPlace);
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
                    <Button variant="accent" onPress={handlePlanTripButton}>
                        Plan Trip
                    </Button>
                </Flex>
            </View>
            <View backgroundColor="gray-50" padding="size-300" width="size-4600" marginX="auto" borderRadius="medium">
                {/* Display trip details */}
                // To Implement
            </View>
        </Flex>
    );
};

export default TripPlanner;
