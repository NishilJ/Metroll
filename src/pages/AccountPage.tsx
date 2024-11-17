import React, { useState, useEffect } from 'react';
import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseconfig';
import {
    Button,
    TextField,
    Heading,
    View,
    Flex,
    Divider,
    Provider,
    defaultTheme
} from '@adobe/react-spectrum';

const AccountPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // Populate fields with the current user data
            setFirstName(user.displayName?.split(' ')[0] || '');
            setLastName(user.displayName?.split(' ')[1] || '');
            setEmail(user.email || '');
        }
    }, []);

    const handleUpdate = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                // Update display name
                await updateProfile(user, {
                    displayName: `${firstName} ${lastName}`
                });

                // Update email
                if (email !== user.email) {
                    await updateEmail(user, email);
                    await sendEmailVerification(user);
                }

                alert('Account information updated successfully.');
            } catch (error) {
                console.error("Error updating account information:", error);
                alert((error as Error).message);
            }
        }
    };

    return (
        <Provider theme={defaultTheme}>
            <View padding="size-300" width="size-4600">
                <Heading level={2}>Account Settings</Heading>
                <Divider marginBottom="size-300" />
                <Flex direction="column" gap="size-200">
                    <TextField
                        label="First name"
                        value={firstName}
                        onChange={setFirstName}
                    />
                    <TextField
                        label="Last name"
                        value={lastName}
                        onChange={setLastName}
                    />
                    <TextField
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={setEmail}
                    />
                    <TextField
                        label="Phone number"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                    />
                    <Button variant="cta" onPress={handleUpdate}>Update</Button>
                </Flex>
            </View>
        </Provider>
    );
};

export default AccountPage;
