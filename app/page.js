// app/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import Inventory from './components/Inventory';
import { Box, Typography } from '@mui/material';

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

export default function HomePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginBottom={4}
      >
        <Typography variant="h4" component="h1">
          Welcome, {user?.displayName}
        </Typography>
      </Box>
      <Inventory />
    </Box>
  );
}
