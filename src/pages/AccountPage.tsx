import React, { useState, useEffect } from "react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  Button,
  TextField,
  Heading,
  View,
  Flex,
  Divider,
  Provider,
  defaultTheme,
} from "@adobe/react-spectrum";
import { auth } from "../firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";


const AccountPage: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reEnterPassword, setReEnterPassword] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        if (displayName !== user.displayName) {
          await updateProfile(user, {
            displayName: displayName,
          });
          alert("Display name updated successfully!");
        }

        if (email !== user.email && email !== "" && email != null) {
          alert(
              `A verification email has been sent to ${email}. Please verify it and then log back in to complete the update.`
          );
          await sendEmailVerification(user);
          await updateEmail(user, email);
          return;
        }
        if (password !== reEnterPassword) {
          alert("Passwords do not match. Please re-enter the password.");
        return;
        }
        if (password === reEnterPassword && password !== "" && password != null) {
            await updatePassword(user, password);
            alert("Password updated successfully!");
          }

      } catch (error) {
        console.error("Error updating account:", error);
        alert("An error occurred while updating the account.");
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
            label="Display Name"
            value={displayName}
            onChange={setDisplayName}
            placeholder={displayName}
          />
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={email}
          />
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          <TextField
            label="Re-enter Password"
            type="password"
            value={reEnterPassword}
            onChange={setReEnterPassword}
          />
          <Button variant="accent" onPress={handleUpdate}>
            Update
          </Button>
        </Flex>
      </View>
    </Provider>
  );
};

export default AccountPage;
