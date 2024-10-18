import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import translations from "../../../utils/translation.json";
import api from "../../../utils/api";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { useDashboard } from "../../../hooks";
import { toast } from "react-toastify";
import { EmailEditor } from "react-email-editor"; // Importar ReactEmailEditor
import { useDropzone } from "react-dropzone"; // Importa el hook de Dropzone
import { UploadFile } from "@mui/icons-material";
import howtouse from "../../../assets/Mi video-1.gif";
const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const EmailSender = () => {
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [contactSource, setContactSource] = useState("csv"); // Estado para la fuente de contactos (CSV o Clientes)
  const [csvFile, setCsvFile] = useState(null); // Archivo CSV seleccionado
  const [subject, setSubject] = useState(""); // Asunto del correo
  const [csvData, setCsvData] = useState([]); // Datos del CSV cargado
  const [page, setPage] = useState(0); // Página actual para paginación
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [openDialog, setOpenDialog] = useState(false); // Control del diálogo de confirmación
  const [emailCount, setEmailCount] = useState(0); // Cantidad de correos a enviar
  const [loading, setLoading] = useState(false); // Estado de carga para enviar correos
  const [openWarningDialog, setOpenWarningDialog] = useState(false); // Diálogo de advertencia para más de 500 contactos
  const { clients } = useDashboard(); // Clientes desde el hook de dashboard

  const emailEditorRef = useRef(); // Referencia al editor de email

  // Deshabilitar el botón de enviar si el asunto está vacío
  const isSendDisabled = !subject || subject === "";

  // Manejo del cambio de fuente de contacto (CSV o Clientes)

  // Manejo de cambio de asunto
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Enviar correos (abre el diálogo de confirmación)
  const handleSendEmails = () => {
    const totalEmails = contactSource === "csv" ? csvData.length : clients.length;
    setEmailCount(totalEmails);

    if (totalEmails > 500) {
      setOpenWarningDialog(true); // Mostrar diálogo de advertencia si hay más de 500 contactos
    } else {
      setOpenDialog(true); // Abrir el diálogo de confirmación
    }
  };

  // Confirmar el envío de correos
  const handleConfirmSend = async () => {
    setLoading(true);

    let recipients = [];

    // Seleccionar destinatarios según la fuente de contactos
    if (contactSource === "csv") {
      recipients = csvData.filter((row) => row.email && /\S+@\S+\.\S+/.test(row.email));
    } else if (contactSource === "clients") {
      recipients = clients.filter((client) => client.email && /\S+@\S+\.\S+/.test(client.email));
    }

    // Validar si hay destinatarios válidos
    if (recipients.length === 0) {
      toast.error("No hay destinatarios válidos.");
      setLoading(false);
      setOpenDialog(false);
      return;
    }

    try {
      // Exportar el contenido del editor de emails
      const templateHtml = await new Promise((resolve, reject) => {
        if (emailEditorRef.current) {
          emailEditorRef.current.editor.exportHtml((data) => {
            const { html } = data;
            if (html && html.trim() !== "") {
              resolve(html);
            } else {
              reject("El contenido del email está vacío.");
            }
          });
        } else {
          reject("Editor no disponible.");
        }
      });

      const formData = {
        subject: subject,
        template: templateHtml,
        clients: recipients,
      };

      // Enviar los datos del formulario (asunto, template, y lista de clientes)
      await api.post("/api/email/send", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Correo enviado correctamente.");
      setSubject("");
      setCsvFile(null);
      emailEditorRef.current.editor.loadDesign({ body: { rows: [] } }); // Limpiar el editor
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error("Hubo un problema enviando el correo.");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };
  const handleContactSourceChange = (event) => {
    setContactSource(event.target.value);
    if (event.target.value === "clients") {
      setCsvFile(null); // Limpiar CSV si seleccionamos "Clientes"
      setCsvData([]); // Limpiar datos del CSV
    }
  };
  // Funciones para manejar la paginación de los datos
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para manejar el archivo CSV con react-dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Validar que el archivo sea CSV
    if (!file.name.endsWith(".csv")) {
      toast.error("El archivo debe ser un archivo CSV.");
      return;
    }

    setCsvFile(file);

    // Parsear el archivo CSV usando papaparse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const filteredData = results.data
          .map((row) => ({
            name: row.nombre || row.Name || row.name || row.Nombre,
            email: row.email || row.Email || row.correo || row.Correo,
          }))
          .filter((row) => row.name || row.email); // Filtrar filas sin nombre ni email

        if (filteredData.length > 500) {
          toast.error("El archivo CSV contiene más de 500 contactos, no se puede cargar.");
        } else {
          setCsvData(filteredData); // Si es menor a 500, cargar los datos
        }
      },
    });
  };

  // Configurar el hook de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <motion.main initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='w-full h-full flex flex-row relative'>
      <div className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5'>
        <Box>
          <span className='font-bold text-3xl pb-6 flex'>A continuación podrás crear emails y enviarlos masivamente.</span>

          {/* Selección de fuente de contacto (CSV o Clientes) */}
          <Select value={contactSource} onChange={handleContactSourceChange} fullWidth margin='normal'>
            <MenuItem value='csv'>Cargar CSV</MenuItem>
            <MenuItem value='clients'>Clientes</MenuItem>
          </Select>

          {/* Cargar archivo CSV usando react-dropzone */}
          {contactSource === "csv" && (
            <>
              <div {...getRootProps()} style={{ border: "2px dashed #007BFF", padding: "20px", textAlign: "center", marginTop: "20px" }}>
                <input {...getInputProps()} />
                <div>
                  <UploadFile fontSize='large' color='action' />
                  <Typography variant='h6'>Arrastra y suelta tu archivo CSV aquí, o haz clic para seleccionar</Typography>
                  <Button variant='contained' color='primary' sx={{ marginTop: 2 }}>
                    Subir archivo
                  </Button>
                  <span className='flex m-auto justify-center mt-2'>(Maximo 500 clientes por csv.)</span>
                </div>{" "}
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
              {csvData.length > 0 && (
                <Box mt={4}>
                  <Typography variant='h6'>Vista previa del CSV:</Typography>
                  <Paper>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo Electrónico</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={csvData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage='Filas por página'
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                  />
                </Box>
              )}
            </>
          )}
          {contactSource === "clients" && (
            <>
              <Typography variant='h6'>Lista de clientes:</Typography>
              <Box mt={2}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo Electrónico</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client, index) => (
                        <TableRow key={index}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={clients.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Filas por página'
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                />
              </Box>
            </>
          )}
          {/* Editor de Email */}
          <TextField label='Asunto del Email' variant='outlined' fullWidth margin='normal' value={subject} onChange={handleSubjectChange} />
          <div className='my-4'>
            <Typography variant='h6'>Editor de Email</Typography>
            <div className='w-[50vw]  md:w-3/4 lg:w-1/2 m-auto'>
              <EmailEditor
                ref={emailEditorRef}
                options={{
                  locale: translations,
                }}
              />
            </div>
          </div>

          {/* Asunto del Email */}

          {/* Botón para enviar el correo */}
          <Button variant='contained' color='primary' fullWidth disabled={isSendDisabled} onClick={handleSendEmails}>
            Enviar Correos
          </Button>
        </Box>
      </div>

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <DialogContentText>Estás a punto de enviar correos a {emailCount} destinatarios. ¿Estás seguro?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleConfirmSend} color='primary'>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Advertencia cuando hay más de 500 contactos */}
      <Dialog open={openWarningDialog} onClose={() => setOpenWarningDialog(false)}>
        <DialogTitle>Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText>El archivo CSV contiene más de 500 contactos. No se puede cargar el archivo.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWarningDialog(false)} color='primary'>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cargando */}
      <Backdrop open={loading} style={{ color: "#fff" }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </motion.main>
  );
};
