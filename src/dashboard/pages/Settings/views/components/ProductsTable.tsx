// ProductsTable.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Chip,
  Tooltip,
  Badge,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon, LocalOffer, Inventory } from "@mui/icons-material";
import { toast } from "react-toastify";

export const ProductsTable = ({ categories, onUpdateProduct, onDeleteProduct }) => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    stockFilter: "all", // all, inStock, outOfStock, unlimited
  });

  useEffect(() => {
    const allProducts = categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryName: cat.name,
      }))
    );
    setProducts(allProducts);
  }, [categories]);

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      ...product,
      categoryName: product.categoryName,
      available: product.available || false,
      stock: product.stock ?? -1,
      discount: product.discount
        ? {
            type: product.discount.type || "percentage",
            value: product.discount.value || 0,
            active: Boolean(product.discount.active),
            endDate: product.discount.endDate ? new Date(product.discount.endDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          }
        : {
            type: "percentage",
            value: 0,
            active: false,
            endDate: new Date().toISOString().split("T")[0],
          },
    });
  };

  const handleSave = async (product) => {
    try {
      setIsLoading(true);
      if (!product._id || !editData.categoryName) {
        toast.error("Datos incompletos para actualizar el producto");
        return;
      }

      // Formatear el descuento
      const formattedDiscount = editData.discount
        ? {
            type: editData.discount.type || "percentage",
            value: parseFloat(editData.discount.value) || 0,
            active: Boolean(editData.discount.active),
            endDate: editData.discount.endDate || null,
          }
        : null;

      // Formatear el stock
      const formattedStock = editData.stock === "" ? -1 : parseInt(editData.stock);

      await onUpdateProduct({
        categoryName: editData.categoryName,
        productId: product._id,
        productData: {
          name: editData.name,
          price: parseFloat(editData.price),
          available: Boolean(editData.available),
          stock: formattedStock,
          discount: formattedDiscount,
          oldCategoryName: product.categoryName,
        },
      });

      setEditingId(null);
      setEditData({});
      toast.success("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (toast.warning("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await onDeleteProduct({
          categoryName: product.categoryName,
          productId: product._id,
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar el producto");
      }
    }
  };

  // Función para calcular el precio con descuento
  const calculateDiscountedPrice = (product, category) => {
    let finalPrice = product.price;

    // Aplicar descuento del producto si está activo
    if (product.discount?.active && new Date(product.discount.endDate) > new Date()) {
      if (product.discount.type === "percentage") {
        finalPrice *= 1 - product.discount.value / 100;
      } else {
        finalPrice -= product.discount.value;
      }
    }
    // Aplicar descuento de categoría si está activo y no hay descuento de producto
    else if (category.discount?.active && new Date(category.discount.endDate) > new Date()) {
      if (category.discount.type === "percentage") {
        finalPrice *= 1 - category.discount.value / 100;
      } else {
        finalPrice -= category.discount.value;
      }
    }

    return Math.max(0, finalPrice);
  };

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filters.category === "all" || product.categoryName === filters.category;
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStock =
        filters.stockFilter === "all" ||
        (filters.stockFilter === "inStock" && product.stock > 0) ||
        (filters.stockFilter === "outOfStock" && product.stock === 0) ||
        (filters.stockFilter === "unlimited" && product.stock === -1);

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [products, filters]);

  return (
    <div>
      {/* Filtros */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl variant='outlined' size='small'>
          <InputLabel>Categoría</InputLabel>
          <Select value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))} label='Categoría'>
            <MenuItem value='all'>Todas</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.name} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant='outlined' size='small'>
          <InputLabel>Stock</InputLabel>
          <Select value={filters.stockFilter} onChange={(e) => setFilters((prev) => ({ ...prev, stockFilter: e.target.value }))} label='Stock'>
            <MenuItem value='all'>Todos</MenuItem>
            <MenuItem value='inStock'>En stock</MenuItem>
            <MenuItem value='outOfStock'>Sin stock</MenuItem>
            <MenuItem value='unlimited'>Stock ilimitado</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size='small'
          label='Buscar'
          variant='outlined'
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => {
              const category = categories.find((c) => c.name === product.categoryName);
              const discountedPrice = calculateDiscountedPrice(product, category);
              const hasDiscount = discountedPrice < product.price;

              return (
                <TableRow key={product._id}>
                  {editingId === product._id ? (
                    // Modo edición
                    <>
                      <TableCell>
                        <TextField value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Select value={editData.categoryName} onChange={(e) => setEditData({ ...editData, categoryName: e.target.value })}>
                          {categories.map((cat) => (
                            <MenuItem key={cat.name} value={cat.name}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField type='number' value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type='number'
                          value={editData.stock === -1 ? "" : editData.stock}
                          onChange={(e) => {
                            const value = e.target.value === "" ? -1 : parseInt(e.target.value);
                            setEditData({ ...editData, stock: value });
                          }}
                          placeholder='Ilimitado'
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={<Switch checked={editData.available} onChange={(e) => setEditData({ ...editData, available: e.target.checked })} />}
                          label={editData.available ? "Sí" : "No"}
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl>
                          <Select
                            value={editData.discount?.type || "percentage"}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                discount: { ...editData.discount, type: e.target.value },
                              })
                            }
                          >
                            <MenuItem value='percentage'>%</MenuItem>
                            <MenuItem value='fixed'>$</MenuItem>
                          </Select>
                          <TextField
                            type='number'
                            value={editData.discount?.value || 0}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                discount: { ...editData.discount, value: parseFloat(e.target.value) },
                              })
                            }
                          />
                          <TextField
                            type='date'
                            value={editData.discount?.endDate?.split("T")[0] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                discount: { ...editData.discount, endDate: e.target.value },
                              })
                            }
                          />
                          <Switch
                            checked={editData.discount?.active || false}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                discount: { ...editData.discount, active: e.target.checked },
                              })
                            }
                          />
                        </FormControl>
                      </TableCell>
                    </>
                  ) : (
                    // Modo visualización
                    <>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.categoryName}</TableCell>
                      <TableCell>
                        <Box>
                          {hasDiscount && (
                            <Typography variant='body2' sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                              ${product.price}
                            </Typography>
                          )}
                          <Typography color={hasDiscount ? "error" : "inherit"}>${discountedPrice}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {product.stock === -1 ? (
                          <Chip icon={<Inventory />} label='Ilimitado' />
                        ) : (
                          <Chip label={product.stock} color={product.stock > 0 ? "success" : "error"} />
                        )}
                      </TableCell>
                      <TableCell>{product.available ? "Sí" : "No"}</TableCell>
                      <TableCell>
                        {product.discount?.active && (
                          <Tooltip title={`Válido hasta ${new Date(product.discount.endDate).toLocaleDateString()}`}>
                            <Chip
                              icon={<LocalOffer />}
                              label={`${product.discount.type === "percentage" ? product.discount.value + "%" : "$" + product.discount.value}`}
                              color='secondary'
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    {editingId === product._id ? (
                      <>
                        <IconButton onClick={() => handleSave(product)} disabled={isLoading}>
                          {isLoading ? <CircularProgress size={24} /> : <SaveIcon />}
                        </IconButton>
                        <IconButton onClick={() => setEditingId(null)} disabled={isLoading}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(product)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(product)} color='error'>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
