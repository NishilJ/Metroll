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
import { auth } from "../firebase/firebaseConfig";

const AccountPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reEnterPassword, setReEnterPassword] = useState<string>("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFirstName(user.displayName?.split(" ")[0] || "");
      setLastName(user.displayName?.split(" ")[1] || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleUpdate = async () => {
    const user = auth.currentUser;

    if (!firstName || !lastName) {
      alert("Please enter both first and last names.");
      return;
    }

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter a new password.");
      return;
    }

    if (password !== reEnterPassword) {
      alert("Passwords do not match. Please re-enter the password.");
      return;
    }

    if (user) {
      try {
        if (`${firstName} ${lastName}` !== user.displayName) {
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
        }

        if (email !== user.email) {
          alert(
            `A verification email has been sent to ${email}. Please verify it and then log back in to complete the update.`
          );
          await sendEmailVerification(user);
          return;
        }

        await updatePassword(user, password);
        alert("Account updated successfully!");
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
            label="First name"
            value={firstName}
            onChange={setFirstName}
            placeholder={firstName || "Enter first name"}
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={setLastName}
            placeholder={lastName || "Enter last name"}
          />
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={email || "Enter email address"}
          />
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={setPassword}
            isRequired
          />
          <TextField
            label="Re-enter Password"
            type="password"
            value={reEnterPassword}
            onChange={setReEnterPassword}
            isRequired
          />
          <Button variant="cta" onPress={handleUpdate}>
            Update
          </Button>
        </Flex>
      </View>
    </Provider>
  );
};

export default AccountPage;
