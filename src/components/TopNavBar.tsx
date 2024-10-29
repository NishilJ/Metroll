import React from 'react';
import {Flex, Heading, MenuTrigger, ActionButton, Menu, Item} from '@adobe/react-spectrum';

// Nishil
// Implements the top navigation bar
const TopNavBar: React.FC = () => {
    return (

            <Flex margin="auto" justifyContent="space-between" alignItems="center" width="95%" height="100%">
                <Heading level={1}>Metroll</Heading>
                <MenuTrigger>
                    <ActionButton>☰</ActionButton>
                    <Menu /*onAction={(key) => alert(key)}*/>
                        <Item href="/login" key="login" >Login/Sign In</Item>
                        <Item href="/" key="">Home</Item>
                        <Item href="/about" key="about">About</Item>
                    </Menu>
                </MenuTrigger>
            </Flex>
    );
}

export default TopNavBar;
