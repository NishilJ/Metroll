import React from 'react';
import { Flex, ActionGroup, Item } from '@adobe/react-spectrum';

interface TransitBarProps {
    onSelect: (selectedView: string) => void; // Define the expected prop type
}

const TransitBar: React.FC<TransitBarProps> = ({ onSelect }) => {
    return (
        <Flex margin="auto" alignItems="center" justifyContent="center" height="100%">
            <ActionGroup
                selectionMode="single"
                width="fit-content"
                defaultSelectedKeys={['planner']}
                onSelectionChange={(selected) => {
                    const key = Array.from(selected)[0] as string; // Correctly extract and cast the selected key
                    if (key) {
                        onSelect(key); // Pass the selected key to onSelect
                    }
                }}
            >
                <Item key="departures">Departures</Item>
                <Item key="planner">Trip Planner</Item>
                <Item key="routes">Routes</Item>
            </ActionGroup>
        </Flex>
    );
}

export default TransitBar;
