import * as React from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
  const { login } = useAppStore();
  const [user, setUser] = React.useState('Nestor');
  const [pass, setPass] = React.useState('1005');
  const [show, setShow] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(user.trim(), pass.trim());
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100dvh - 112px)', p: 2 }}>
      <Paper elevation={2} sx={{ p: 3, width: '100%', maxWidth: 420, backdropFilter: 'blur(6px)' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Iniciar sesión</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }}
          />
          <TextField
            label="Contraseña"
            type={show ? 'text' : 'password'}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShow((s) => !s)} aria-label="Mostrar/ocultar">
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" size="large">Entrar</Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
          Credenciales demo: Usuario <b>Nestor</b> / Contraseña <b>1005</b>
        </Typography>
      </Paper>
    </Box>
  );
}
