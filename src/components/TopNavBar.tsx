import React, { useEffect, useState } from 'react';
import { Flex, Heading, MenuTrigger, ActionButton, Menu, Item} from '@adobe/react-spectrum';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Key } from 'react';

// Nishil & Syed
// Implements the top navigation bar
const TopNavBar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const auth = getAuth();

    useEffect(() => {
        const isLoggedIn = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsLoggedIn(true);
            setUserName(user.displayName); // Set display name from Firebase
        } else {
            setIsLoggedIn(false);
            setUserName(null);
        }
        });

        return () => isLoggedIn();
        }, 
            [auth]
    );

    const handleSignOut = async () => {
        try {
        await signOut(auth);
        setIsLoggedIn(false);
        setUserName(null);
        } 
        catch (error) {
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
            <Flex alignItems="center" gap="size-200">
                {isLoggedIn && userName && <Heading level={4}>Welcome, {userName}</Heading>}
                <MenuTrigger>
                <ActionButton>☰</ActionButton>
                <Menu onAction={handleMenuOptions}>
                    <Item href="/" key="home">Home</Item>
                    {!isLoggedIn ? (
                    <Item href="/login" key="login">Login/Sign In</Item>
                    ) : (
                    <>
                        <Item href="/account" key="account">Account</Item>
                        <Item key="signout">Sign Out</Item>
                    </>
                    )}
                </Menu>
                </MenuTrigger>
            </Flex>
        </Flex>
    );
};

export default TopNavBar;
