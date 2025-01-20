import { createTheme } from '@mui/material';

const theme = createTheme({
	components: {
		MuiInputBase: {
			styleOverrides: {
				root: { paddingLeft: 20 }
			}
		}
	}
});

export default theme;