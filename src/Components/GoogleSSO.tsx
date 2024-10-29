// src/GoogleSignIn.tsx
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseconfig';

// Justin
const GoogleSSO: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Google Sign-In Successful');
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      alert((error as Error).message);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};

export default GoogleSSO;
