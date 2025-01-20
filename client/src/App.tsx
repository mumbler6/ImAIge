import './Config';
import { useEffect, useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { User, getAuth } from 'firebase/auth';

import Navbar from './components/Navbar';
import OverlaySpinner from './components/OverlaySpinner';
import Login from './screens/Login';
import Home from './screens/Home';
import axios from 'axios';
import Dashboard from './screens/Dashboard';
import Project from './screens/Project';
import theme from './Theme';

export default function App() {

	const [user, setUser] = useState<User | null>();
	const [loading, setLoading] = useState(true);
	const auth = getAuth();

	useEffect(() => {
		return auth.onIdTokenChanged(async user => {
			if (user)
			{
				const token = await user.getIdToken();
				axios.defaults.headers.common.Authorization = `Bearer ${token}`;
			}
			setUser(user);
			setLoading(false);
		});
	});

	if (loading)
		return <OverlaySpinner />;

	return (
		<ThemeProvider theme={theme}>
		<Router>
			<Box sx={{ flex: 1, height: '100vh' }}>
				<Box sx={{ height: 75 }}>
					<Navbar />
				</Box>
				<Box sx={{ flex: 1 }}>
					<Routes>
						<Route path="/" element={<Home />} />
						{!user && <Route path="/login" element={<Login />} />}
						{user && <>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/projects/:projectId" element={<Project />} />
						</>}
					</Routes>
				</Box>
			</Box>
		</Router>
		</ThemeProvider>
	)
}