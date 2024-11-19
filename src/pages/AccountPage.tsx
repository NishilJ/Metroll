import React, { useState, useEffect } from "react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  getAuth,
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


const AccountPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Initialize Firebase Authentication in useEffect
  useEffect(() => {
    const auth = getAuth(); // Initialize auth
    const user = auth.currentUser;
    if (user) {
      setFirstName(user.displayName?.split(" ")[0] || "");
      setLastName(user.displayName?.split(" ")[1] || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Check for empty fields before proceeding with update
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

    // Proceed with update if fields are valid
    if (user) {
      try {
        // Update display name
        if (firstName && lastName && `${firstName} ${lastName}` !== user.displayName) {
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
        }

        // Update email if it's different from the current one
