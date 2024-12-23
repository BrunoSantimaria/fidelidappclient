import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  IconButton,
  Dialog,
  FormControlLabel,
  Switch,
  CircularProgress,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Add as AddIcon, CheckBox, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useAuthSlice } from "@/hooks/useAuthSlice";
import api from "@/utils/api";
import { toast } from "@/utils/toast";

import { colorPalettes } from "@/promotion-client/utils/colorPalettes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Palette {
  gradient: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  bestFor: string;
}

interface ColorPaletteSelectorProps {
  selectedPalette: string;
  onSelect: (paletteName: string) => void;
  palettes: Record<string, Palette>;
}
export function ColorPaletteSelector({ selectedPalette, onSelect }: ColorPaletteSelectorProps) {
  const [expand, setExpand] = useState(false);
  const [hoveredPalette, setHoveredPalette] = useState<string | null>(null);

  return (
    <Accordion expanded={expand} onChange={() => setExpand(!expand)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon className='text-gray-500' />}>
        <Typography variant='h6' className='text-center'>
          Elige tu paleta de colores
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className='w-full p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {Object.entries(colorPalettes).map(([paletteName, palette]) => (
            <motion.div
              key={paletteName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex flex-col items-center'
              onHoverStart={() => setHoveredPalette(paletteName)}
              onHoverEnd={() => setHoveredPalette(null)}
            >
              <div
                onClick={() => onSelect(paletteName)}
                className={`relative w-20 h-20 rounded-full cursor-pointer transition-all duration-300 ${palette.gradient} shadow-lg hover:shadow-xl ${
                  selectedPalette === paletteName ? "ring-4 ring-primary ring-offset-2" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-full flex flex-col items-center justify-center p-2 ${
                    palette.background
                  } transition-opacity duration-300 ${hoveredPalette === paletteName ? "opacity-90" : "opacity-100"}`}
                >
                  {selectedPalette === paletteName && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1'
                    >
                      <Check className='w-4 h-4' />
                    </motion.div>
                  )}
                  <span className={`text-xs font-medium text-center ${palette.textPrimary}`}>
                    {paletteName
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </span>
                </div>
              </div>
              <div className='mt-2 space-y-1 text-center'>
                <div className={`text-xs font-medium ${palette.textPrimary}`}>Primario</div>
                <div className={`text-xs ${palette.textSecondary}`}>Secundario</div>
              </div>
            </motion.div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export const LandingSettings = () => {
  const [landingData, setLandingData] = useState({
    title: "",
    subtitle: "",
    name: "",
    colorPalette: "dark-slate",
    googleBusiness: "",
    buttonTitle: "",
    menu: {
      categories: [],
      settings: {
        currency: "$",
        showPrices: true,
        allowOrdering: false,
      },
    },
  });
  const handleColorPaletteChange = (paletteName: string) => {
    setLandingData({
      ...landingData,
      colorPalette: paletteName,
    });
  };
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthSlice();
  console.log(user);
  useEffect(() => {
    const fetchLandingData = async () => {
      if (!user?.accounts?._id) return;

      try {
        setLoading(true);
        const response = await api.get(`/accounts/settings/landing/${user.accounts._id}`);

        const { landing } = response.data;

        // Asegurarse de que los datos tengan la estructura correcta
        setLandingData({
          title: landing?.title || "",
          subtitle: landing?.subtitle || "",
          name: landing?.name || "",
          colorPalette: landing?.colorPalette || "",
          googleBusiness: landing?.googleBusiness || "",
          buttonTitle: landing?.card.title || "",
          menu: {
            categories: landing?.menu?.categories || [],
            settings: {
              currency: landing?.menu?.settings?.currency || "$",
              showPrices: landing?.menu?.settings?.showPrices ?? true,
              allowOrdering: landing?.menu?.settings?.allowOrdering ?? false,
            },
          },
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching landing data:", err);
        setError(err.message || "Error al cargar la información de la landing page");
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, [user?.accounts?._id, user?.token]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.put("/accounts/settings/landing", {
        accountId: user?.accounts?._id,
        landingSettings: landingData,
      });
      // Mostrar mensaje de éxito
      toast.success("Cambios guardados exitosamente");
    } catch (error) {
      console.error("Error saving landing settings:", error);
      setError("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color='error'>Error: {error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      {/* Basic Settings */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Configuración De Landing Page
        </Typography>
        <TextField
          fullWidth
          label='Título'
          value={landingData.title}
          onChange={(e) => setLandingData({ ...landingData, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label='Subtítulo'
          value={landingData.subtitle}
          onChange={(e) => setLandingData({ ...landingData, subtitle: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label='Nombre'
          value={landingData.name}
          onChange={(e) => setLandingData({ ...landingData, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label='Google Business'
          value={landingData.googleBusiness}
          onChange={(e) => setLandingData({ ...landingData, googleBusiness: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label='Nombre botón de menú'
          value={landingData.buttonTitle}
          onChange={(e) => setLandingData({ ...landingData, buttonTitle: e.target.value })}
          sx={{ mb: 2 }}
        />
        {/* Color Palette Settings */}

        <Typography variant='h6' sx={{ mb: 2 }}>
          Paleta de Colores
        </Typography>
        <ColorPaletteSelector selectedPalette={landingData.colorPalette} onSelect={handleColorPaletteChange} />
      </Card>

      {/* Menu Settings */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant='h6'>Categorías del Menú</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentCategory(null);
              setOpenCategoryDialog(true);
            }}
          >
            Añadir Categoría
          </Button>
        </Box>
        <Box sx={{ p: 3 }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Configuración de Landing Page
          </Typography>
        </Box>

        {landingData.menu.categories.map((category, index) => (
          <Card key={index} sx={{ p: 1, mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>{category.name}</Typography>
              <Box>
                <IconButton
                  onClick={() => {
                    setCurrentCategory(category);
                    setOpenCategoryDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    const newCategories = [...landingData.menu.categories];
                    newCategories.splice(index, 1);
                    setLandingData({
                      ...landingData,
                      menu: { ...landingData.menu, categories: newCategories },
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Card>

      <Button variant='contained' color='primary' onClick={handleSave} disabled={loading} sx={{ mt: 2 }}>
        {loading ? "Guardando..." : "Guardar Cambios"}
      </Button>

      {/* Category Dialog */}
      <CategoryDialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        category={currentCategory}
        onSave={(categoryData) => {
          const newCategories = [...landingData.menu.categories];
          if (currentCategory) {
            const index = newCategories.findIndex((c) => c.name === currentCategory.name);
            newCategories[index] = categoryData;
          } else {
            newCategories.push(categoryData);
          }
          setLandingData({
            ...landingData,
            menu: { ...landingData.menu, categories: newCategories },
          });
          setOpenCategoryDialog(false);
        }}
      />
    </Box>
  );
};
// Separate component for category dialog
const CategoryDialog = ({ open, onClose, category, onSave }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    icon: "",
    description: "",
    items: [],
  });
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (category) {
      setCategoryData(category);
    } else {
      setCategoryData({
        name: "",
        icon: "",
        description: "",
        items: [],
      });
    }
  }, [category]);
  const ItemDialog = ({ open, onClose, item, onSave }) => {
    const [itemData, setItemData] = useState({
      name: "",
      description: "",
      price: "",
      available: true,
      image: "",
    });

    useEffect(() => {
      if (item) {
        setItemData(item);
      } else {
        setItemData({
          name: "",
          description: "",
          price: "",
          available: true,
          image: "",
        });
      }
    }, [item]);

    return (
      <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {item ? "Editar Item" : "Nuevo Item"}
          </Typography>

          <TextField fullWidth label='Nombre' value={itemData.name} onChange={(e) => setItemData({ ...itemData, name: e.target.value })} sx={{ mb: 2 }} />

          <TextField
            fullWidth
            multiline
            rows={3}
            label='Descripción'
            value={itemData.description}
            onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='Precio'
            value={itemData.price}
            onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
            sx={{ mb: 2 }}
            type='number'
          />

          <FormControlLabel
            control={<Switch checked={itemData.available} onChange={(e) => setItemData({ ...itemData, available: e.target.checked })} />}
            label='Disponible'
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label='URL de la imagen'
            value={itemData.image}
            onChange={(e) => setItemData({ ...itemData, image: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Button fullWidth variant='contained' onClick={() => onSave(itemData)} sx={{ mt: 2 }}>
            Guardar Item
          </Button>
        </Box>
      </Dialog>
    );
  };
  const handleSaveItem = (itemData) => {
    const newItems = [...categoryData.items];
    if (currentItem) {
      const index = newItems.findIndex((i) => i.name === currentItem.name);
      newItems[index] = itemData;
    } else {
      newItems.push(itemData);
    }
    setCategoryData({ ...categoryData, items: newItems });
    setOpenItemDialog(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {category ? "Editar Categoría" : "Nueva Categoría"}
        </Typography>

        <TextField
          fullWidth
          label='Nombre'
          value={categoryData.name}
          onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label='Ícono'
          value={categoryData.icon}
          onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label='Descripción'
          value={categoryData.description}
          onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Typography variant='h6' sx={{ mt: 3, mb: 2 }}>
          Items
        </Typography>

        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentItem(null);
            setOpenItemDialog(true);
          }}
          sx={{ mb: 2 }}
        >
          Añadir Item
        </Button>

        {categoryData.items.map((item, index) => (
          <Card key={index} sx={{ p: 2, mb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant='subtitle1'>{item.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  ${item.price} - {item.available ? "Disponible" : "No disponible"}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    setCurrentItem(item);
                    setOpenItemDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    const newItems = [...categoryData.items];
                    newItems.splice(index, 1);
                    setCategoryData({ ...categoryData, items: newItems });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}

        <Button fullWidth variant='contained' onClick={() => onSave(categoryData)} sx={{ mt: 2 }}>
          Guardar Categoría
        </Button>

        <ItemDialog open={openItemDialog} onClose={() => setOpenItemDialog(false)} item={currentItem} onSave={handleSaveItem} />
      </Box>
    </Dialog>
  );
};
