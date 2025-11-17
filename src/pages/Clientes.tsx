import * as React from 'react';
import { Box, Paper, Stack, TextField, InputAdornment, IconButton, Button, Typography, Chip, MenuItem, Select, FormControl, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, Menu } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppStore, Client } from '../store/useAppStore';

type RowProps = { c: Client; selected: boolean; onToggle: () => void; onCopy: (e: React.MouseEvent<HTMLElement>) => void; onView: () => void; onEdit: () => void; };
function ClientRow({ c, selected, onToggle, onCopy, onView, onEdit }: RowProps) {
  return (
    <tr>
      <td><Checkbox checked={selected} onChange={onToggle} /></td>
      <td>{c.nit}</td>
      <td>{c.razonSocial}</td>
      <td>{c.tipoContribuyente}</td>
      <td>{c.tipoEntidad}</td>
      <td>{c.facturacion}</td>
      <td>{c.actividadEconomica}</td>
      <td>{c.direccion}</td>
      <td>{c.correo}</td>
      <td>
        <IconButton size="small" title="Copiar credencial" onClick={onCopy}><ContentCopyIcon fontSize="inherit" /></IconButton>
        <IconButton size="small" title="Ver información completa" onClick={onView}><VisibilityIcon fontSize="inherit" /></IconButton>
        <IconButton size="small" title="Editar" onClick={onEdit}><EditIcon fontSize="inherit" /></IconButton>
      </td>
    </tr>
  );
}

