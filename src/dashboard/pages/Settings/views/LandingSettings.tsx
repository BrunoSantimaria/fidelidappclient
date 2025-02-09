import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  IconButton,
  Dialog,
  CircularProgress,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Grid,
  Alert,
} from "@mui/material";
import { Add as AddIcon, CheckBox, Delete as DeleteIcon, Edit as EditIcon, HelpRounded, Share, Download } from "@mui/icons-material";
import { useAuthSlice } from "@/hooks/useAuthSlice";
import api from "@/utils/api";
import { toast } from "@/utils/toast";

import { colorPalettes } from "@/promotion-client/utils/colorPalettes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import * as LucideIcons from "lucide-react";
import { IconSelector } from "./components/IconSelector";
import { ProductsTable } from "./components/ProductsTable";
import ItemDialog from "./components/ItemDialog";
import * as Md from "react-icons/md";
import * as Fa from "react-icons/fa";
import * as Bi from "react-icons/bi";
import QRCode from "react-qr-code";

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
      <AccordionSummary expandIcon={<ExpandMoreIcon className='text-gray-500 text-base' />}>
        <Typography variant='h6' sx={{ fontSize: "1rem", fontWeight: "normal" }} className='text-center text-base'>
          Elige tu paleta de colores
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <div className='w-full p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 bg-gray-500/90 rounded-lg'>
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
    slug: "",
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
        console.log(response.data.landing.slug);
        const { landing } = response.data;

        // Asegurarse de que los datos tengan la estructura correcta
        setLandingData({
          title: landing?.title || "",
          subtitle: landing?.subtitle || "",
          name: landing?.name || "",
          colorPalette: landing?.colorPalette || "",
          googleBusiness: landing?.googleBusiness || "",
          buttonTitle: landing?.card.title || "",
          slug: landing?.slug || "",
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

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.accounts?._id) {
      toast.error("No se encontró la información de la cuenta");
      return;
    }

    if (isSaving) return; // Prevenir múltiples clicks

    try {
      setIsSaving(true);
      setError(null);

      const dataToSend = {
        accountId: user.accounts._id,
        landingSettings: {
          title: landingData.title,
          subtitle: landingData.subtitle,
          name: landingData.name,
          slug: landingData.slug,
          colorPalette: landingData.colorPalette,
          googleBusiness: landingData.googleBusiness,
          card: {
            title: landingData.buttonTitle,
          },
          menu: landingData.menu,
        },
      };
      console.log(dataToSend);
      const response = await api.put("/accounts/settings/landing", dataToSend);
      console.log(dataToSend);
      console.log(response);
      if (response.status === 200) {
        toast.success("Cambios guardados exitosamente");
        setIsSaving(false); // Forzamos el reset del estado aquí
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error saving landing settings:", error);
      toast.error(error.response?.data?.error);

      setIsSaving(false); // Aseguramos que se resetee en caso de error
    } finally {
      setIsSaving(false);
    }
  };

  // Agregar estado para el tab activo
  const [activeTab, setActiveTab] = useState("general");

  // Función para reordenar categorías
  const handleReorderCategories = async (newOrder) => {
    try {
      setLoading(true);
      const reorderedCategories = newOrder.map((category, index) => ({
        ...category,
        order: index,
      }));

      await api.put("/accounts/settings/landing/reorder-categories", {
        accountId: user?.accounts?._id,
        categories: reorderedCategories,
      });

      setLandingData({
        ...landingData,
        menu: { ...landingData.menu, categories: reorderedCategories },
      });

      toast.success("Orden actualizado exitosamente");
    } catch (error) {
      console.error("Error reordering categories:", error);
      toast.error("Error al reordenar categorías");
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
      {/* Tabs de navegación */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label='General' value='general' />
        <Tab label='Categorías' value='categories' />
        <Tab label='Productos' value='products' />
        <Tab label='QR de tu negocio' value='qr' />
      </Tabs>

      {activeTab === "general" && (
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 0 }}>
            Configuración De Landing Page
          </Typography>
          <p className='text-sm text-gray-600 mb-6 mt-4'>
            Personaliza la información de tu landing page. Esta información se mostrara en el landing page de tu negocio.
            <br></br>
            <Box className='flex flex-col gap-2 mt-4'>
              <Alert severity='info'>
                <strong>¿Qué es Slug?</strong> El slug es como quedará el link hacia tu landing page. Ejemplo: https://fidelidapp.cl/landing/tu-negocio.
              </Alert>

              <Alert severity='info'>
                <strong>¿Qué es Google Business?</strong> El Google Business es el link de tu negocio en Google. Para obtenerlo debes ir a Google My Business y
                copiar el link.
              </Alert>
            </Box>
          </p>

          <TextField
            fullWidth
            label='Nombre de tu negocio'
            onChange={(e) => setLandingData({ ...landingData, name: e.target.value })}
            value={landingData.name}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label='Título'
            value={landingData.title}
            onChange={(e) => setLandingData({ ...landingData, title: e.target.value })}
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
            label='Nombre botón productos'
            value={landingData.buttonTitle}
            onChange={(e) => setLandingData({ ...landingData, buttonTitle: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ position: "relative", mb: 2 }}>
            <TextField
              fullWidth
              label='Slug'
              value={landingData.slug}
              onChange={(e) => setLandingData({ ...landingData, slug: e.target.value })}
              InputProps={{
                endAdornment: (
                  <Tooltip title='Copiar enlace'>
                    <IconButton
                      onClick={() => {
                        const url = `https://fidelidapp.cl/landing/${user.accounts.slug}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Enlace copiado al portapapeles");
                      }}
                      edge='end'
                    >
                      <Share className='text-gray-500' />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </Box>

          {/* Color Palette Settings */}

          <Typography variant='h6' sx={{ mb: 2 }}>
            Paleta de Colores
          </Typography>
          <ColorPaletteSelector selectedPalette={landingData.colorPalette} onSelect={handleColorPaletteChange} />
        </Card>
      )}

      {activeTab === "categories" && (
        <Card sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant='h6'>Categorías de tus productos</Typography>

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
          <Alert severity='info' className='mb-2'>
            Recuerda guardar los cambios para que se apliquen.
          </Alert>
          {/* Lista de categorías con DragAndDrop */}
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;

              const items = Array.from(landingData.menu.categories);
              const [reorderedItem] = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, reorderedItem);

              handleReorderCategories(items);
            }}
          >
            <Droppable droppableId='categories'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {landingData.menu.categories.map((category, index) => (
                    <Draggable key={category.name} draggableId={category.name} index={index}>
                      {(provided) => (
                        <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ p: 1, mb: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <DragIndicatorIcon />
                              {category.icon && (
                                <Box component='span' sx={{ display: "inline-flex", alignItems: "center", mr: 1 }}>
                                  {renderIcon(category.icon)}
                                </Box>
                              )}
                              <Typography>{category.name}</Typography>
                            </Box>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>
      )}

      {activeTab === "products" && (
        <Card sx={{ p: 2, mb: 3 }}>
          <ProductsTable
            categories={landingData.menu.categories}
            onUpdateProduct={async (productData) => {
              try {
                setLoading(true);
                const response = await api.put("/accounts/settings/landing/update-product", {
                  accountId: user?.accounts?._id,
                  ...productData,
                });

                if (response.data.success) {
                  // Actualizar el estado local
                  const updatedCategories = landingData.menu.categories.map((category) => {
                    if (category.name === productData.categoryName) {
                      const updatedItems = category.items.map((item) => (item._id === productData.productId ? { ...item, ...productData.productData } : item));
                      return { ...category, items: updatedItems };
                    }
                    return category;
                  });

                  setLandingData((prev) => ({
                    ...prev,
                    menu: { ...prev.menu, categories: updatedCategories },
                  }));

                  toast.success("Producto actualizado exitosamente");
                }
              } catch (error) {
                console.error("Error updating product:", error);
                toast.error("Error al actualizar el producto");
              } finally {
                setLoading(false);
              }
            }}
            onDeleteProduct={async (productData) => {
              try {
                setLoading(true);
                const response = await api.delete("/accounts/settings/landing/delete-product", {
                  data: {
                    accountId: user?.accounts?._id,
                    ...productData,
                  },
                });

                if (response.data.success) {
                  // Actualizar el estado local eliminando el producto
                  const updatedCategories = landingData.menu.categories.map((category) => {
                    if (category.name === productData.categoryName) {
                      return {
                        ...category,
                        items: category.items.filter((item) => item._id !== productData.productId),
                      };
                    }
                    return category;
                  });

                  setLandingData((prev) => ({
                    ...prev,
                    menu: { ...prev.menu, categories: updatedCategories },
                  }));

                  toast.success("Producto eliminado exitosamente");
                }
              } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Error al eliminar el producto");
              } finally {
                setLoading(false);
              }
            }}
          />
        </Card>
      )}

      {activeTab === "qr" && (
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Código QR de tu Landing Page
          </Typography>
          <Alert severity='info' sx={{ mb: 2 }}>
            Este código QR dirige a tu landing page. Puedes descargarlo y usarlo en tu local o materiales promocionales.
          </Alert>
          <Alert severity='error' sx={{ mb: 2 }}>
            <strong>Importante:</strong> Si cambias el slug, el código QR dejará de funcionar. Recuerda actualizarlo.
          </Alert>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div id='qr-container'>
              <QRCode value={`https://fidelidapp.cl/landing/${user.accounts.slug}`} size={200} level='H' />
            </div>

            <Button
              variant='contained'
              onClick={() => {
                const svg = document.querySelector("#qr-container svg");
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();

                img.onload = () => {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);

                  const pngFile = canvas.toDataURL("image/png");
                  const downloadLink = document.createElement("a");
                  downloadLink.download = `qr-${user.accounts.slug}.png`;
                  downloadLink.href = pngFile;
                  downloadLink.click();
                };

                img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
              }}
              endIcon={<Download />}
            >
              Descargar Código QR
            </Button>
          </Box>
        </Card>
      )}

      <Button variant='contained' color='primary' onClick={handleSave} disabled={isSaving} sx={{ mt: 2, minWidth: 150 }}>
        {isSaving ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color='inherit' />
            <span>Guardando...</span>
          </Box>
        ) : (
          "Guardar Cambios"
        )}
      </Button>

      {/* Existing dialogs */}
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
            newCategories.push({
              ...categoryData,
              order: newCategories.length,
            });
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
    order: 0,
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
        order: 0,
      });
    }
  }, [category]);

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

        {/* Reemplazar el TextField del ícono por el IconSelector */}
        <Box sx={{ mb: 2 }}>
          <Typography variant='subtitle2' sx={{ mb: 1 }}>
            Ícono
          </Typography>
          <IconSelector
            value={categoryData.icon}
            onChange={(iconName) => {
              // Validar si es un emoji o un icono antes de guardar
              setCategoryData({ ...categoryData, icon: iconName });
            }}
          />
        </Box>

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

// Función auxiliar para renderizar iconos
const renderIcon = (iconName: string) => {
  const iconLibs = { ...Md, ...Fa, ...Bi };
  const IconComponent = iconLibs[iconName];
  return IconComponent ? <IconComponent size={24} /> : null;
};
