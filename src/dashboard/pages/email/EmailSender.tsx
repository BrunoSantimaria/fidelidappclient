import React, { useState, useRef, useEffect } from "react";
import EmailEditor, { EditorRef } from "react-email-editor";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { useDashboard } from "../../../hooks";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";

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
  Tooltip,
} from "@mui/material";

import { Mail as MailIcon, Upload as UploadIcon, Bolt as BoltIcon, Save as SaveIcon, Description as DescriptionIcon } from "@mui/icons-material";
import { CircleHelp } from "lucide-react";

// Definir el componente ScheduleDialog fuera del componente principal
const ScheduleDialog = ({ open, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  // Crear las fechas mínima y máxima
  const minDate = dayjs();
  const maxDate = dayjs().add(1, "year");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Programar envío de correo</DialogTitle>
      <DialogContent>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Selecciona la fecha y hora para enviar el correo
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
          <DateTimePicker
            label='Fecha y hora de envío'
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            minDateTime={minDate}
            maxDateTime={maxDate}
            sx={{ width: "100%", mt: 2 }}
            views={["year", "month", "day", "hours", "minutes"]}
            ampm={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
              actionBar: {
                actions: ["clear", "cancel", "accept"],
              },
            }}
            localeText={{
              fieldTimeLabel: "Hora",
              fieldDateLabel: "Fecha",
              clearButtonLabel: "Limpiar",
              cancelButtonLabel: "Cancelar",
              okButtonLabel: "Aceptar",
              timePickerToolbarTitle: "Seleccionar hora",
              datePickerToolbarTitle: "Seleccionar fecha",
            }}
            disablePast={true}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onConfirm(selectedDate)} variant='contained' disabled={!selectedDate}>
          Programar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const EmailSender = () => {
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [onLoadChange, setOnLoadChange] = useState(false);

  const [contactSource, setContactSource] = useState("csv"); // Estado para la fuente de contactos (CSV o Clientes)
  const [csvFile, setCsvFile] = useState(null); // Archivo CSV seleccionado
  const [subject, setSubject] = useState(""); // Asunto del correo
  const [csvData, setCsvData] = useState([]); // Datos del CSV cargado
  const [page, setPage] = useState(0); // Página actual para paginación
  const [rowsPerPage, setRowsPerPage] = useState(5); // Número de filas por página
  const [openDialog, setOpenDialog] = useState(false); // Control del diálogo de confirmación
  const [emailCount, setEmailCount] = useState(0); // Cantidad de correos a enviar
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
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getPromotionsAndMetrics();
    fetchTags();

  }, []);


  const fetchTags = async () => {
    try {
      const response = await api.get("/api/clients/getDistinctTags");
      const data = await response.data;
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = "56996706983";
    const message = "¡Hola! Me gustaría obtener más información sobre pasar mi cuenta a pro. ¡Gracias!";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  };

  const isSendDisabled = !subject || subject === "";

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const checkEmailContent = async () => {
    try {
      setOnLoadChange(true);
      if (!subject || subject.trim() === "") {
        toast.warning("Debes agregar un asunto al email");
        return false;
      }

      const totalSelectedRecipients = selectedCsvData.length + selectedClients.length + tags.find(tag => tag._id === selectedTag)?.count

      if (totalSelectedRecipients === 0) {
        toast.warning("Debes seleccionar al menos un destinatario");
        return false;
      }

      // Verificar contenido del editor
      const hasContent = await new Promise((resolve) => {
        emailEditorRef.current?.editor?.exportHtml((data) => {
          const { html, design } = data;

          // Verificar si hay contenido real en el diseño
          const hasDesignContent = design?.body?.rows?.some((row) => row.columns?.some((column) => column.contents?.length > 0));

          // Verificar si el HTML tiene contenido significativo
          const hasHtmlContent = html && html.trim() !== "" && !html.includes("Sin contenido aquí") && !html.includes("Arrastra el contenido desde la derecha");

          resolve(hasDesignContent && hasHtmlContent);
        });
      });

      if (!hasContent) {
        toast.warning("Debes agregar contenido al email antes de enviarlo");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error al verificar contenido:", error);
      toast.error("Error al verificar el contenido del email");
      return false;
    } finally {
      setOnLoadChange(false);
    }
  };

  const handleSendEmails = async () => {
    if (currentTab === "recipients") {
      setCurrentTab("design");
      toast.info("Revisa el diseño y envíalo cuando estés listo.");
      // Esperar a que el editor est�� listo antes de cargar el diseño
      setTimeout(() => {
        if (emailEditorRef.current?.editor && emailDesign) {
          emailEditorRef.current.editor.loadDesign(emailDesign);
        }
      }, 1000);
      return;
    }

    const isValid = await checkEmailContent();

    if (isValid) {
      const totalEmails =
        selectedCsvData.length + selectedClients.length + tags.find(tag => tag._id === selectedTag)?.count

      setEmailCount(totalEmails);
      setOpenDialog(true);
    }
  };

  const handleScheduleClick = async () => {
    if (currentTab === "recipients") {
      setCurrentTab("design");
      toast.info("Revisa el diseño y prográmalo cuando estés listo.");
      // Esperar a que el editor esté listo antes de cargar el diseño
      setTimeout(() => {
        if (emailEditorRef.current?.editor && emailDesign) {
          emailEditorRef.current.editor.loadDesign(emailDesign);
        }
      }, 1000);
      return;
    }

    const isValid = await checkEmailContent();
    if (isValid) {
      setShowScheduleDialog(true);
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
  
  useEffect(() => {
    refreshAccount();
  }, [clients]);

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
      // Restaurar el diseño guardado si existe y estamos en la pestaña de diseño
      if (currentTab === "design" && emailDesign) {
        setTimeout(() => {
          if (emailEditorRef.current?.editor) {
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
              setEmailDesign(design);
              resolve(design);
            });
          });
        }
      } else if (newValue === "design" && emailDesign) {
        // Esperar a que el editor esté listo antes de cargar el diseño
        setTimeout(() => {
          if (emailEditorRef.current?.editor) {
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
        emailEditorRef.current.editor.loadDesign(emailDesign);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentTab, emailDesign]);

  //Funciones de envio de correos

  // Confirmar el envío de correos sin programar
  const handleConfirmSend = async () => {
    try {
      setOpenDialog(false);

      // Mostrar mensaje de éxito y redireccionar
      toast.success("La campaña de correos se ha iniciado correctamente. Recibirás una notificación por correo cuando se complete el envío.", {
        autoClose: 3000,
        onClose: () => navigate("/dashboard/email-campaign"),
      });

      let recipients;

      if (contactSource === "csv") {
        recipients = csvData
          .filter((row) => selectedCsvData.includes(row.email) && row.email && /\S+@\S+\.\S+/.test(row.email))
          .map((row) => ({
            email: row.email,
            name: row.name || "",
          }));
      } else if (contactSource === "clients") {
        recipients = clients
          .filter((client) => selectedClients.includes(client.email) && client.email && /\S+@\S+\.\S+/.test(client.email))
          .map((client) => ({
            email: client.email,
            name: client.name || "",
          }));
      }

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
        contactSource,
        tag: selectedTag,
      };

      console.log("formData", formData);
      setOnLoadChange(true);
      await api.post("/api/email/send", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Limpiar todo el contenido
      setSubject("");
      setCsvFile(null);
      setSelectedClients([]);
      setSelectedCsvData([]);
      setCsvData([]);
      setEmailDesign(null);
      setContactSource("csv");
      setCurrentTab("design");

      // Limpiar el editor después de un pequeño delay para asegurar que está listo
      setTimeout(() => {
        if (emailEditorRef.current?.editor) {
          emailEditorRef.current.editor.loadDesign({ body: { rows: [] } });
        }
      }, 100);
    } catch (error) {
      console.error("Error al iniciar la campaña:", error);
      toast.error(" Hubo un problema al iniciar la campaña de correos.");
    } finally {
      setOnLoadChange(false);
    }
  };

  // Confirmar y programar envio de correos
  const handleScheduleEmail = async (selectedDate) => {
    try {
      // Validar que haya destinatarios seleccionados
      if ((!selectedCsvData.length && contactSource === "csv") || (!selectedClients.length && contactSource === "clients")) {
        toast.error("Debes seleccionar al menos un destinatario");
        return;
      }

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

      let recipients;
      if (contactSource === "csv") {
        recipients = csvData
          .filter((row) => selectedCsvData.includes(row.email))
          .map((row) => ({
            email: row.email,
            name: row.name || "Cliente",
          }));
      } else {
        recipients = clients
          .filter((client) => selectedClients.includes(client.email))
          .map((client) => ({
            email: client.email,
            name: client.name || "Cliente",
          }));
      }

      const formData = {
        subject,
        template: templateHtml,
        clients: recipients,
        scheduledDate: selectedDate.toISOString(),
        userId: accounts._id,
        campaignName: subject,
        contactSource,
        tag: selectedTag,
      };

      const response = await api.post("/api/email/schedule", formData);

      if (response.data.success) {
        toast.success(
          `Email programado para ${new Date(selectedDate).toLocaleString("es-ES", {
            dateStyle: "medium",
            timeStyle: "short",
          })}`,
          {
            onClose: () => navigate("/dashboard/email-campaign"),
          }
        );

        setShowScheduleDialog(false);

        // Limpiar el formulario
        setSubject("");
        setCsvFile(null);
        setSelectedClients([]);
        setSelectedCsvData([]);
        emailEditorRef.current.editor.loadDesign({ body: { rows: [] } });
      }
    } catch (error) {
      console.error("Error al programar el correo:", error);
      toast.error(error.response?.data?.message || "Error al programar el correo");
    }
  };

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
          <Alert severity='info'>
            <AlertTitle>Variables Disponibles</AlertTitle>
            Usa <code className='text-[#5b7898]'>{"{nombreCliente}"}</code> para personalizar tus correos.
          </Alert>
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
                  <AlertTitle>RRSS Automaticas en cada correo.</AlertTitle>
                  Asegurate de configurar tus RRSS en ajustes para personalizar tus correos.
                  <Tooltip title='Tus RRSS aparecerán como pie de correo'>
                    <IconButton>
                      <CircleHelp />{" "}
                    </IconButton>
                  </Tooltip>
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
                    <MenuItem value='csv' onClick={() => setSelectedTag("")}>Cargar desde CSV</MenuItem>
                    <MenuItem value='clients' >Seleccionar Clientes</MenuItem>
                    {tags.map((tag, index) => (
                      <MenuItem key={index} value={tag._id} onClick={() => setSelectedTag(tag._id)}>
                        {tag._id}
                      </MenuItem>
                    ))}
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

              {contactSource === "clients" && (
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
              )}
            </Box>
          )}
          <Box className='mt-4 p-4 bg-gray-50 rounded-md'>
            <Typography variant='subtitle1' className='font-medium'>
              Destinatarios seleccionados:
              {contactSource === "csv"
                ? selectedCsvData.length
                : contactSource === "clients"
                  ? selectedClients.length
                  : selectedTag
                    ? tags.find(tag => tag._id === selectedTag)?.count || "Sin información"
                    : "Seleccciona clientes o un tag"}
            </Typography>
          </Box>

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
          <Box className='flex gap-2'>
            <Button disabled={onLoadChange} variant='outlined' startIcon={<CalendarTodayIcon />} onClick={handleScheduleClick}>
              Programar Envío
            </Button>
            <Button disabled={onLoadChange} variant='contained' color='primary' startIcon={<MailIcon />} onClick={handleSendEmails}>
              Enviar Email
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Envío de Campaña</DialogTitle>
        <DialogContent>
          <Typography variant='body1' gutterBottom>
            Estás a punto de iniciar una campaña de correos para {emailCount} destinatarios.
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Una vez iniciada la campaña:
            <ul>
              <li>Podrás salir de esta página sin interrumpir el envío</li>
              <li>Recibirás un correo de confirmación cuando se complete el envío</li>
              <li>Podrás ver las estadísticas de la campaña en tu panel de control</li>
            </ul>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmSend} color='primary' variant='contained' autoFocus>
            Iniciar Campaña
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

      {/* Diálogo de programación */}
      <ScheduleDialog open={showScheduleDialog} onClose={() => setShowScheduleDialog(false)} onConfirm={handleScheduleEmail} />
    </div>
  );
};