export default function Clientes() {
  const { clients, selectedClientIds, toggleSelectClient, clientQuery, setClientQuery, clientRowsPerPage, setClientRowsPerPage, clientLastDigit, setClientLastDigit, deleteClients, deleteAllClients, addClient, updateClient, notify } = useAppStore();
  const [openEdit, setOpenEdit] = React.useState<null | Client>(null);
  const [viewClient, setViewClient] = React.useState<null | Client>(null);
  const [confirmSel, setConfirmSel] = React.useState(false);
  const [confirmAll, setConfirmAll] = React.useState(false);
  const [copyAnchor, setCopyAnchor] = React.useState<null | HTMLElement>(null);
  const [copyClient, setCopyClient] = React.useState<null | Client>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filtered = clients.filter((c) => {
    const q = clientQuery.toLowerCase();
    const matchesQ = !q || c.nit.includes(q) || c.razonSocial.toLowerCase().includes(q) || c.correo.toLowerCase().includes(q);
    const last = clientLastDigit === 'Todos' || c.nit.slice(-1) === String(clientLastDigit);
    return matchesQ && last;
  });

  const copyField = (c: Client, field: 'nit' | 'correo' | 'password') => {
    let value = field === 'password' ? c.credenciales.password : c[field];
    try {
      navigator.clipboard.writeText(value);
      notify({ message: `Copiado ${field}`, severity: 'success' });
    } catch {
      notify({ message: 'No se pudo copiar', severity: 'error' });
    }
  };

  const onSave = (data: Omit<Client, 'id'>, id?: string) => {
    if (id) updateClient(id, data as any); else addClient(data);
    setOpenEdit(null);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1400, mx: 'auto' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField placeholder="Buscar por NIT / Razón Social / Correo" value={clientQuery} onChange={(e) => setClientQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} fullWidth />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select value={clientRowsPerPage} onChange={(e) => setClientRowsPerPage(Number(e.target.value))}>
              {[5,10,20,50].map((n) => <MenuItem key={n} value={n}>{n} filas/página</MenuItem>)}
            </Select>
          </FormControl>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenEdit({ id: '', nit: '', razonSocial: '', tipoContribuyente: '', tipoEntidad: '', facturacion: '', actividadEconomica: '', direccion: '', correo: '', credenciales: { password: '' } })}>Agregar cliente</Button>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
          <Chip label="Todos" color={clientLastDigit === 'Todos' ? 'primary' : 'default'} onClick={() => setClientLastDigit('Todos')} />
          {[0,1,2,3,4,5,6,7,8,9].map((d) => <Chip key={d} label={d} color={clientLastDigit === d ? 'primary' : 'default'} onClick={() => setClientLastDigit(d)} />)}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button color="warning" startIcon={<DeleteIcon />} onClick={() => setConfirmSel(true)} disabled={selectedClientIds.size === 0}>Eliminar seleccionados</Button>
          <Button color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmAll(true)} disabled={clients.length === 0}>Eliminar todos</Button>
        </Stack>
      </Paper>

      {isMobile ? (
        <Stack spacing={1}>
          {filtered.map((c) => (
            <Paper key={c.id} sx={{ p: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack>
                  <Typography variant="subtitle2">{c.razonSocial || 'Sin razón social'}</Typography>
                  <Typography variant="caption">NIT/CUR/CI {c.nit || '—'} · {c.correo || '—'}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={(e) => { setCopyAnchor(e.currentTarget); setCopyClient(c); }}>Copiar</Button>
                  <Button size="small" onClick={() => setViewClient(c)}>Ver</Button>
                  <Button size="small" onClick={() => setOpenEdit(c)}>Editar</Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
          {filtered.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No hay clientes.</Typography>}
        </Stack>
      ) : (
        <Paper sx={{ p: 2, overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', '& td, & th': { p: 1, borderBottom: '1px solid', borderColor: 'divider' }, '& th': { textAlign: 'left' } }}>
            <thead>
              <tr>
                <th></th>
                <th>NIT</th>
                <th>Razón Social</th>
                <th>Tipo Contribuyente</th>
                <th>Tipo Entidad</th>
                <th>Facturación</th>
                <th>Actividad Económica</th>
                <th>Dirección</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <ClientRow
                  key={c.id}
                  c={c}
                  selected={selectedClientIds.has(c.id)}
                  onToggle={() => toggleSelectClient(c.id)}
                  onCopy={(e) => { setCopyAnchor(e.currentTarget); setCopyClient(c); }}
                  onView={() => setViewClient(c)}
                  onEdit={() => setOpenEdit(c)}
                />
              ))}
            </tbody>
          </Box>
          {filtered.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No hay clientes.</Typography>}
        </Paper>
      )}

      {/* Menú copia credenciales */}
      <Menu
        anchorEl={copyAnchor}
        open={!!copyAnchor}
        onClose={() => { setCopyAnchor(null); setCopyClient(null); }}
      >
        <MenuItem disabled={!copyClient} onClick={() => { if (copyClient) copyField(copyClient, 'nit'); }}>
          Copiar NIT
        </MenuItem>
        <MenuItem disabled={!copyClient} onClick={() => { if (copyClient) copyField(copyClient, 'correo'); }}>
          Copiar correo
        </MenuItem>
        <MenuItem disabled={!copyClient} onClick={() => { if (copyClient) copyField(copyClient, 'password'); }}>
          Copiar contraseña
        </MenuItem>
      </Menu>

      {/* Modal Agregar / Editar */}
      <Dialog open={!!openEdit} onClose={() => setOpenEdit(null)} fullWidth maxWidth="md">
        <DialogTitle>{openEdit?.id ? 'Editar cliente' : 'Agregar cliente'}</DialogTitle>
        <DialogContent dividers>
          {openEdit && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Credenciales</Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="NIT / CUR / CI" value={openEdit.nit} onChange={(e) => setOpenEdit({ ...openEdit, nit: e.target.value })} fullWidth />
                  <TextField label="Correo" type="email" value={openEdit.correo} onChange={(e) => setOpenEdit({ ...openEdit, correo: e.target.value })} fullWidth />
                </Stack>
                <TextField label="Contraseña" value={openEdit.credenciales.password} onChange={(e) => setOpenEdit({ ...openEdit, credenciales: { password: e.target.value } })} fullWidth />
              </Stack>
              <Typography variant="subtitle2">Información general</Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="Razón Social" value={openEdit.razonSocial} onChange={(e) => setOpenEdit({ ...openEdit, razonSocial: e.target.value })} fullWidth />
                  <TextField label="Tipo Contribuyente" value={openEdit.tipoContribuyente} onChange={(e) => setOpenEdit({ ...openEdit, tipoContribuyente: e.target.value })} fullWidth />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField label="Tipo Entidad" value={openEdit.tipoEntidad} onChange={(e) => setOpenEdit({ ...openEdit, tipoEntidad: e.target.value })} fullWidth />
                  <TextField label="Facturación" value={openEdit.facturacion} onChange={(e) => setOpenEdit({ ...openEdit, facturacion: e.target.value })} fullWidth />
                </Stack>
                <TextField label="Actividad Económica" value={openEdit.actividadEconomica} onChange={(e) => setOpenEdit({ ...openEdit, actividadEconomica: e.target.value })} fullWidth />
                <TextField label="Dirección" value={openEdit.direccion} onChange={(e) => setOpenEdit({ ...openEdit, direccion: e.target.value })} fullWidth />
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(null)}>Cancelar</Button>
          <Button variant="contained" onClick={() => { if (!openEdit) return; const { id, ...rest } = openEdit; onSave(rest as Omit<Client,'id'>, id || undefined); }}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Ver */}
      <Dialog open={!!viewClient} onClose={() => setViewClient(null)} fullWidth maxWidth="sm">
        <DialogTitle>Cliente</DialogTitle>
        <DialogContent dividers>
          {viewClient && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Credenciales</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2"><strong>NIT/CUR/CI:</strong> {viewClient.nit || '—'}</Typography>
                <Button size="small" onClick={() => copyField(viewClient, 'nit')}>Copiar</Button>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2"><strong>Correo:</strong> {viewClient.correo || '—'}</Typography>
                <Button size="small" onClick={() => copyField(viewClient, 'correo')}>Copiar</Button>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2"><strong>Contraseña:</strong> {viewClient.credenciales.password || '—'}</Typography>
                <Button size="small" onClick={() => copyField(viewClient, 'password')}>Copiar</Button>
              </Stack>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Información general</Typography>
              <Typography variant="body2"><strong>Razón Social:</strong> {viewClient.razonSocial || '—'}</Typography>
              <Typography variant="body2"><strong>Tipo Contribuyente:</strong> {viewClient.tipoContribuyente || '—'}</Typography>
              <Typography variant="body2"><strong>Tipo Entidad:</strong> {viewClient.tipoEntidad || '—'}</Typography>
              <Typography variant="body2"><strong>Facturación:</strong> {viewClient.facturacion || '—'}</Typography>
              <Typography variant="body2"><strong>Actividad Económica:</strong> {viewClient.actividadEconomica || '—'}</Typography>
              <Typography variant="body2"><strong>Dirección:</strong> {viewClient.direccion || '—'}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewClient(null)}>Cerrar</Button>
          <Button variant="outlined" onClick={() => viewClient && [copyField(viewClient,'nit'), copyField(viewClient,'correo'), copyField(viewClient,'password')]}>Copiar todas secuencial</Button>
          <Button variant="contained" onClick={() => { if (viewClient) { setOpenEdit(viewClient); setViewClient(null); } }}>Editar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmaciones eliminación */}
      <Dialog open={confirmSel} onClose={() => setConfirmSel(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Eliminar los clientes seleccionados?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSel(false)}>Cancelar</Button>
          <Button color="warning" onClick={() => { deleteClients(Array.from(selectedClientIds)); setConfirmSel(false); }}>Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmAll} onClose={() => setConfirmAll(false)}>
        <DialogTitle>Eliminar todos</DialogTitle>
        <DialogContent>Esto eliminará todos los clientes. ¿Continuar?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAll(false)}>Cancelar</Button>
          <Button color="error" onClick={() => { deleteAllClients(); setConfirmAll(false); }}>Eliminar todos</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
