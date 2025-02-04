import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const TagModal = ({ isModalOpen, closeTagModal, tag, setTag, handleAddTag }) => {
    const handleTagChange = (e) => {
        setTag(e.target.value);
    };

    return (
        <Modal open={isModalOpen} onClose={closeTagModal} aria-labelledby="add-tag-modal">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography id="add-tag-modal" variant="h6" component="h2" gutterBottom>
                    Nombre del Segmento
                </Typography>
                <TextField
                    fullWidth
                    label="Ingresa un nombre "
                    variant="outlined"
                    value={tag}
                    onChange={handleTagChange} 
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button onClick={closeTagModal} variant="outlined" color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAddTag} variant="contained" color="primary">
                        Crear
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TagModal;
