import { Client } from '../store/useAppStore';

export const sampleClients: Client[] = [
  {
    id: 'c1',
    nit: '123456789',
    razonSocial: 'Alpha SRL',
    tipoContribuyente: 'General',
    tipoEntidad: 'SRL',
    facturacion: 'Electrónica',
    actividadEconomica: 'Servicios',
    direccion: 'Av. Central 123',
    correo: 'contacto@alpha.com',
    credenciales: { password: 'alpha123' }
  }
];
