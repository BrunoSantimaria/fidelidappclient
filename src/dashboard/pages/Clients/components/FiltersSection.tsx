import { useState, useEffect } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    FormGroup,
    FormControlLabel,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Grid,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../../../../utils/api";
import TagModal from "./TagModal";
import { toast } from "react-toastify";

const FilterComponent = ({ onApplyFilters, filteredClients }) => {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        hasPhoneNumber: true,
        pointsRange: { min: "", max: "" },
        activityType: [],
        availableDays: [],
        availableHours: [],
        dateRange: { start: "", end: "" },
        selectedTags: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({ ...prev, [name]: checked }));
    };

    const handlePointsRangeChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            pointsRange: { ...prev.pointsRange, [type]: value },
        }));
    };

    const handleDayChange = (e) => {
        setFilters((prev) => ({ ...prev, availableDays: e.target.value }));
    };

    const handleHourChange = (e) => {
        setFilters((prev) => ({ ...prev, availableHours: e.target.value }));
    };

    const handleDateChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [type]: value },
        }));
    };

    const handleApply = () => {
        console.log("Applying filters", filters);
        onApplyFilters(filters);
    };

    const resetFilters = () => {
        setFilters({
            name: "",
            email: "",
            hasPhoneNumber: true,
            pointsRange: { min: "", max: "" },
            activityType: [],
            availableDays: [],
            availableHours: [],
            dateRange: { start: "", end: "" },
            selectedTags: [],
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tag, setTag] = useState("");
    const [tags, setTags] = useState([]);

    const openTagModal = () => setIsModalOpen(true);
    const closeTagModal = () => {
        setIsModalOpen(false);
        setTag("");
    };

    const handleTagChange = (e) => {
        setFilters((prev) => ({ ...prev, selectedTags: e.target.value }));
    };


    const handleActivityChange = (e) => {
        setFilters((prev) => ({ ...prev, activityType: e.target.value }));
    };

    const handleAddTag = async () => {
        if (!tag || filteredClients.totalClients === 0) {
            alert("Por favor selecciona clientes y un nombre para el segmento");
            return;
        }


        try {
            const response = await api.post("/api/clients/addTagToClients", {
                clients: filteredClients, // Send selected clients
                tag,
                filters,
            });

            console.log("Tag added:", response.data);
            toast.success("Segmento de clientes creado correctamente");
            closeTagModal();
            // Reload component to update tags
            window.location.reload();
        } catch (error) {
            console.error("Error adding tag", error);
        }
    };

    useEffect(() => {
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

    return (
        <section className="w-full">
            <div className='w-[90%] flex flex-col md:flex-col m-auto justify-between mb-10'>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Segmenta tus clientes en un click!
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="tags-select-label">Segmentos Existentes</InputLabel>
                                    <Select
                                        labelId="tags-select-label"
                                        multiple
                                        value={filters.selectedTags}
                                        onChange={handleTagChange}
                                        renderValue={(selected) => selected.join(", ")}
                                    >
                                        {tags.map((tag, index) => (
                                            <MenuItem key={index} value={tag._id}>
                                                {tag._id}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6"> Crea un Nuevo Segmento</Typography>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={filters.email}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>



                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="tags-select-label">Actividad</InputLabel>
                                    <Select
                                        labelId="tags-select-label"
                                        multiple
                                        value={filters.activityType}
                                        onChange={handleActivityChange}
                                        renderValue={(selected) => selected.join(", ")}
                                    >
                                        {[
                                            "Ninguna",
                                            "Registro",
                                            "Sumó Puntos",
                                            "Canjeó Puntos",
                                            "Canjeó Promoción",
                                            "Evaluó el Servicio"
                                        ].map((activity) => (
                                            <MenuItem key={activity} value={activity}>
                                                {activity}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>



                            <Grid item xs={12} sm={4} display="flex" alignItems="center">
                                <FormControl component="fieldset" fullWidth>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={filters.hasPhoneNumber}
                                                    onChange={handleCheckboxChange}
                                                    name="hasPhoneNumber"
                                                    color="primary"
                                                />
                                            }
                                            label="Tiene teléfono"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>A la hora</InputLabel>
                                    <Select
                                        multiple
                                        value={filters.availableHours}
                                        onChange={handleHourChange}
                                        renderValue={(selected) => selected.join(", ")}
                                    >
                                        {[
                                            "00:00",
                                            "01:00",
                                            "02:00",
                                            "03:00",
                                            "04:00",
                                            "05:00",
                                            "06:00",
                                            "07:00",
                                            "08:00",
                                            "09:00",
                                            "10:00",
                                            "11:00",
                                            "12:00",
                                            "13:00",
                                            "14:00",
                                            "15:00",
                                            "16:00",
                                            "17:00",
                                            "18:00",
                                            "19:00",
                                            "20:00",
                                            "21:00",
                                            "22:00",
                                            "23:00",
                                        ].map((hour) => (
                                            <MenuItem key={hour} value={hour}>
                                                {hour}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) => handleDateChange("start", e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) => handleDateChange("end", e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Button variant="contained" color="primary" onClick={handleApply} sx={{ mt: 2 }}>
                            Apply Filters
                        </Button>

                        <Button variant="contained" color="grey" onClick={resetFilters} sx={{ mt: 2, ml: 2 }}>
                            Reset Filters
                        </Button>

                        <Button variant="contained" color="grey" onClick={openTagModal} sx={{ mt: 2, ml: 2 }}>
                            Crear Segmento de Clientes
                        </Button>
                    </AccordionDetails>
                </Accordion>

                <TagModal
                    isModalOpen={isModalOpen}
                    closeTagModal={closeTagModal}
                    tag={tag}
                    setTag={setTag}
                    handleAddTag={handleAddTag}
                />
            </div>
        </section>
    );
};

export default FilterComponent;
