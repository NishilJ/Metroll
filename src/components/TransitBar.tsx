import React from 'react';
import { Flex, Item, ActionGroup } from '@adobe/react-spectrum';

interface TransitBarProps {
    onRoutesToggle: () => void;
}

const TransitBar: React.FC<TransitBarProps> = ({ onRoutesToggle }) => {
    return (
        <Flex margin="auto" alignItems="center" justifyContent="center" height="100%">
            <ActionGroup
                selectionMode="single"
                width="fit-content"
                onAction={(key) => {
                    if (key === 'routes') {
                        onRoutesToggle();
                    }
                }}
                defaultSelectedKeys={['planner']}
            >
                <Item key="departures">Departures</Item>
                <Item key="planner">Trip Planner</Item>
                <Item key="routes">Routes</Item>
            </ActionGroup>
        </Flex>
    );
};

export default TransitBar;
