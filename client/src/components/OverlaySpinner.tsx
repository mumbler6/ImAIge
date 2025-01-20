import React from 'react';
import { CircularProgress } from '@mui/material';

export default function OverlaySpinner()
{
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, opacity: .8, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' }}>
            <CircularProgress />
        </div>
    )
}