import * as React from 'react';
import {
  Box, Paper, Stack, Typography, TextField, MenuItem, Select, FormControl, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppStore, SinCategory } from '../store/useAppStore';

const categories: SinCategory[] = ['RCV', 'IVA', 'IT', 'RC-IVA', 'FACTURAS', 'IUE', 'OTROS', 'CONTABILIDAD'];

export default function SIN() {
  const { clients, sinDocs, addSinDocs, deleteSinBatch } = useAppStore();
  const [clientId, setClientId] = React.useState('');
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [period, setPeriod] = React.useState('01');
  const [cat, setCat] = React.useState<SinCategory>('RCV');
  const [previewFile, setPreviewFile] = React.useState<string | null>(null);
  const [confirmBatch, setConfirmBatch] = React.useState<string | null>(null);

  const onDrop = async (files: FileList | null) => {
    if (!files || !clientId) return;
    const pdfs: File[] = Array.from(files).filter((f) => f.type === 'application/pdf');
    if (pdfs.length === 0) return;
    const batchId = `${clientId}-${Date.now()}`;
    addSinDocs(
      pdfs.map((f) => ({ clientId, year, period, category: cat, fileName: f.name })),
      batchId
    );
  };

  const byCategory = (k: SinCategory) => sinDocs.filter((d) => d.category === k && (!clientId || d.clientId === clientId));

  return (
    <Box sx={{ p: 2, maxWidth: 1400, mx: 'auto' }}>
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
          <FormControl size="small">
            <Select value={cat} onChange={(e) => setCat(e.target.value as SinCategory)}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <Button component="label" startIcon={<UploadFileIcon />} variant="contained">
            Subir PDF
            <input hidden type="file" accept="application/pdf" multiple onChange={(e) => onDrop(e.target.files)} />
          </Button>
        </Stack>
      </Paper>

      <Box sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }
      }}>
        {categories.map((k) => (
          <Paper key={k} sx={{ p: 2, display: 'grid', gap: 1 }}>
            <Typography variant="subtitle2">{k}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{byCategory(k).length}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Documentos</Typography>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& td, & th': { p: 1, borderBottom: '1px solid', borderColor: 'divider' }, '& th': { textAlign: 'left' } }}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Año</th>
                <th>Periodo</th>
                <th>Categoría</th>
                <th>Archivo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sinDocs.filter((d) => !clientId || d.clientId === clientId).map((d) => (
                <tr key={d.id}>
                  <td>{clients.find((c) => c.id === d.clientId)?.razonSocial || '-'}</td>
                  <td>{d.year}</td>
                  <td>{d.period}</td>
                  <td><Chip size="small" label={d.category} /></td>
                  <td><PictureAsPdfIcon sx={{ mr: 1 }} />{d.fileName}</td>
                  <td>
                    <Button size="small" startIcon={<VisibilityIcon />} onClick={() => setPreviewFile(d.fileName)}>Ver</Button>
                    <Button size="small" startIcon={<DownloadIcon />}>Descargar</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmBatch(d.batchId)}>Eliminar lote</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'grid', md: 'none' }, gap: 1 }}>
          {sinDocs.filter((d) => !clientId || d.clientId === clientId).map((d) => (
            <Paper key={d.id} sx={{ p: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack>
                  <Typography variant="subtitle2">{d.fileName}</Typography>
                  <Typography variant="caption">{d.year}/{d.period} · {d.category}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => setPreviewFile(d.fileName)}>Ver</Button>
                  <Button size="small">Descargar</Button>
                  <Button size="small" color="error" onClick={() => setConfirmBatch(d.batchId)}>Eliminar</Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Dialog open={!!previewFile} onClose={() => setPreviewFile(null)} fullWidth maxWidth="md">
        <DialogTitle>Previsualización</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">PDF: {previewFile}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewFile(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmBatch} onClose={() => setConfirmBatch(null)}>
        <DialogTitle>Eliminar lote</DialogTitle>
        <DialogContent>¿Eliminar todos los documentos del lote?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBatch(null)}>Cancelar</Button>
          <Button color="error" onClick={() => { if (confirmBatch) deleteSinBatch(confirmBatch); setConfirmBatch(null); }}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
