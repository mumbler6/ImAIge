import React from "react";
import { Box, Button, Card, CardContent, Container, Divider, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Home()
{
    const navigate = useNavigate();
    const auth = getAuth();

    return (
        <Box flex={1} justifyContent='center' alignItems='center' py={5}>
            <Box maxWidth={1000}>
            <Card>
                <CardContent>
                    <Typography variant="h4">
                        Welcome to ImAIGen
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box alignItems='center' my={2}>
                        <img src="https://firebasestorage.googleapis.com/v0/b/crowd-design.appspot.com/o/Poster.jpg?alt=media&token=01c0806f-1edd-4c2f-bd39-9248ab823f03"
                            style={{ width: 512, height: 512 }}
                        />
                        <Typography variant='caption' textAlign='center'>
                            *AI Generated Image: A crowd of people working together, designing innovative ideas
                        </Typography>
                    </Box>


                    <Typography textAlign='justify'>
                        With the advent of generative AI, prompt based image generation has been a great tool in assisting artists in coming up with rough designs or ideas that they can later touch up in other tools such as photoshop. Due to the inherent randomness in their generations, sometimes we can lose track of previous generations and what the exact prompt was to facilitate it.
                    </Typography>
                    <Typography textAlign='justify' sx={{ mt: 3 }}>
                        ImAIGen is a platform that can be used to create design projects where you can easily track all your image generations and view the series of prompts that they used so that they can better visualize and engineer prompts to satisfy their goals.
                    </Typography>

                    <Box pt={3}>
                    <Button variant='contained' onClick={()=>auth.currentUser ? navigate('/dashboard') : navigate('/login')}>Start your project</Button>
                    </Box>
                </CardContent>
            </Card>
            </Box>
        </Box>
    );
}