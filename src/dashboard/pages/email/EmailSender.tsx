import React, { useState, useRef, useEffect } from "react";
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
  Checkbox,
} from "@mui/material";
import translations from "../../../utils/translation.json";
import api from "../../../utils/api";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { useDashboard } from "../../../hooks";
import { toast } from "react-toastify";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { useDropzone } from "react-dropzone"; // Importa el hook de Dropzone
import { UploadFile, SaveAlt } from "@mui/icons-material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import howtouse from "../../../assets/Mi video-1.gif";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import { set } from "react-hook-form";
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
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedSection, setSelectedSection] = useState("clients"); // 'clients' o 'csv'
  const [csvClients, setCsvClients] = useState([]);
  const [selectedCsvData, setSelectedCsvData] = useState([]);
  const { clients, plan, accounts } = useDashboard(); // Clientes desde el hook de dashboard
  const isFreePlan = plan?.planStatus === "free";
  const isWithinLimit = Number(plan?.emailLimit) > Number(accounts.emailsSentCount);
  const emailEditorRef = useRef<EditorRef>(null); // Referencia al editor de email
  const { refreshAccount } = useAuthSlice();
  const { getPromotionsAndMetrics } = useDashboard();
  const [templates, setTemplates] = useState([]); // Para almacenar las plantillas
  const [templateName, setTemplateName] = useState(""); // Nombre de la plantilla
  const [openSaveDialog, setOpenSaveDialog] = useState(false); // Dialog para guardar plantilla
  const [openTemplatesDialog, setOpenTemplatesDialog] = useState(false); // Dialog para ver plantillas

  useEffect(() => {
    getPromotionsAndMetrics();
  }, []);

  const handleClick = () => {
    const whatsappNumber = "56996706983";
    const message = "¡Hola! Me gustaría obtener más información sobre pasar mi cuenta a pro. ¡Gracias!";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  };

  const isSendDisabled = !subject || subject === "";

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Enviar correos (abre el diálogo de confirmación)
  const handleSendEmails = () => {
    const totalEmails = contactSource === "csv" ? csvData.length : clients.length;
    setEmailCount(totalEmails);

    setOpenDialog(true); // Abrir el diálogo de confirmación
  };
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (section === "clients") {
      setCsvClients([]); // Limpiar los clientes del CSV al cambiar a la sección de 'Clientes'
    }
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Selecciona todos los emails ya sea de csvData o clients
      const newSelecteds =
        contactSource === "csv"
          ? csvData.map((row) => row.email) // Solo correo para selección
          : clients.map((client) => client.email); // Solo correo para selección

      if (contactSource === "csv") {
        setSelectedCsvData(newSelecteds); // Selecciona todos los correos del CSV
      } else {
        setSelectedClients(newSelecteds); // Selecciona todos los correos de los clientes
      }
    } else {
      // Deselecciona todos los emails
      if (contactSource === "csv") {
        setSelectedCsvData([]); // Deselecciona todos los correos del CSV
      } else {
        setSelectedClients([]); // Deselecciona todos los correos de los clientes
      }
    }
  };

  const handleCheckboxChange = (event, email) => {
    const isChecked = event.target.checked;

    if (contactSource === "csv") {
      // Manejar selección para CSV
      setSelectedCsvData((prevSelected) => (isChecked ? [...prevSelected, email] : prevSelected.filter((selected) => selected !== email)));
    } else {
      setSelectedClients((prevSelected) => (isChecked ? [...prevSelected, email] : prevSelected.filter((selected) => selected !== email)));
    }
  };
  // Confirmar el envío de correos
  const handleConfirmSend = async () => {
    setLoading(true);

    let recipients;

    if (contactSource === "csv") {
      recipients = csvData
        .filter((row) => selectedCsvData.includes(row.email) && row.email && /\S+@\S+\.\S+/.test(row.email))
        .map((row) => ({
          email: row.email,
          name: row.name || "Cliente",
        }));
    } else if (contactSource === "clients") {
      recipients = clients
        .filter((client) => selectedClients.includes(client.email) && client.email && /\S+@\S+\.\S+/.test(client.email))
        .map((client) => ({
          email: client.email,
          name: client.name || "Cliente",
        }));
    }
    if (recipients.length > plan.emailLimit - accounts.emailsSentCount) {
      if (plan.emailLimit >= accounts.emailsSentCount) {
        setLoading(false);
        return toast.info(`Te has quedado sin limite de emails. Hazte PRO ahora y aumenta tu límite a 10.000. 🚀`);
      } else {
        setLoading(false);
        return toast.info(`Te quedan disponibles ${plan.emailLimit - accounts.emailsSentCount} emails, por favor selecciona menos destinatarios.`);
      }
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
      console.log(recipients);
      //Enviar los datos del formulario (asunto, template, y lista de clientes)
      await api.post("/api/email/send", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Correo enviado correctamente.");
      refreshAccount();
      setSubject("");
      setCsvFile(null);
      setSelectedClients([]);
      emailEditorRef.current.editor.loadDesign({ body: { rows: [] } }); // Limpiar el editor
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error("Hubo un problema enviando el correo.");
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };
  useEffect(() => {
    refreshAccount();
  }, [clients]);
  useEffect(() => {
    refreshAccount();
  }, [loading]);

  const handleContactSourceChange = (event) => {
    setContactSource(event.target.value);
    setSelectedClients([]);
    setSelectedCsvData([]);
    if (event.target.value === "clients") {
      setCsvFile(null);
      setCsvData([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelectedClients([]);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Validar que el archivo sea CSV
    if (!file.name.endsWith(".csv")) {
      toast.error("El archivo debe ser un archivo CSV.");
      return;
    }

    setCsvFile(file);

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

        setCsvData(filteredData); // Si es menor a 500, cargar los datos
      },
    });
  };

  // Configurar el hook de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });
  const isSelectedAll =
    contactSource === "csv"
      ? selectedCsvData.length > 0 && selectedCsvData.length === csvData.length
      : selectedClients.length > 0 && selectedClients.length === clients.length;

  // Función para guardar una plantilla
  const handleSaveTemplate = async () => {
    try {
      const design = await new Promise((resolve) => {
        emailEditorRef.current.editor.saveDesign((design) => {
          resolve(design);
        });
      });

      const templateData = {
        name: templateName,
        design: design,
        subject: subject,
        userId: accounts._id,
      };

      const response = await api.post("/api/template/create", templateData);
      toast.success("Plantilla guardada correctamente");
      setOpenSaveDialog(false);
      setTemplateName("");
    } catch (error) {
      toast.error("Error al guardar la plantilla");
    }
  };
  console.log("esto es accounts ", accounts);
  // Función para cargar las plantillas
  const loadTemplates = async () => {
    try {
      const response = await api.get(`/api/template/${accounts._id}`);
      setTemplates(response.data);
    } catch (error) {
      toast.error("Error al cargar las plantillas");
    }
  };

  // Función para cargar una plantilla específica
  const loadTemplate = (template) => {
    emailEditorRef.current.editor.loadDesign(template.design);
    setSubject(template.subject);
    setOpenTemplatesDialog(false);
  };

  // Cargar plantillas al montar el componente
  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <motion.main
      initial='hidden'
      animate='visible'
      exit='hidden'
      variants={pageTransition}
      className='md:p-10 ml-4 md:ml-20 lg:ml-20 w-[95%] gap-5 m-auto h-full flex flex-col justify-center  '
    >
      <div className='flex w-full m-auto flex-col justify-center mb-12 text-lg p-12  rounded-md shadow-md shadow-gray-600/40  bg-gradient-to-br from-gray-50 to-main/40'>
        <div className='flex w-full space-y-2 md:space-y-0 flex-col md:flex-row md:space-x-6 justify-center m-auto'>
          <span>Correos enviados en los últimos 30 días: {accounts?.emailsSentCount || 0}</span>
          <span>Limite de correos al mes: {plan?.emailLimit}</span>
        </div>
        {!isWithinLimit ? (
          <span className='m-auto mt-6'>
            {plan?.planStatus === "free" ? (
              <span
                onClick={handleClick}
                className='p-2 w-[95%]  md:w-2/6 bg-main text-white hover:bg-main/90 duration-300 cursor-pointer rounded-md shadow-md shadow-gray-600/40 text-center m-auto mt-6'
              >
                Limite alcanzado. Hazte PRO ahora y aumenta tu límite a <span className='font-bold'>10.000</span>.
              </span>
            ) : (
              "Has alcanzado tu limite mensual"
            )}
          </span>
        ) : (
          <span className='flex m-auto'>
            <span className='flex m-auto'>
              Te quedan disponibles <span className='font-bold mx-1'> {plan.emailLimit - accounts.emailsSentCount} </span> emails.
            </span>{" "}
          </span>
        )}

        <div className='flex '>
          {isFreePlan && isWithinLimit ? (
            <span
              onClick={handleClick}
              className='p-2 w-[95%] md:w-2/6 bg-main text-white hover:bg-main/90 duration-300 cursor-pointer rounded-md shadow-md shadow-gray-600/40 text-center m-auto mt-6'
            >
              Hazte PRO ahora y aumenta tu límite a <span className='font-bold'>10.000</span>.
            </span>
          ) : (
            <span></span>
          )}
        </div>
      </div>
      <div className=' w-full gap-5'>
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
                  <span className='flex m-auto justify-center mt-2'></span>
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
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={isSelectedAll} // Si está seleccionado todo
                                onChange={handleSelectAllClick} // Función para seleccionar todo
                                indeterminate={selectedCsvData.length > 0 && selectedCsvData.length < csvData.length} // Selección parcial
                              />
                            </TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo Electrónico</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index} hover>
                              <TableCell padding='checkbox'>
                                <Checkbox
                                  checked={selectedCsvData.indexOf(row.email) !== -1} // Verifica si está seleccionado
                                  onChange={(event) => handleCheckboxChange(event, row.email)} // Cambia el estado
                                />
                              </TableCell>
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
                        <TableCell padding='checkbox'>
                          <Checkbox
                            checked={isSelectedAll}
                            onChange={handleSelectAllClick}
                            indeterminate={selectedClients.length > 0 && selectedClients.length < clients.length}
                          />
                        </TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo Electrónico</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                        <TableRow key={client.email} hover>
                          <TableCell padding='checkbox'>
                            <Checkbox checked={selectedClients.indexOf(client.email) !== -1} onChange={(event) => handleCheckboxChange(event, client.email)} />
                          </TableCell>
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
            <div className='flex flex-col my-6'>
              <span>
                En el editor puedes usar <span className='font-bold'>{`{nombreCliente}`}</span> para personalizar tus correos.
              </span>{" "}
              <span className='italic'>
                Ejemplo: Hola <span className='font-bold'>{`{nombreCliente}`}</span> nos contactamos contigo para contarte de nuestra nueva promoción.{" "}
              </span>
            </div>
            <Typography variant='h6'>Editor de Email</Typography>
            <div id='email-editor' ref={emailEditorRef} style={{ height: "600px" }}>
              <EmailEditor ref={emailEditorRef} options={{ locale: "es-ES" }} />
            </div>
          </div>

          {/* Agregar botones para gestionar plantillas cerca del editor de email */}
          <div className='flex gap-4 my-4'>
            <Button variant='contained' startIcon={<SaveAlt />} onClick={() => setOpenSaveDialog(true)}>
              Guardar como plantilla
            </Button>
            <Button variant='outlined' startIcon={<DescriptionRoundedIcon />} onClick={() => setOpenTemplatesDialog(true)}>
              Cargar plantilla
            </Button>
          </div>

          {/* Asunto del Email */}

          {/* Botón para enviar el correo */}
          <Button
            variant='contained'
            color='primary'
            fullWidth
            disabled={isSendDisabled || (!selectedClients.length && !selectedCsvData.length)}
            onClick={handleSendEmails}
          >
            Enviar Correos
          </Button>
        </Box>
      </div>

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de enviar correos a {selectedClients.length + selectedCsvData.length} destinatarios. ¿Estás seguro?
          </DialogContentText>
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

      {/* Dialog para guardar plantilla */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Guardar Plantilla</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin='dense' label='Nombre de la plantilla' fullWidth value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveTemplate} disabled={!templateName}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para mostrar y seleccionar plantillas */}
      <Dialog open={openTemplatesDialog} onClose={() => setOpenTemplatesDialog(false)} maxWidth='md' fullWidth>
        <DialogTitle>Mis Plantillas</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Asunto</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.subject}</TableCell>
                    <TableCell>
                      <Button variant='contained' size='small' onClick={() => loadTemplate(template)}>
                        Usar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTemplatesDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Cargando */}
      <Backdrop open={loading} style={{ color: "#fff" }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </motion.main>
  );
};
