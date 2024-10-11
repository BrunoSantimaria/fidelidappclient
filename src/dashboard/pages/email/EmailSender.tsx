import React, { useState } from "react";
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
  Checkbox,
  TableFooter,
} from "@mui/material";
import api from "../../../utils/api";
import { motion } from "framer-motion";
import Papa from "papaparse"; // Importar PapaParse para manejar el CSV

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const dummyUserList = [
  { id: 1, name: "Juan Pérez", email: "juan.perez@example.com" },
  { id: 2, name: "María López", email: "maria.lopez@example.com" },
  { id: 3, name: "Carlos García", email: "carlos.garcia@example.com" },
  { id: 4, name: "Ana Martínez", email: "ana.martinez@example.com" },
  { id: 5, name: "Luis Rodríguez", email: "luis.rodriguez@example.com" },
  { id: 6, name: "Laura Torres", email: "laura.torres@example.com" },
];

export const EmailSender = () => {
  const [contactSource, setContactSource] = useState("csv"); // Fuente de contacto (csv o lista)
  const [csvFile, setCsvFile] = useState(null);
  const [subject, setSubject] = useState("Mensaje Personalizado");
  const [template, setTemplate] = useState("Hola [Nombre],\n\nEste es tu [Detalle].");
  const [csvData, setCsvData] = useState([]); // Almacenar los datos CSV
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userList, setUserList] = useState(dummyUserList); // Lista de usuarios ficticia
  const [selectedUsers, setSelectedUsers] = useState([]); // Usuarios seleccionados

  const handleContactSourceChange = (event) => {
    setContactSource(event.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);

    // Leer y analizar el CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data); // Guardar datos CSV en el estado
      },
    });
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handleSendEmails = async () => {
    if (contactSource === "csv" && !csvFile) {
      alert("Por favor, sube un archivo CSV primero.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("template", template);

    if (contactSource === "csv") {
      formData.append("file", csvFile);
    } else if (contactSource === "list") {
      formData.append("users", JSON.stringify(selectedUsers)); // Convertir a JSON si es necesario
    }

    try {
      const response = await api.post("/api/email", formData);
      if (response.status === 200) {
        alert("Emails enviados con éxito!");
      } else {
        alert("Error al enviar emails.");
      }
    } catch (error) {
      alert("Error enviando emails: " + error.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(userList.map((user) => ({ name: user.name, email: user.email })));
    } else {
      setSelectedUsers([]);
    }
  };

  return (
    <motion.main initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='w-full h-full flex flex-row relative'>
      <div className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5'>
        <Box>
          <Typography variant='h6'>A continuación podrás crear emails y enviarlos masivamente.</Typography>
          <br />
          <Typography variant='body2'>Usa [Nombre] y [Detalle] para personalizar el mensaje.</Typography>
          <br />
          <Select value={contactSource} onChange={handleContactSourceChange} fullWidth margin='normal'>
            <MenuItem value='csv'>Cargar CSV</MenuItem>
            <MenuItem value='list'>Seleccionar de lista</MenuItem>
          </Select>

          {contactSource === "csv" && (
            <>
              <input type='file' accept='.csv' onChange={handleFileChange} />
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
                            <TableCell>Detalle</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.Name || "No disponible"}</TableCell>
                              <TableCell>{row.Email || "No disponible"}</TableCell>
                              <TableCell>{row.Detail || "No disponible"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component='div'
                      count={csvData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </Box>
              )}
            </>
          )}

          {contactSource === "list" && (
            <>
              <Typography variant='h6'>Selecciona los usuarios:</Typography>
              <Box mt={2}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding='checkbox'>
                          <Checkbox
                            indeterminate={selectedUsers.length > 0 && selectedUsers.length < userList.length}
                            checked={userList.length > 0 && selectedUsers.length === userList.length}
                            onChange={handleSelectAll}
                            inputProps={{ "aria-label": "select all users" }}
                          />
                        </TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo Electrónico</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell padding='checkbox'>
                            <Checkbox
                              checked={selectedUsers.some((selectedUser) => selectedUser.email === user.email)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers((prev) => [...prev, { name: user.name, email: user.email }]);
                                } else {
                                  setSelectedUsers((prev) => prev.filter((u) => u.email !== user.email));
                                }
                              }}
                              inputProps={{ "aria-label": user.name }}
                            />
                          </TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          count={userList.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}

          <TextField label='Asunto del Email' value={subject} onChange={handleSubjectChange} fullWidth margin='normal' />
          <TextField label='Plantilla del Email' multiline rows={8} value={template} onChange={handleTemplateChange} fullWidth margin='normal' />

          <Button variant='contained' color='primary' onClick={handleSendEmails}>
            Enviar Emails
          </Button>
        </Box>
      </div>
    </motion.main>
  );
};
