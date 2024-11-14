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
import moment from 'moment';

interface Stop {
    id: string;
    name: string;
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

const fetchDepartures = async (stopId: string) => {
    const res = await fetch(
        `http://motis.metroll.live/api/v1/stoptimes?stopId=${stopId}&time=${new Date().toISOString()}&arriveBy=false&n=10`
    );
    const data = await res.json();
    return data.stopTimes || [];
};

const Departures: React.FC = () => {
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [error, setError] = useState<string | null>(null);
    const stopSuggestions = useStopSuggestions();

    const handleGetDepartures = async () => {
        if (!selectedStop) {
            setError('Please select a stop.');
            return;
        }

        try {
            setError(null);
            const departures = await fetchDepartures(selectedStop.id);
            console.log("Fetched Departures:", departures); // Log the fetched departure data
            setDepartures(departures);

        } catch {
            setError('Failed to load departures.');
        }
    };

    const formatTime = (time: string) => moment.utc(time).local().format('DD/MM/YYYY HH:mm:ss');

    return (
        <Flex direction="column" alignItems="center" gap="size-200">
            <View backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000">
                <Heading level={3}>Stop Departures</Heading>
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

                <Button variant="cta" onPress={handleGetDepartures} marginTop="size-200">
                    Get Departures
                </Button>
            </View>

            <View marginTop="size-300" backgroundColor="gray-100" padding="size-300" borderRadius="medium" width="size-6000">
                {error && <Text UNSAFE_style={{ color: 'red' }}><strong>Error:</strong> {error}</Text>}
                {!error && departures.length === 0 && <Text>Enter a stop to receive information.</Text>}
                {departures.map((departure, idx) => {
                    console.log(`Departure ${idx + 1}:`, departure); // Log each departure data
                    return (
                        <View key={idx} marginBottom="size-200" padding="size-200" backgroundColor="gray-200" borderRadius="medium">
                            <Text>
                                <strong>Route:</strong> {departure.routeShortName} <br />
                                <strong>Headsign:</strong> {departure.headsign} <br />
                                <strong>Departure:</strong> {formatTime(departure.departure)}
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
