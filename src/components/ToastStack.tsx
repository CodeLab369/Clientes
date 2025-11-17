import * as React from 'react';
import { Alert, Collapse, IconButton, Stack, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppStore } from '../store/useAppStore';

export default function ToastStack() {
  const { toasts, closeToast, notifications } = useAppStore();
  const position = notifications.position;
  const [visible, setVisible] = React.useState<string[]>([]);

  React.useEffect(() => {
    const next = toasts.slice(-notifications.maxVisible).map((t) => t.id);
    setVisible(next);
  }, [toasts, notifications.maxVisible]);

  const posStyle: Record<string, any> = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 }
  };

  return (
    <Box sx={{ position: 'fixed', zIndex: 1400, pointerEvents: 'none', ...posStyle[position] }}>
      <Stack spacing={1} sx={{ pointerEvents: 'auto', minWidth: 280 }}>
        {toasts.map((t) => (
          <Collapse key={t.id} in={visible.includes(t.id)}>
            <Alert
              variant="filled"
              severity={t.severity || 'info'}
              action={
                <IconButton size="small" onClick={() => closeToast(t.id)} aria-label="Cerrar">
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              onClose={() => closeToast(t.id)}
              sx={{ borderRadius: 2 }}
            >
              {t.message}
            </Alert>
          </Collapse>
        ))}
      </Stack>
    </Box>
  );
}
