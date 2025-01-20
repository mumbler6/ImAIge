import React, { useState } from 'react';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const drawerWidth = 250;

export default function Navbar()
{
	const [mobileOpen, setMobileOpen] = useState(false);
	const navigate = useNavigate();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	const container = window.document.body;
    const auth = getAuth();

	const navItems = [
		{ title: 'Home', url: '/' },
		...(auth.currentUser ? [
			{ title: 'Dashboard', url: '/dashboard' },
		] : [])
	];

	const drawer = (
		<Box onClick={handleDrawerToggle} px={2}>
			<Typography variant="h6" sx={{ my: 2, px: 2 }}>
				ImAIGen
			</Typography>
			<Divider />
			<List>
			{navItems.map((item) => (
				<ListItem key={item.url} disablePadding>
				<ListItemButton onClick={() => navigate(item.url)} sx={{ width: '100%', alignItems: 'flex-start' }}>
					<ListItemText primary={item.title} />
				</ListItemButton>
				</ListItem>
			))}
			</List>
		</Box>
	);

    return (
		<Box>
        <AppBar component="nav">
			<Toolbar sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: 'none' }, borderWidth: 1 }}
				>
					<MenuIcon />
				</IconButton>
				<Box sx={{ flex: 1, alignItems: 'flex-start' }}>
					<Typography>
						<Button sx={{ color: 'white' }} onClick={()=>navigate('/')}>
							{/* <img src='/logo.png' style={{ width: 35, height: 35, marginRight: 5 }} /> */}
							<Typography variant='h6' component='div' sx={{ textTransform: 'none' }}>
								ImAIGen
							</Typography>
						</Button>
					</Typography>
				</Box>
				<Box sx={{ display: { xs: 'none', sm: 'block' }, flexDirection: 'row', alignItems: 'flex-start' }}>
					{navItems.map((item) => (
						<Button key={item.url} sx={{ color: 'white' }} onClick={() => navigate(item.url)}>
							{item.title}
						</Button>
					))}
				</Box>
				<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
					{!auth.currentUser && <Button sx={{ color: 'white' }} onClick={() => { navigate('/login') }}>
						Login
					</Button>}
					{auth.currentUser && <Button sx={{ color: 'white' }} onClick={() => { auth.signOut(); navigate('/login'); }}>
						Logout
					</Button>}
				</Box>
			</Toolbar>
		</AppBar>
		<Box component="nav">
			<Drawer
			container={container}
			variant="temporary"
			open={mobileOpen}
			onClose={handleDrawerToggle}
			ModalProps={{ keepMounted: true }}
			sx={{
				display: { xs: 'block', sm: 'none' },
				'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
			}}
			>
				{drawer}
			</Drawer>
		</Box>
	  </Box>
    )
}