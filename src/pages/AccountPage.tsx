import React, { useState, useEffect } from 'react';
import { updateProfile, updateEmail, updatePassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig';
import {
  Button,
  TextField,
  Heading,
  View,
  Flex,
  Divider,
  Provider,
  defaultTheme,
  Content
} from '@adobe/react-spectrum';

const AccountPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Additional state for displaying current Firestore values
  const [currentFirstName, setCurrentFirstName] = useState<string>('');
  const [currentLastName, setCurrentLastName] = useState<string>('');
  const [currentEmail, setCurrentEmail] = useState<string>('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Populate fields with the current user data
      const displayName = user.displayName || '';
      const [first, last] = displayName.split(' ');
      setFirstName(first || '');
      setLastName(last || '');
      setEmail(user.email || '');

      // Fetch and display current Firestore values
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentFirstName(data.firstName || '');
          setCurrentLastName(data.lastName || '');
          setCurrentEmail(data.email || '');
        }
      };

      fetchUserData();
    }
  }, []);

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Update display name
        if (firstName && lastName) {
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`
          });
        }

        // Update email
        if (email && email !== user.email) {
          await updateEmail(user, email);
          await sendEmailVerification(user);
        }

        // Update password if a new password is provided
        if (password) {
          await updatePassword(user, password);
          alert('Password updated successfully.');
        }

        alert('Account information updated successfully.');
      } catch (error) {
        console.error("Error updating account information:", error);
        alert((error as Error).message);
      }
    } else {
      alert("No user is logged in.");
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
                label="New Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Leave blank to keep current password"
            />
            <Button variant="cta" onPress={handleUpdate}>Update</Button>
          </Flex>

          <Heading level={3} marginTop="size-400">Current Database Values</Heading>
          <Content>
            <strong>First Name:</strong> {currentFirstName}
          </Content>
          <Content>
            <strong>Last Name:</strong> {currentLastName}
          </Content>
          <Content>
            <strong>Email:</strong> {currentEmail}
          </Content>
        </View>
      </Provider>
  );
};

export default AccountPage;
