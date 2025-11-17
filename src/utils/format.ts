export const formatNit = (nit: string) => nit.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
