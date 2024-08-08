'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Box, Button, Typography, Paper, Avatar } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

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
      position="relative"
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: "url('/background.jpg')", // Adjust the path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <GoogleIcon />
        </Avatar>
        <Typography variant="h4" component="h1" marginBottom={2}>
          Login
        </Typography>
        <Typography variant="body1" align="center" marginBottom={4}>
          Sign in to access your personalized pantry.
        </Typography>
        <Button variant="contained" startIcon={<GoogleIcon />} onClick={handleLogin} sx={{ width: '100%', maxWidth: '300px' }}>
          Login with Google
        </Button>
      </Paper>
    </Box>
  );
}
