import React from 'react';
import {Flex, Heading, MenuTrigger, ActionButton, Menu, Item, ActionGroup} from '@adobe/react-spectrum';

const TransitBar: React.FC = () => {
    return (
        <Flex margin="auto" alignItems="center" justifyContent="center" height="100%">
            <ActionGroup selectionMode="single" width="fit-content" defaultSelectedKeys={['planner']}>
                <Item key="departures">Departures</Item>
                <Item key="planner">Trip Planner</Item>
                <Item key="routes">Routes</Item>
            </ActionGroup>

        </Flex>
    );
}

export default TransitBar;
