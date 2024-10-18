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
} from "@mui/material";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { UploadFile } from "@mui/icons-material";
import howtouse from "../../../assets/Mi video-1.gif";
import { useDashboard } from "../../../hooks";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

// Definir el tipo para los clientes
interface Client {
  name: string;
  email: string;
  addedPromotions: string[];
}

interface ClientTableProps {
  clients: Client[];
}

const ClientTable: React.FC<ClientTableProps> = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { accounts, getPromotionsAndMetrics, clients, promotions } = useDashboard();
  const [displayedClients, setDisplayedClients] = useState<Client[]>(clients); // Inicializar con los clientes
  const [showHowToUse, setShowHowToUse] = useState(false);

  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const { handleNavigate } = useNavigateTo();
  const [csvClients, setCsvClients] = useState<Client[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el loading

  useEffect(() => {
    getPromotionsAndMetrics();

    setDisplayedClients(clients);
  }, []); // Asegúrate de actualizar los clientes cuando cambien

  // Controlar la paginación
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Agregar un nuevo cliente manualmente
  const addClient = async () => {
    if (newClientName && newClientEmail) {
      const newClient = {
        accountId: accounts._id,
        clientData: {
          name: newClientName,
          email: newClientEmail,
        },
      };

      try {
        await api.post("/api/clients/addClient", newClient);

        setDisplayedClients([...displayedClients, { name: newClientName, email: newClientEmail, addedPromotions: [] }]);
        toast.info(`Cliente ${newClientName} agregado.`);
        setNewClientName("");
        setNewClientEmail("");
        await getPromotionsAndMetrics();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message === "Client already exists in this account") {
          toast.info("El cliente ya existe.");
        } else {
          toast.error("Error al agregar cliente.");
        }
        console.error("Error al agregar cliente", error);
      }
    }
  };
  const getClientPromotion = (client: Client) => {
    console.log(client);

    console.log("Promotions:", promotions);
    console.log("Client Added Promotions:", client.addedpromotions);

    // Inicializa addedpromotions como array vacío si está undefined
    const addedPromotions = client.addedpromotions || [];

    // Verifica que promotions exista
    if (!promotions) {
      return null;
    }

    // Filtra las promociones que coincidan con los IDs en client.addedpromotions
    const clientPromotions = promotions.filter((promo) => addedPromotions.some((addedPromo) => addedPromo.promotion === promo._id));

    console.log("Client Promotions:", clientPromotions);

    // Devuelve las promociones o null si no hay coincidencias
    return clientPromotions.length > 0 ? clientPromotions : null;
  };

  // Manejar la carga de archivos CSV
  const handleCsvData = (data: any[]) => {
    if (data.length > 500) {
      toast.error("El archivo CSV no puede contener más de 500 clientes.");
      return;
    }

    const newClients: Client[] = data.map((row: any) => {
      // Asumiendo que 'nombre', 'Name', 'email', etc. pueden aparecer en el CSV
      const clientName = row.nombre || row.Name || row.name || row.Nombre; // Buscar variantes de "name"
      const clientEmail = row.email || row.Email; // Buscar variantes de "email"

      return {
        name: clientName,
        email: clientEmail,
        addedPromotions: [],
      };
    });

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
            <span className='flex m-auto justify-center mt-2'>(Maximo 500 clientes por csv.)</span>
          </div>
        )}
      </Paper>
    );
  };

  const confirmCsvClients = async () => {
    try {
      setLoading(true);
      setOpenDialog(false);

      const requests = csvClients.map((client) => {
        console.log(client.name, client.email);

        const cleanedName = client.name;
        const formattedName = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1).toLowerCase();

        return api.post("/api/clients/addClient", {
          accountId: accounts._id,
          clientData: {
            name: formattedName,
            email: client.email.trim(),
          },
        });
      });

      await Promise.all(requests);

      await getPromotionsAndMetrics();
      toast.info("Clientes agregados correctamente");
      setLoading(false);
    } catch (error) {
      console.error("Error al agregar clientes:", error);
      setLoading(false);
    }
  };

  return (
    <section>
      <div className='w-[95%] flex flex-col md:flex-col m-auto justify-between mb-20'>
        {/* Inputs para agregar cliente manualmente */}
        <div className='flex flex-row m-auto mb-12'>
          <TextField label='Nombre' value={newClientName} onChange={(e) => setNewClientName(e.target.value)} style={{ marginRight: "10px" }} />
          <TextField label='Email' value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} />
          <div className='flex'>
            <Button variant='contained' color='primary' onClick={addClient} style={{ marginLeft: "10px", display: "flex", height: "50px" }}>
              Agregar Cliente
            </Button>
          </div>
        </div>

        {/* Componente Dropzone */}
        <div className='w-[50%] m-auto'>
          <CsvDropzone />
        </div>
        <div
          onClick={() => setShowHowToUse(!showHowToUse)} // Mostrar al hacer hover
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          {showHowToUse ? (
            <Typography variant='body2' color='primary' sx={{ cursor: "pointer" }}>
              Cerrar video.
            </Typography>
          ) : (
            <Typography variant='body2' color='primary' sx={{ cursor: "pointer" }}>
              ¿Cómo usar esta funcionalidad?
            </Typography>
          )}

          {showHowToUse && (
            <div className='flex m-auto text-center justify-center' style={{ marginTop: "10px" }}>
              <img src={howtouse} alt='Cómo usar' style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          )}
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
        {!clients.length ? (
          <section className='shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-100 to-main/30 p-6 rounded-md'>
            <div className='flex flex-col space-y-6'>
              <span className='text-center text-lg text-black/60'>No hay clientes disponibles, empieza agregando uno arriba o sube un archivo CSV.</span>
            </div>
          </section>
        ) : (
          <>
            {/* Tabla de clientes */}
            <TableContainer>
              <Table stickyHeader aria-label='client table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Promociones</TableCell> {/* Nueva columna de promociones */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .reverse()
                    .map((client) => {
                      const clientPromotions = getClientPromotion(client); // Obtener promociones del cliente
                      return (
                        <TableRow hover key={client.email}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>
                            {clientPromotions ? (
                              <Select value='' displayEmpty>
                                <MenuItem value='' disabled>
                                  Promociones
                                </MenuItem>
                                {clientPromotions.map((promo) => (
                                  <MenuItem key={promo._id} value={promo._id} onClick={() => handleNavigate(`/promotion/${promo._id}`)}>
                                    {promo.title}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              "Sin promociones"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación solo si hay clientes */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={clients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}

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

        {/* Backdrop de carga */}
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
          <CircularProgress color='inherit' />
          <Typography>Cargando clientes...</Typography>
        </Backdrop>
      </Paper>
    </section>
  );
};

export default ClientTable;
