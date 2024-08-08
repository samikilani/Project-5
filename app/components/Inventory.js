// components/Inventory.js
"use client";
import { useState, useEffect } from "react";
import { firestore, auth, logOut } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { collection, deleteDoc, doc, query, getDocs, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [recipe, setRecipe] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        updateInventory(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const updateInventory = async (userId) => {
    const snapshot = query(collection(firestore, `users/${userId}/inventory`));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((document) => {
      inventoryList.push({
        name: document.id,
        ...document.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!user) return;
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, `users/${user.uid}/inventory`), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory(user.uid);
  };

  const removeItem = async (item) => {
    if (!user) return;
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, `users/${user.uid}/inventory`), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory(user.uid);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    setFilteredInventory(filtered);
  };

  const getRecipeSuggestion = async () => {
    const response = await fetch('/api/getRecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pantryItems: inventory.map(item => item.name) }),
    });
  
    const data = await response.json();
    if (response.ok) {
      setRecipe(data.recipe);
    } else {
      console.error(data.error);
    }
  };
  
  
  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Tracker
          </Typography>
          <IconButton color="inherit" onClick={logOut}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={3}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search Items"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: "300px" }}
            InputProps={{
              startAdornment: (
                <SearchIcon position="start" />
              ),
            }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            Add New Item
          </Button>
          <Button variant="contained" onClick={getRecipeSuggestion}>
            Get Recipe Suggestion
          </Button>
        </Stack>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Paper elevation={3} sx={{ width: "80%", padding: 3 }}>
        <Typography variant="h4" color="primary" align="center" marginBottom={3}>
          Inventory Items
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {filteredInventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" color="textPrimary" gutterBottom>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      {recipe && (
        <Paper elevation={3} sx={{ width: "80%", padding: 3, marginTop: 3 }}>
          <Typography variant="h4" color="primary" align="center" marginBottom={3}>
            Recipe Suggestion
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {recipe}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
