import React, { useState, useRef, useEffect } from "react";
import EmailEditor, { EditorRef } from "react-email-editor";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { useDashboard } from "../../../hooks";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import api from "../../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

// Material UI
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  TablePagination,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// Icons
import { Mail as MailIcon, Upload as UploadIcon, Bolt as BoltIcon, Save as SaveIcon, Description as DescriptionIcon } from "@mui/icons-material";

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
  const [currentTab, setCurrentTab] = useState("design");
  const [emailDesign, setEmailDesign] = useState(null);
  const [loadingDialog, setLoadingDialog] = useState(false);

  useEffect(() => {
    getPromotionsAndMetrics();
  }, []);

  const handleWhatsAppClick = () => {
    const whatsappNumber = "56996706983";
    const message = "¡Hola! Me gustaría obtener más información sobre pasar mi cuenta a pro. ¡Gracias!";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  };

  const isSendDisabled = !subject || subject === "";

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  // Enviar correos (abre el diálogo de confirmación)
  const handleSendEmails = async () => {
    const totalEmails = contactSource === "csv" ? selectedCsvData.length : selectedClients.length;
    setEmailCount(totalEmails);

    if (currentTab === "recipients") {
      setCurrentTab("design");
      if (emailDesign) {
        setTimeout(() => {
          emailEditorRef.current.editor.loadDesign(emailDesign);
        }, 1000);
      }
    } else {
      setOpenDialog(true);
    }
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
    setLoadingDialog(true);
    setOpenDialog(false);

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
      setLoadingDialog(false);
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
    if (!file) return;

    // Validar que el archivo sea CSV
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("El archivo debe ser un archivo CSV.");
      return;
    }

    setCsvFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error("Error al procesar el archivo CSV");
          return;
        }

        const filteredData = results.data
          .map((row) => ({
            name: row.nombre || row.Name || row.name || row.Nombre || "",
            email: row.email || row.Email || row.correo || row.Correo || "",
          }))
          .filter((row) => row.email && row.email.includes("@")); // Filtrar emails inválidos

        if (filteredData.length === 0) {
          toast.error("No se encontraron datos válidos en el CSV");
          return;
        }

        setCsvData(filteredData);
        toast.success(`Se cargaron ${filteredData.length} contactos del CSV`);
      },
      error: (error) => {
        toast.error("Error al leer el archivo CSV");
        console.error(error);
      },
    });
  };

  // Actualizar la configuración de dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
      "application/csv": [".csv"],
    },
    multiple: false,
    maxFiles: 1,
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
      setTemplates((prevTemplates) => [...prevTemplates, response.data]);
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

  // Actualizar la configuración del editor
  const emailEditorOptions = {
    locale: "es",
    features: {
      responsiveDesign: true,
    },
    appearance: {
      theme: "light",
    },
    tools: {
      // Herramientas existentes...
      image: { enabled: true },
      button: { enabled: true },
      text: { enabled: true },
      social: {
        enabled: true,
        networks: ["facebook", "twitter", "instagram", "linkedin", "youtube", "whatsapp"],
      },
      socialGroup: { enabled: true },
      divider: { enabled: true },
      html: { enabled: true },
      menu: { enabled: true },
      layout: { enabled: true },
    },
    translations: {
      es: {
        "tools.social.name": "Redes Sociales",
        "tools.socialGroup.name": "Grupo de Redes Sociales",
        "tabs.body.title": "Contenido",
        "tabs.style.title": "Estilo",
        "tabs.settings.title": "Configuración",
        "content.button.text": "Botón",
        "content.text.text": "Texto",
        "content.image.text": "Imagen",
        // Agregar más traducciones según necesites
      },
    },
    displayMode: "email",
    projectId: 1234,
    minHeight: "600px",
    style: {
      width: "100%",
      height: "100%",
    },
    onReady: () => {
      console.log("Editor listo");
      // Restaurar el diseño guardado si existe y estamos en la pestaña de diseño
      if (currentTab === "design" && emailDesign) {
        setTimeout(() => {
          if (emailEditorRef.current?.editor) {
            console.log("Cargando diseño guardado:", emailDesign);
            emailEditorRef.current.editor.loadDesign(emailDesign);
          }
        }, 1000);
      }
    },
  };

  // Modificar el manejo del cambio de pestañas
  const handleTabChange = async (_, newValue) => {
    try {
      if (currentTab === "design" && newValue === "recipients") {
        // Guardar el diseño actual antes de cambiar de pestaña
        if (emailEditorRef.current?.editor) {
          await new Promise((resolve) => {
            emailEditorRef.current.editor.saveDesign((design) => {
              console.log("Guardando diseño:", design);
              setEmailDesign(design);
              resolve(design);
            });
          });
        }
      } else if (newValue === "design" && emailDesign) {
        // Esperar a que el editor esté listo antes de cargar el diseño
        setTimeout(() => {
          if (emailEditorRef.current?.editor) {
            console.log("Restaurando diseño:", emailDesign);
            emailEditorRef.current.editor.loadDesign(emailDesign);
          }
        }, 1000);
      }
      setCurrentTab(newValue);
    } catch (error) {
      console.error("Error al cambiar de pestaña:", error);
    }
  };

  // Agregar un efecto para manejar la restauración del diseño
  useEffect(() => {
    if (currentTab === "design" && emailDesign && emailEditorRef.current?.editor) {
      const timer = setTimeout(() => {
        console.log("Intentando restaurar diseño:", emailDesign);
        emailEditorRef.current.editor.loadDesign(emailDesign);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentTab, emailDesign]);

  return (
    <div className=' w-[95%] md:ml-20 lg:ml-20 mx-auto p-8 space-y-8'>
      {/* Estadísticas de uso de email */}
      <Card className='border border-t-4 border-black/20 border-t-[#5b7898]'>
        <CardContent className='space-y-6'>
          <Typography variant='h5' className='text-[#5b7898]'>
            Email Marketing
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Diseña y envía correos personalizados a tus clientes
          </Typography>

          <Box className='space-y-2'>
            <Box className='flex justify-between'>
              <Typography variant='body2'>Correos enviados en los últimos 30 días: {accounts?.emailsSentCount || 0}</Typography>
              <Typography variant='body2' fontWeight='medium'>
                {accounts?.emailsSentCount || 0} de {plan?.emailLimit}
              </Typography>
            </Box>
            <LinearProgress variant='determinate' value={(accounts?.emailsSentCount / plan?.emailLimit) * 100} className='h-2' />
            <Typography variant='body2' color='textSecondary'>
              Te quedan disponibles {plan?.emailLimit - accounts?.emailsSentCount} emails.
            </Typography>
          </Box>

          {isFreePlan && isWithinLimit && (
            <Alert
              severity='info'
              icon={<BoltIcon />}
              action={
                <Button color='inherit' size='small' onClick={handleWhatsAppClick}>
                  Actualizar Plan
                </Button>
              }
            >
              <AlertTitle>Aumenta tu límite</AlertTitle>
              Hazte PRO ahora y aumenta tu límite a 10.000 emails mensuales.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formulario de creación de email */}
      <Card className='border border-t-4 border-black/20 border-t-[#5b7898]'>
        <CardContent className='space-y-6'>
          <Typography variant='h5' className='text-[#5b7898]'>
            Crear Nuevo Email
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Diseña y personaliza tus correos masivos
          </Typography>

          <Tabs value={currentTab} onChange={handleTabChange} className='border-b'>
            <Tab label='Diseñar Email' value='design' />
            <Tab label='Destinatarios' value='recipients' />
          </Tabs>

          {currentTab === "design" && (
            <Box className='space-y-4'>
              <TextField
                fullWidth
                label='Asunto del Email'
                value={subject}
                onChange={handleSubjectChange}
                placeholder='Ej: ¡Oferta especial para {nombreCliente}!'
              />

              <Box className='border rounded-md'>
                <Alert severity='info'>
                  <AlertTitle>Variables Disponibles</AlertTitle>
                  Usa <code className='text-[#5b7898]'>{"{nombreCliente}"}</code> para personalizar tus correos.
                </Alert>
                <EmailEditor
                  ref={emailEditorRef}
                  options={emailEditorOptions}
                  onLoad={() => {
                    // Configuración adicional al cargar
                    if (emailEditorRef.current) {
                      emailEditorRef.current.editor.addEventListener("design:updated", () => {
                        emailEditorRef.current.editor.exportHtml((data) => {
                          // Aquí puedes manejar las actualizaciones del diseño
                          console.log("Diseño actualizado");
                        });
                      });
                    }
                  }}
                />
              </Box>
            </Box>
          )}

          {currentTab === "recipients" && (
            <Box className='space-y-4'>
              {/* Selector de fuente de contactos */}
              <Box className='mb-4'>
                <FormControl fullWidth>
                  <InputLabel>Fuente de Contactos</InputLabel>
                  <Select value={contactSource} onChange={(e) => setContactSource(e.target.value)} label='Fuente de Contactos'>
                    <MenuItem value='csv'>Cargar desde CSV</MenuItem>
                    <MenuItem value='clients'>Seleccionar Clientes</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {contactSource === "csv" && (
                <Box className='space-y-4'>
                  <Paper
                    {...getRootProps()}
                    className={`p-8 text-center border-2 border-dashed transition-colors cursor-pointer
                      ${isDragActive ? "border-[#5b7898] bg-[#5b789815]" : "border-gray-300"}`}
                  >
                    <input {...getInputProps()} />
                    <UploadIcon className='text-[#5b7898] text-4xl mb-2' />
                    <Typography variant='h6'>Arrastra y suelta tu archivo CSV aquí</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      o haz clic para seleccionar el archivo
                    </Typography>
                  </Paper>

                  {/* Mostrar datos cargados del CSV */}
                  {csvData.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={selectedCsvData.length > 0 && selectedCsvData.length === csvData.length}
                                onChange={handleSelectAllClick}
                                indeterminate={selectedCsvData.length > 0 && selectedCsvData.length < csvData.length}
                              />
                            </TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index} hover>
                              <TableCell padding='checkbox'>
                                <Checkbox checked={selectedCsvData.includes(row.email)} onChange={(event) => handleCheckboxChange(event, row.email)} />
                              </TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                    </TableContainer>
                  )}
                </Box>
              )}

              {contactSource === "clients" ? (
                // Tabla de clientes
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
                        <TableCell>Email</TableCell>
                        <TableCell>Teléfono</TableCell>
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
                          <TableCell>{client.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                </TableContainer>
              ) : (
                // Resumen de selección
                <Box className='mt-4 p-4 bg-gray-50 rounded-md'>
                  <Typography variant='subtitle1' className='font-medium'>
                    Destinatarios seleccionados: {contactSource === "csv" ? selectedCsvData.length : selectedClients.length}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>

        <Box className='flex justify-between p-4 border-t'>
          <Box className='flex gap-2'>
            <Button variant='outlined' startIcon={<SaveIcon />} onClick={() => setOpenSaveDialog(true)}>
              Guardar Plantilla
            </Button>
            <Button
              variant='outlined'
              startIcon={<DescriptionIcon />}
              onClick={() => {
                if (templates.length === 0) {
                  toast.info("No tienes plantillas guardadas aún");
                } else {
                  setOpenTemplatesDialog(true);
                }
              }}
            >
              Cargar Plantilla
            </Button>
          </Box>
          <Button
            variant='contained'
            color='primary'
            startIcon={<MailIcon />}
            disabled={isSendDisabled || (!selectedClients.length && !selectedCsvData.length)}
            onClick={handleSendEmails}
          >
            Enviar Email
          </Button>
        </Box>
      </Card>

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <Typography>Estás a punto de enviar correos a {selectedClients.length + selectedCsvData.length} destinatarios. ¿Estás seguro?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmSend} color='primary' autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Guardar Plantilla</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin='dense' label='Nombre de la plantilla' fullWidth value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveTemplate} color='primary'>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog maxWidth='md' fullWidth open={openTemplatesDialog} onClose={() => setOpenTemplatesDialog(false)}>
        <DialogTitle>Mis Plantillas</DialogTitle>
        <DialogContent>
          <List sx={{ width: "100%" }}>
            {templates.map((template) => (
              <ListItem
                key={template._id}
                sx={{
                  borderBottom: "1px solid #eee",
                  py: 2,
                  "&:last-child": { borderBottom: "none" },
                }}
                secondaryAction={
                  <Button variant='contained' size='small' onClick={() => loadTemplate(template)} sx={{ ml: 2 }}>
                    Usar
                  </Button>
                }
              >
                <ListItemText primary={template.name} secondary={template.subject} sx={{ pr: 4 }} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTemplatesDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Loading */}
      <Dialog open={loadingDialog} disableEscapeKeyDown={true}>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant='h6' gutterBottom>
            Enviando correos...
          </Typography>
          <Typography color='textSecondary'>Por favor, no cierres esta pestaña hasta que el proceso termine.</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};
