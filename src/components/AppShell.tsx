 
import {
  AppBar, Toolbar, Typography, IconButton, Tooltip, Tabs, Tab, Box, Avatar, Badge
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAppTheme } from '../theme/theme';
import { useAppStore, TabKey } from '../store/useAppStore';

const privateTabs: TabKey[] = ['Clientes', 'SIN', 'Comprimir', 'Configuración'];

export default function AppShell() {
  const { mode, cycleMode } = useAppTheme();
  const { isAuthenticated, activeTab, setActiveTab, logout } = useAppStore();

  const tabs = isAuthenticated ? privateTabs : (['Login'] as TabKey[]);

  const themeIcon = mode === 'light' ? <LightModeIcon /> : mode === 'dark' ? <DarkModeIcon /> : <BrightnessAutoIcon />;

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ backdropFilter: 'saturate(120%) blur(6px)' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'secondary.main', color: 'grey.900', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
          SIN
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">Suite Tributaria</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>BackOffice Clientes</Typography>
        </Box>
        <Tooltip title="Cambiar tema (claro/oscuro/sistema)">
          <IconButton onClick={cycleMode} color="inherit" aria-label="Cambiar tema">{themeIcon}</IconButton>
        </Tooltip>
        <Tooltip title="Notificaciones">
          <IconButton color="inherit" aria-label="Notificaciones">
            <Badge color="secondary" variant="dot">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        {isAuthenticated && (
          <Tooltip title="Cerrar sesión">
            <IconButton color="inherit" onClick={logout} aria-label="Cerrar sesión">
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 14 }}>NE</Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      <Tabs
        value={tabs.indexOf(activeTab)}
        onChange={(_, i) => setActiveTab(tabs[i])}
        variant="scrollable"
        scrollButtons={false}
        aria-label="Navegación"
        sx={{ px: 2 }}
      >
        {tabs.map((t) => (
          <Tab key={t} label={t} />
        ))}
      </Tabs>
    </AppBar>
  );
}
