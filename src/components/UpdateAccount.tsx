import React, { useState, useEffect } from "react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  Button,
  TextField,
  Heading,
  View,
  Flex,
  Divider,

} from "@adobe/react-spectrum";
import { auth } from "../firebaseconfig";

const reauthenticate = async (currentPassword: string) => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("User is not logged in or email is not available.");
  }
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    console.log("Re-authentication successful.");
  } catch (error) {
    console.error("Re-authentication failed:", error);
    throw new Error("Re-authentication failed. Please ensure your password is correct.");
  }
};
const UpdateAccount: React.FC = () => {
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
    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    let changesMade = false;

    if (user) {
      try {
        if (displayName !== user.displayName && displayName !== "" && displayName != null) {
          await updateProfile(user, {
            displayName: displayName,
          });
          alert("Display name updated successfully!");
          changesMade = true;
        }

        if (email !== user.email && email !== "" && email != null) {
          if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
          }

          const currentPassword = prompt("Enter your current password to confirm changes:");
          if (!currentPassword) {
            alert("Password confirmation is required.");
            return;
          }
          await reauthenticate(currentPassword);

          await updateEmail(user, email);
          await sendEmailVerification(user);
          alert(
              `A verification email has been sent to ${email}. Please verify it and then log back in to complete the update.`
          );

          changesMade = true;
        }

        if (password !== reEnterPassword) {
          alert("Passwords do not match. Please re-enter the password.");
        } else if (password === reEnterPassword && password !== "" && password != null) {
            const currentPassword = prompt("Enter your current password to confirm changes:");
            if (!currentPassword) {
              alert("Password confirmation is required.");
              return;
            }
            await reauthenticate(currentPassword);

            await updatePassword(user, password);
            alert("Password updated successfully!");
            changesMade = true;
        }

        if (!changesMade) {
          alert("No changes were made.");
        }
      } catch (error) {
        console.error("Error updating account:", error);
        alert(`Error updating account: ${error}`);
      }
    }
  };

  return (
    <Flex justifyContent="center">
      <View padding="size-300" backgroundColor="gray-50" width="size-4600" borderRadius="medium">
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
    </Flex>
  );
};

export default UpdateAccount;
