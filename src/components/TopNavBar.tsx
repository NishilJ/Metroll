import React, { useEffect, useState } from 'react';
import { Flex, Heading, MenuTrigger, ActionButton, Menu, Item } from '@adobe/react-spectrum';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Key } from 'react';

// Nishil & Syed
// Implements the top navigation bar
const TopNavBar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); 
        });
        return () => unsubscribe(); 
    }, [auth]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false); 
        } catch (error) {
            console.error("Sign out failed", error);
        }
    };

    const handleMenuOptions = (key: Key) => {
        if (key === 'signout') {
            handleSignOut();
        }
    };

    return (
        <Flex margin="auto" justifyContent="space-between" alignItems="center" width="95%" height="100%">
            <Heading level={1}>Metroll</Heading>
            <MenuTrigger>
                <ActionButton>☰</ActionButton>
                <Menu onAction={handleMenuOptions}>
                    {!isLoggedIn ? (
                        <Item href="/login" key="login">Login/Sign In</Item>
                    ) : (
                        <>
                            <Item href="/account" key="account">Account</Item>
                            <Item key="signout">Sign Out</Item>
                        </>
                    )}
                    <Item href="/" key="home">Home</Item>
                    <Item href="/about" key="about">About</Item>
                </Menu>
            </MenuTrigger>
        </Flex>
    );
};

export default TopNavBar;
