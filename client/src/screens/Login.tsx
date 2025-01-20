import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Container, Divider, FormGroup, FormLabel, Input, Link, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import OverlaySpinner from '../components/OverlaySpinner';
import axios from 'axios';

export default function Login()
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginMode, setLoginMode] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setLoading(true);
        try {
            if (loginMode)
            {
                await signInWithEmailAndPassword(auth, email, password);
            }
            else
            {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(user, {
                    displayName: name
                });
            }
            navigate('/dashboard');
        }
        catch (err: any) {
            console.log(err.message || err);
        }
        setLoading(false);
    }

    return (
        <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Card sx={{ maxWidth: 500, width: '100%', marginBottom: 15 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography variant='h5'>{loginMode ? 'Login' : 'Register'}</Typography>
                    <Divider/>
                    {!loginMode && <TextField label='Name' value={name} onChange={e => setName(e.target.value)} />}
                    <TextField label='Email' value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField label='Password' value={password} type='password' onChange={e => setPassword(e.target.value)} />
                    {!loginMode && <TextField label='Confirm Password' value={confirmPassword} type='password' onChange={e => setConfirmPassword(e.target.value)} />}
                    <Link width='100%' onClick={()=>setLoginMode(l => !l)}>{loginMode ? 'Don\'t have an account? Register here' : 'Already have an account? Login here'}</Link>
                    <Button variant='contained' onClick={onSubmit}>Submit</Button>
                </CardContent>
            </Card>

            {loading && <OverlaySpinner />}

        </Box>
    )
}