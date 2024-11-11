// src/GoogleSignIn.tsx
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseconfig';
import { Button, Box } from '@mui/material';
import { GoogleIcon} from './customicons';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleSignIn}
        startIcon={<GoogleIcon />}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default GoogleSSO;
