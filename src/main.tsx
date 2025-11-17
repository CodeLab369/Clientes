import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { useAppTheme, themeLight, themeDark, applyBodyClass } from './theme/theme';

function Root() {
  const { mode } = useAppTheme();
  React.useEffect(() => applyBodyClass(mode), [mode]);
  const theme = mode === 'dark' ? themeDark : themeLight;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
