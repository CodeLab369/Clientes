import * as React from 'react';
import { Box, Paper, Stack, Typography, TextField, MenuItem, Select, FormControl, Button, Chip, Switch, FormControlLabel } from '@mui/material';
import CompressIcon from '@mui/icons-material/FolderZip';
import DownloadIcon from '@mui/icons-material/Download';
import ReplayIcon from '@mui/icons-material/Replay';
import { useAppStore, SinCategory } from '../store/useAppStore';

const categories: SinCategory[] = ['RCV', 'IVA', 'IT', 'RC-IVA', 'FACTURAS', 'IUE', 'OTROS', 'CONTABILIDAD'];

export default function Comprimir() {
  const { clients, addCompression, setCompressionStatus, compressions } = useAppStore();
  const [clientId, setClientId] = React.useState('');
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [period, setPeriod] = React.useState('01');
  const [selectedCats, setSelectedCats] = React.useState<SinCategory[]>([]);
  const [subfolders, setSubfolders] = React.useState(true);
  const [metadata, setMetadata] = React.useState(true);

  const zipName = clientId ? `${clients.find(c => c.id === clientId)?.razonSocial || 'cliente'}_${year}_${period}.zip` : `paquete_${year}_${period}.zip`;

  const startCompression = () => {
    if (!clientId || selectedCats.length === 0) return;
    const id = addCompression({ clientId, year, period, categories: selectedCats, includeSubfolders: subfolders, includeMetadata: metadata, name: zipName });
    setCompressionStatus(id, 'processing');
    setTimeout(() => setCompressionStatus(id, 'done'), 1500);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <Select displayEmpty value={clientId} onChange={(e) => setClientId(String(e.target.value))}>
              <MenuItem value=""><em>Cliente</em></MenuItem>
              {clients.map((c) => <MenuItem key={c.id} value={c.id}>{c.razonSocial}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" label="Año" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
          <TextField size="small" label="Periodo" value={period} onChange={(e) => setPeriod(e.target.value)} />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              color={selectedCats.includes(c) ? 'primary' : 'default'}
              onClick={() => setSelectedCats((prev) => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
            />
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }} alignItems="center">
          <FormControlLabel control={<Switch checked={subfolders} onChange={(e) => setSubfolders(e.target.checked)} />} label="Crear subcarpetas" />
          <FormControlLabel control={<Switch checked={metadata} onChange={(e) => setMetadata(e.target.checked)} />} label="Incluir metadata" />
          <TextField size="small" label="Nombre ZIP" value={zipName} InputProps={{ readOnly: true }} fullWidth />
          <Button startIcon={<CompressIcon />} variant="contained" onClick={startCompression}>Comprimir</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Registros recientes</Typography>
        {compressions.length === 0 && <Typography variant="body2" color="text.secondary">Sin registros aún.</Typography>}
        {compressions.map((r) => (
          <Paper key={r.id} sx={{ p: 1.5, mb: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }}>
              <Typography>{r.name} · {r.status}</Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" startIcon={<DownloadIcon />} disabled={r.status !== 'done'}>Descargar</Button>
                <Button size="small" startIcon={<ReplayIcon />} onClick={() => {
                  const id = addCompression({ clientId: r.clientId, year: r.year, period: r.period, categories: r.categories, includeSubfolders: r.includeSubfolders, includeMetadata: r.includeMetadata, name: r.name });
                  setCompressionStatus(id, 'processing');
                  setTimeout(() => setCompressionStatus(id, 'done'), 1500);
                }}>Repetir</Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Paper>
    </Box>
  );
}
