import React from 'react';
import {Flex, Heading, MenuTrigger, ActionButton, Menu, Item} from '@adobe/react-spectrum';

const TopNavBar: React.FC = () => {
    return (
        <Flex margin="auto" justifyContent="space-between" alignItems="center" width="95%" height="100%">
            <Heading level={1}>Metroll</Heading>
            <MenuTrigger>
                <ActionButton>☰</ActionButton>
                <Menu onAction={(key) => alert(key)}>
                    <Item key="auth">Login/Sign In</Item>
                    <Item key="home">Home</Item>
                    <Item key="about">About</Item>
                </Menu>
            </MenuTrigger>
        </Flex>
    );
}

export default TopNavBar;
