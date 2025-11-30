import React, { createContext, useContext, useState, useEffect } from 'react';

const ClientContext = createContext(null);

export const useClients = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClients must be used within a ClientProvider');
    }
    return context;
};

export const ClientProvider = ({ children }) => {
    const [clients, setClients] = useState(() => {
        const stored = localStorage.getItem('clients');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

    const addClient = (clientData) => {
        const newClient = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            ...clientData,
            archivos: [],
            anotaciones: [],
            fechaCreacion: new Date().toISOString(),
        };
        setClients([...clients, newClient]);
        return newClient;
    };

    const updateClient = (id, clientData) => {
        setClients(clients.map(client =>
            client.id === id ? { ...client, ...clientData } : client
        ));
    };

    const deleteClient = (id) => {
        setClients(clients.filter(client => client.id !== id));
    };

    const getClientById = (id) => {
        return clients.find(client => client.id === id);
    };

    const addFileToClient = (clientId, fileData) => {
        setClients(clients.map(client => {
            if (client.id === clientId) {
                return {
                    ...client,
                    archivos: [...(client.archivos || []), fileData]
                };
            }
            return client;
        }));
    };

    const deleteFileFromClient = (clientId, fileId) => {
        setClients(clients.map(client => {
            if (client.id === clientId) {
                return {
                    ...client,
                    archivos: client.archivos.filter(file => file.id !== fileId)
                };
            }
            return client;
        }));
    };

    const getClientFiles = (clientId, filters = {}) => {
        const client = getClientById(clientId);
        if (!client || !client.archivos) return [];

        let files = client.archivos;

        if (filters.año) {
            files = files.filter(file => file.año === filters.año);
        }

        if (filters.periodo) {
            files = files.filter(file => file.periodo === filters.periodo);
        }

        return files;
    };

    const searchClients = (searchTerm) => {
        if (!searchTerm) return clients;

        const term = searchTerm.toLowerCase();
        return clients.filter(client =>
            client.nit?.toLowerCase().includes(term) ||
            client.correo?.toLowerCase().includes(term) ||
            client.razonSocial?.toLowerCase().includes(term) ||
            client.contacto?.toLowerCase().includes(term)
        );
    };

    const filterByNitLastDigit = (digit) => {
        if (digit === null || digit === undefined || digit === '') return clients;

        return clients.filter(client => {
            const nit = client.nit?.replace(/\D/g, ''); // Remove non-digits
            if (!nit) return false;
            return nit[nit.length - 1] === digit.toString();
        });
    };

    const getAllClientFiles = (filters = {}) => {
        const result = [];

        clients.forEach(client => {
            if (!client.archivos || client.archivos.length === 0) return;

            let files = client.archivos;

            // Apply filters
            if (filters.año) {
                files = files.filter(file => file.año === filters.año);
            }

            if (filters.periodo) {
                files = files.filter(file => file.periodo === filters.periodo);
            }

            if (files.length > 0) {
                result.push({
                    client: client,
                    files: files
                });
            }
        });

        return result;
    };

    const addAnnotationToClient = (clientId, annotationData) => {
        setClients(clients.map(client => {
            if (client.id === clientId) {
                return {
                    ...client,
                    anotaciones: [...(client.anotaciones || []), annotationData]
                };
            }
            return client;
        }));
    };

    const deleteAnnotationFromClient = (clientId, annotationId) => {
        setClients(clients.map(client => {
            if (client.id === clientId) {
                return {
                    ...client,
                    anotaciones: client.anotaciones.filter(annotation => annotation.id !== annotationId)
                };
            }
            return client;
        }));
    };

    const updateAnnotationFromClient = (clientId, annotationId, updatedText) => {
        setClients(clients.map(client => {
            if (client.id === clientId) {
                return {
                    ...client,
                    anotaciones: client.anotaciones.map(annotation =>
                        annotation.id === annotationId
                            ? { ...annotation, texto: updatedText, fechaModificacion: new Date().toISOString() }
                            : annotation
                    )
                };
            }
            return client;
        }));
    };

    const getClientAnnotations = (clientId) => {
        const client = getClientById(clientId);
        if (!client || !client.anotaciones) return [];
        return client.anotaciones;
    };

    const value = {
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        addFileToClient,
        deleteFileFromClient,
        getClientFiles,
        getAllClientFiles,
        searchClients,
        filterByNitLastDigit,
        addAnnotationToClient,
        deleteAnnotationFromClient,
        updateAnnotationFromClient,
        getClientAnnotations,
    };

    return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};
