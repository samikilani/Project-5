'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Box, Button, Typography } from "@mui/material";

const firebaseConfig = {
    apiKey: "AIzaSyAoMaWv-7DyJuPsCHUsqS3git4XKD_rFYg",
    authDomain: "inventory-management-f61f1.firebaseapp.com",
    projectId: "inventory-management-f61f1",
    storageBucket: "inventory-management-f61f1.appspot.com",
    messagingSenderId: "992430410038",
    appId: "1:992430410038:web:20b6ea2de5ede2b8474b97",
    measurementId: "G-1DEJDG9QKY"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.push('/'); // Redirect to homepage if user is logged in
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/'); // Redirect to homepage after login
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" marginBottom={4}>
        Login
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogin}>
        Login with Google
      </Button>
    </Box>
  );
}
