import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem,
  DialogContentText,
} from "@mui/material";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { UploadFile, PersonAdd, PersonOff } from "@mui/icons-material";

import { useDashboard } from "../../../../hooks";
import api from "../../../../utils/api";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../../../hooks/useNavigateTo";
import { ReactTyped } from "react-typed";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";
import { Trash2 } from "lucide-react";

// Definir el tipo para los clientes
interface Client {
  name: string;
  email: string;
  addedPromotions: string[];
}

interface ClientTableProps {
  clients: Client[];
}

const ClientTable: React.FC<ClientTableProps> = ({ clients }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { refreshAccount } = useAuthSlice();
  const { accounts, getPromotionsAndMetrics, plan } = useDashboard();
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const { handleNavigate } = useNavigateTo();
  const [csvClients, setCsvClients] = useState<Client[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el loading
  const [selectedClient, setSelectedClient] = useState<string | null>(null); // Track the client to delete


  const handleDeleteClient = async (id: string) => {
    try {
      const clientId = id;
      const accountId = accounts._id;
      const resp = await api.delete(`/api/clients/deleteclient`, { data: { accountId, clientId } });
      toast.info("Cliente eliminado");
      refreshAccount();
      location.reload();
    } catch (error) {
      toast.error("Hubo un problema al eliminar. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    getPromotionsAndMetrics();
    refreshAccount();
  }, []);
  const addClient = async () => {
    if (newClientName && newClientEmail) {
      const formattedName = formatClientName(newClientName);
      const formattedEmail = formatClientEmail(newClientEmail);
      const formattedPhone = formatClientPhone(newClientPhone);

      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formattedEmail)) {
        toast.error("Por favor ingresa un email válido");
        return;
      }

      //Validación básica de teléfono debe comenzar con + y tener al menos 8 dígitos
      const phoneRegex = /^\+[0-9]{8,}$/;
      if (formattedPhone && !phoneRegex.test(formattedPhone)) {
        toast.error("Por favor ingresa un teléfono válido, comenzando con + y el código de país");
        return;
      }

      const newClient = {
        accountId: accounts._id,
        clientData: {
          name: formattedName,
          email: formattedEmail,
          phoneNumber: formattedPhone,
        },
      };

      try {
        const response = await api.post("/api/clients/addClient", newClient);

        toast.info(`Cliente ${formattedName} agregado.`);
        setNewClientName("");
        setNewClientEmail("");
        setNewClientPhone("");
        location.reload();


      } catch (error) {
        if (error.response?.data?.message === "Client already exists in this account") {
          toast.info("El cliente ya existe.");
        } else {
          toast.error("Error al agregar cliente.");
        }
        console.error("Error al agregar cliente", error);
      } finally {
        refreshAccount();
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  useEffect(() => { }, [refreshAccount]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (clientId: string) => {
    setSelectedClient(clientId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function formatClientName(name: string) {
    const trimmedName = name.trim();
    if (trimmedName) {
      return trimmedName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }
    return "";
  }

  function formatClientEmail(email: string) {
    return email.trim().toLowerCase();
  }

  function formatClientPhone(email: string) {
    return email.trim().toLowerCase();
  }

  const handleCsvData = (data: any[]) => {
    const newClients: Client[] = data
      .map((row: any) => {
        // Solo tomar las columnas 'name' y 'email', ignorando otras
        const clientName = row.nombre || row.Name || row.name || row.Nombre || ""; // Buscar variantes de "name"
        const clientEmail = row.email || row.Email || ""; // Buscar variantes de "email"

        // Retornar el cliente solo si tiene un correo válido (nombre es opcional)
        if (clientEmail.trim()) {
          // Validar solo el correo
          return {
            name: clientName.trim() || "Cliente", // Si no hay nombre, asignar una cadena vacía
            email: clientEmail.trim(),
            addedPromotions: [],
          };
        }
        return null; // Retornar null si no hay un correo válido
      })
      .filter(Boolean); // Filtrar los valores nulos

    setCsvClients(newClients);
    setOpenDialog(true); // Abrir el diálogo para previsualizar los clientes
  };

  // Implementación de Dropzone para CSV
  const CsvDropzone = () => {
    const onDrop = useCallback((acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setLoading(true); // Activar el loading
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true, // Ignorar líneas vacías durante el parseo
          complete: (result) => {
            const filteredData = result.data.filter((row) => {
              // Verifica si todas las columnas tienen algún valor
              return Object.values(row).some((value) => value.trim() !== "");
            });
            handleCsvData(filteredData); // Pasar los datos filtrados
            setLoading(false); // Desactivar el loading
          },
        });
      }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "text/csv": [".csv"] },
      multiple: false,
    });

    return (
      <Paper
        {...getRootProps()}
        sx={{
          padding: 2,
          border: "2px dashed #ccc",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant='h6' color='primary'>
            Suelta el archivo aquí...
          </Typography>
        ) : (
          <div>
            <UploadFile fontSize='large' color='action' />
            <Typography variant='h6'>Arrastra y suelta tu archivo CSV aquí, o haz clic para seleccionar</Typography>
            <Button variant='contained' color='primary' sx={{ marginTop: 2 }}>
              Subir archivo
            </Button>
            <span className='flex m-auto justify-center mt-2'>{plan?.planStatus === "free" ? "" : ""}</span>
          </div>
        )}
      </Paper>
    );
  };

  const batchSize = 200;

  const confirmCsvClients = async () => {
    setLoading(true);
    setOpenDialog(false);

    try {
      const validClients = csvClients.filter((client) => client.name && client.email);

      for (let i = 0; i < validClients.length; i += batchSize) {
        const clientBatch = validClients.slice(i, i + batchSize);

        const response = await api.post("/api/clients/addClientsBatch", {
          accountId: accounts._id,
          clientsData: clientBatch,
        });
      }

      toast.info("Clientes agregados correctamente");
    } catch (error) {
      console.error("Error al agregar clientes:", error);
      toast.error("Error al agregar clientes. Verifique la consola.");
    } finally {
      await getPromotionsAndMetrics();
      setLoading(false);
    }
  };

  return (
    <section className='w-full'>
      <div className='w-[95%] flex flex-col md:flex-col m-auto justify-between mb-10'>
        {/* Tabla de clientes */}
        <div className='flex flex-col md:flex-row m-auto mb-8 w-[100%] space-y-2 md:space-y-0 md:space-x-2 md:justify-center'>
          <Paper
            elevation={0}
            sx={{
              width: "95%",
              m: "auto",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderTop: "4px solid #5b7898",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {!accounts.clients?.length ? (
              <section className='p-8 text-center'>
                <div className='flex flex-col items-center space-y-4'>
                  <PersonOff sx={{ fontSize: 48, color: "#5b7898" }} />
                  <span className='text-lg text-gray-600'>No hay clientes disponibles, empieza agregando uno arriba o sube un archivo CSV.</span>
                </div>
              </section>
            ) : (
              <>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: "#5b7898" }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#5b7898" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#5b7898" }}>Teléfono</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#5b7898" }}>Segmentos</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#5b7898" }}>Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clients && clients.length > 0 ? (
                        clients
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .reverse()
                          .map((client) => {
                            return (
                              <TableRow hover key={client.email}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phoneNumber || "-"}</TableCell>
                                <TableCell>{client.tags ? client.tags.join(", ") : ""}</TableCell>

                                <TableCell>
                                  <Trash2
                                    onClick={() => handleClickOpen(client._id)} // Pass client ID to open dialog
                                    className='text-red-600 w-5 justify-center flex cursor-pointer' />
                                  <Dialog
                                    open={selectedClient === client._id} // Only open for the selected client
                                    onClose={handleClose}
                                    aria-labelledby='alert-dialog-title'
                                    aria-describedby='alert-dialog-description'
                                  >

                                    <DialogTitle id='alert-dialog-title'>{`¿Estás seguro de eliminar al cliente?`}</DialogTitle>
                                    <DialogContent>
                                      <DialogContentText id='alert-dialog-description'>Esta acción no se puede deshacer.</DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleClose}>Cancelar</Button>
                                      <Button
                                        onClick={() => {
                                          handleDeleteClient(client._id);
                                          handleClose();
                                        }}
                                        color='error'
                                        autoFocus
                                      >
                                        Eliminar
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} textAlign='center'>
                            No hay clientes disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  sx={{
                    ".MuiTablePagination-select": {
                      color: "#5b7898",
                    },
                    ".MuiTablePagination-selectIcon": {
                      color: "#5b7898",
                    },
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={clients?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Filas por página'
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
              </>
            )}
          </Paper>
        </div>

        {/* Agregar nuevos clientes */}
        <div className='flex flex-col md:flex-row m-auto mb-8 w-[95%] space-y-2 md:space-y-0 md:space-x-2 md:justify-center'>
          <Typography variant='h5' className='m-auto mb-8∂'>Agrega nuevos clientes</Typography>
        </div>

        <div className='flex flex-col md:flex-row m-auto mb-8 w-[95%] space-y-2 md:space-y-0 md:space-x-2 md:justify-center'>
          <TextField
            label='Nombre'
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#5b7898",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5b7898",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#5b7898",
              },
            }}
          />
          <TextField
            label='Email'
            value={newClientEmail}
            onChange={(e) => setNewClientEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#5b7898",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5b7898",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#5b7898",
              },
            }}
          />
          <TextField
            label='Phone'
            value={newClientPhone}
            onChange={(e) => setNewClientPhone(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#5b7898",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5b7898",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#5b7898",
              },
            }}
          />
          <Button
            variant='contained'
            onClick={addClient}
            sx={{
              bgcolor: "#5b7898",
              height: "56px",
              "&:hover": {
                bgcolor: "#4a6277",
              },
            }}
            startIcon={<PersonAdd />}
          >
            Agregar Cliente
          </Button>
        </div>

        {/* Subir CSV */}
        <div className='w-[95%] m-auto mb-8'>
          <Paper
            elevation={0}
            sx={{
              border: "2px dashed #5b7898",
              borderRadius: "8px",
              bgcolor: "#f8fafc",
            }}
          >
            <CsvDropzone />
          </Paper>
        </div>

        {/* Dialog para cargar CSV */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Clientes desde CSV</DialogTitle>
          <DialogContent>
            <Typography variant='body2'>Tienes {csvClients.length} clientes listos para cargar.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color='primary'>
              Cancelar
            </Button>
            <Button onClick={confirmCsvClients} color='primary'>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
          open={loading}
        >
          {" "}
          <div className='flex flex-col space-y-6 m-auto'>
            <CircularProgress color='inherit' className='m-auto' />
            <div>
              <ReactTyped
                strings={["Cargando clientes...", "Esto puede durar un poco ⌛", "Gracias por tu paciencia.", "Ya casi estamos listos 🚀"]}
                typeSpeed={50}
                backSpeed={30}
                loop
              />
            </div>
          </div>
        </Backdrop>
      </div>
    </section>
  );
};

export default ClientTable;
