import React, { useState } from 'react';
import { SERVER_URL } from '../constants.js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Carlist from './Carlist';

function Login(){

    const [user, setUser] = useState({
        username: '',
        password: ''
    });

    const [isAuthenticated, setAuth] = useState(false);
    
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    }

    const login = () => {
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(user)
        })
        .then(res => {
            const jwtToken = res.headers.get('Authorization');
            if(jwtToken !== null){
                sessionStorage.setItem("jwt", jwtToken);
                setAuth(true);
            } else { 
                setOpen(true);
            }
        })
        .catch(err => console.error(err))
    }

    const logout = () => {
        sessionStorage.removeItem("jwt");
        setAuth(false);
    }

    if(isAuthenticated){
        return <div>
            <Carlist />
            <Button variant="outlined" color="primary" onClick={logout}>Logout</Button>
            </div>
    } else {
        return(
            <div>
                <Stack spacing={2} alignItems='center' mt={2}>
                    <Snackbar
                        open={open}
                        autoHideDuration={3000}
                        onClose={() => setOpen(false)}
                        message="Login failed: Check your username and/or password"
                    />
                    <TextField
                        name="username"
                        label="Username"
                        onChange={handleChange} />
                    <TextField
                        type="password"
                        name="password"
                        label="Password"
                        onChange={handleChange} />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={login}>
                            Login
                    </Button>
                </Stack>
            </div>
        )
    }
}

export default Login;