import * as React from 'react';
import {
  Box, Paper, Tabs, Tab, Stack, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, ToggleButtonGroup, ToggleButton, MenuItem, Select, FormControl, Slider
} from '@mui/material';
import { useAppStore } from '../store/useAppStore';
import { useAppTheme } from '../theme/theme';

export default function Configuracion() {
  const [tab, setTab] = React.useState(0);
  const { notifications, setNotifications, notify } = useAppStore();
  const { mode, setMode } = useAppTheme();

  const [user, setUser] = React.useState('Nestor');
  const [pwd, setPwd] = React.useState('1005');
  const [confirm, setConfirm] = React.useState(false);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ notifications }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'backup.json'; a.click(); URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    file.text().then((txt) => {
      try {
        const data = JSON.parse(txt);
        if (data.notifications) setNotifications(data.notifications);
        notify({ message: 'Importación completa', severity: 'success' });
      } catch {
        notify({ message: 'Archivo inválido', severity: 'error' });
      }
    });
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: 'auto' }}>
      <Paper>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons={false}>
          <Tab label="Cuenta" />
          <Tab label="Apariencia" />
          <Tab label="Respaldo & Deploy" />
          <Tab label="Notificaciones" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tab === 0 && (
            <Stack spacing={2}>
              <TextField label="Usuario" value={user} onChange={(e) => setUser(e.target.value)} />
              <TextField label="Contraseña" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <Button variant="contained" onClick={() => setConfirm(true)}>Guardar cambios</Button>
              <Dialog open={confirm} onClose={() => setConfirm(false)}>
                <DialogTitle>Confirmar</DialogTitle>
                <DialogContent>¿Guardar cambios de la cuenta?</DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirm(false)}>Cancelar</Button>
                  <Button onClick={() => { setConfirm(false); notify({ message: 'Cuenta actualizada', severity: 'success' }); }}>Confirmar</Button>
                </DialogActions>
              </Dialog>
            </Stack>
          )}
          {tab === 1 && (
            <Stack spacing={2}>
              <Typography variant="subtitle2">Tema</Typography>
              <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)}>
                <ToggleButton value="light">Claro</ToggleButton>
                <ToggleButton value="dark">Oscuro</ToggleButton>
                <ToggleButton value="system">Sistema</ToggleButton>
              </ToggleButtonGroup>
              <Paper sx={{ p: 2, mt: 1 }}>Previsualización</Paper>
            </Stack>
          )}
          {tab === 2 && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={exportJson}>Exportar</Button>
                <Button variant="outlined" component="label">Importar<input hidden type="file" accept="application/json" onChange={(e) => e.target.files && importJson(e.target.files[0])} /></Button>
                <Button color="error" variant="contained" onClick={() => notify({ message: 'Restauración confirmada', severity: 'warning' })}>Confirmar restauración</Button>
              </Stack>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2">Deploy (simulado)</Typography>
                <Typography variant="body2" color="text.secondary">Todo listo para el despliegue.</Typography>
              </Paper>
            </Stack>
          )}
          {tab === 3 && (
            <Stack spacing={2}>
              <FormControl size="small" sx={{ width: 240 }}>
                <Select value={notifications.position} onChange={(e) => setNotifications({ position: e.target.value as any })}>
                  {['top-left','top-right','bottom-left','bottom-right'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </Select>
              </FormControl>
              <Typography variant="caption">Duración: {notifications.duration}ms</Typography>
              <Slider min={1000} max={10000} step={500} value={notifications.duration} onChange={(_, v) => setNotifications({ duration: v as number })} sx={{ maxWidth: 360 }} />
              <Typography variant="caption">Máx. visibles: {notifications.maxVisible}</Typography>
              <Slider min={1} max={6} step={1} value={notifications.maxVisible} onChange={(_, v) => setNotifications({ maxVisible: v as number })} sx={{ maxWidth: 360 }} />
              <Button onClick={() => notify({ message: 'Ejemplo de notificación', severity: 'info' })}>Probar notificación</Button>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
