// IconSelector.tsx
import React, { useState } from "react";
import { Dialog, TextField, Box, Grid, Typography, Tabs, Tab } from "@mui/material";
import { Icon } from "@iconify/react";

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Categorías de iconos relevantes para negocios
const ICON_SETS = {
  "Restaurantes & Comida": {
    prefix: "food",
    icons: [
      "mdi:food",
      "mdi:food-fork-drink",
      "mdi:restaurant",
      "mdi:silverware-fork-knife",
      "mdi:coffee",
      "mdi:pizza",
      "mdi:beer",
      "mdi:cake-variant",
      "mdi:food-croissant",
      "mdi:food-steak",
      "mdi:noodles",
      "material-symbols:restaurant-menu",
      "material-symbols:lunch-dining",
      "material-symbols:bakery-dining",
      "fluent:food-24-filled",
      "fluent:drink-coffee-20-filled",
      "icon-park-outline:cooking",
      "ph:cookie-bold",
      "ri:restaurant-2-fill",
      "material-symbols:breakfast-dining",
      "material-symbols:dinner-dining",
      "material-symbols:brunch-dining",
      "mdi:food-apple",
      "mdi:food-halal",
      "mdi:food-kosher",
      "mdi:food-takeout-box",
      "mdi:fruit-watermelon",
      "mdi:fruit-grapes",
      "mdi:glass-cocktail",
      "mdi:glass-wine",
      "mdi:grill",
      "mdi:hamburger",
      "mdi:ice-cream",
      "mdi:pasta",
      "mdi:silverware",
      "mdi:table-chair",
      "mdi:tea",
      "mdi:food-drumstick",
      "mdi:food-hot-dog",
      "mdi:food-turkey",
      "mdi:food-variant",
      "mdi:fruit-cherries",
      "mdi:fruit-citrus",
      "mdi:fruit-pineapple",
      "mdi:mushroom",
      "mdi:fish",
      "mdi:shrimp",
      "mdi:bread-slice",
      "mdi:cupcake",
      "mdi:cookie",
      "mdi:cheese",
      "mdi:egg",
      "mdi:corn",
      "mdi:carrot",
      "mdi:bottle-wine",
      "mdi:bottle-soda",
      "mdi:bottle-tonic",
      "mdi:coffee-maker",
      "mdi:coffee-to-go",
      "mdi:coffee-outline",
      "material-symbols:kebab-dining",
      "material-symbols:ramen-dining",
      "material-symbols:rice-bowl",
      "material-symbols:tapas",
      "material-symbols:local-pizza",
      "material-symbols:local-cafe",
      "material-symbols:local-bar",
      "fluent:food-cake-24-filled",
      "fluent:food-egg-24-filled",
      "fluent:food-fish-24-filled",
      "fluent:food-grains-24-filled",
      "fluent:food-toast-24-filled",
      "ph:coffee-fill",
      "ph:wine-fill",
      "ri:cake-3-fill",
      "mdi:food-variant-off",
      "mdi:fruit-watermelon",
      "mdi:fruit-pineapple",
      "mdi:fruit-grapes",
      "mdi:fruit-cherries",
      "mdi:fruit-citrus",
      "mdi:food-drumstick-off",
      "mdi:food-off",
      "mdi:food-fork-drink",
      "mdi:food-halal",
      "mdi:food-kosher",
      "mdi:food-takeout-box",
      "mdi:food-takeout-box-outline",
      "mdi:bread-slice-outline",
      "mdi:baguette",
      "mdi:waffle",
      "mdi:pot-steam",
      "mdi:pot-mix",
      "mdi:pot",
      "mdi:pot-outline",
      "mdi:blender",
      "mdi:microwave",
      "mdi:toaster",
      "mdi:toaster-oven",
      "mdi:refrigerator",
      "mdi:refrigerator-outline",
      "mdi:refrigerator-industrial",
      "mdi:stove",
      "mdi:chef-hat",
      "mdi:silverware-clean",
      "mdi:silverware-fork",
      "mdi:silverware-spoon",
      "mdi:silverware-variant",
      "mdi:coffee-outline",
      "mdi:coffee-to-go-outline",
      "mdi:coffee-maker-outline",
      "mdi:tea-outline",
      "mdi:bottle-wine-outline",
      "mdi:bottle-soda-outline",
      "mdi:glass-cocktail",
      "mdi:glass-mug",
      "mdi:glass-mug-variant",
      "mdi:glass-pint-outline",
      "mdi:glass-wine",
      "mdi:glass-stange",
      "mdi:glass-tulip",
      "mdi:glass-flute",
      "mdi:liquor",
      "mdi:shaker",
      "mdi:shaker-outline",
      "material-symbols:outdoor-grill",
      "material-symbols:soup-kitchen",
      "material-symbols:cookie",
      "material-symbols:cake",
      "material-symbols:restaurant-menu",
      "material-symbols:restaurant",
      "material-symbols:fastfood",
      "material-symbols:local-cafe",
      "material-symbols:local-bar",
      "material-symbols:local-pizza",
      "material-symbols:local-dining",
      "material-symbols:set-meal",
      "fluent:food-fish",
      "fluent:food-grains",
      "fluent:food-pizza",
      "fluent:drink-wine",
      "fluent:drink-beer",
      "fluent:drink-coffee",
      "fluent:drink-margarita",
      "fluent:cake",
      "ph:coffee",
      "ph:cookie",
      "ph:wine",
      "ph:beer-bottle",
      "ri:restaurant-line",
      "ri:restaurant-2-line",
      "ri:cup-line",
      "ri:goblet-line",
      "ri:cake-line",
      "ri:cake-2-line",
      "ri:cake-3-line",
    ],
  },
  "Negocios & Comercios": {
    prefix: "business",
    icons: [
      "mdi:store",
      "mdi:shopping",
      "mdi:cart",
      "mdi:shop",
      "mdi:storefront",
      "mdi:building-store",
      "mdi:cash-register",
      "material-symbols:store",
      "material-symbols:shopping-bag",
      "fluent:building-shop-24-filled",
      "fluent:building-retail-24-filled",
      "ic:baseline-local-mall",
      "ic:baseline-store-mall-directory",
      "ph:storefront-bold",
      "ri:store-2-fill",
      "mdi:basket",
      "mdi:cash",
      "mdi:credit-card",
      "mdi:gift",
      "mdi:sale",
      "mdi:shopping-outline",
      "mdi:store-24-hour",
      "mdi:store-alert",
      "mdi:store-check",
      "mdi:store-clock",
      "mdi:store-cog",
      "mdi:store-marker",
      "mdi:store-plus",
      "mdi:store-remove",
      "mdi:store-search",
      "mdi:store-settings",
      "material-symbols:add-business",
      "material-symbols:inventory",
      "material-symbols:point-of-sale",
      "material-symbols:shopping-basket",
      "mdi:store-clock-outline",
      "mdi:store-cog-outline",
      "mdi:store-marker-outline",
      "mdi:store-minus-outline",
      "mdi:store-plus-outline",
      "mdi:store-remove-outline",
      "mdi:store-search-outline",
      "mdi:store-settings-outline",
      "mdi:cart-arrow-down",
      "mdi:cart-arrow-up",
      "mdi:cart-arrow-right",
      "mdi:cart-check",
      "mdi:cart-heart",
      "mdi:cart-variant",
      "mdi:cash-lock",
      "mdi:cash-lock-open",
      "mdi:cash-marker",
      "mdi:cash-minus",
      "mdi:cash-multiple",
      "mdi:cash-plus",
      "mdi:cash-refund",
      "mdi:cash-sync",
      "mdi:credit-card-check",
      "mdi:credit-card-clock",
      "mdi:credit-card-edit",
      "mdi:credit-card-fast",
      "mdi:credit-card-lock",
      "mdi:credit-card-marker",
      "mdi:credit-card-minus",
      "mdi:credit-card-multiple",
      "mdi:credit-card-plus",
      "mdi:credit-card-refresh",
      "mdi:credit-card-scan",
      "mdi:credit-card-search",
      "mdi:credit-card-sync",
      "mdi:credit-card-wireless",
      "mdi:barcode",
      "mdi:barcode-scan",
      "mdi:qrcode",
      "mdi:qrcode-scan",
      "mdi:tag",
      "mdi:tag-multiple",
      "mdi:tag-heart",
      "mdi:tag-plus",
      "mdi:tag-minus",
      "mdi:tag-remove",
      "mdi:tag-text",
      "mdi:sale-outline",
      "mdi:percent",
      "mdi:percent-outline",
      "mdi:gift-outline",
      "mdi:package-variant-closed",
      "mdi:package-down",
      "mdi:package-up",
      "mdi:truck-delivery",
      "mdi:truck-fast",
      "mdi:dolly",
      "material-symbols:store-mall-directory",
      "material-symbols:shopping",
      "material-symbols:shopping-bag",
      "material-symbols:shopping-basket",
      "material-symbols:shopping-cart",
      "material-symbols:storefront",
      "material-symbols:point-of-sale",
      "material-symbols:payments",
      "material-symbols:receipt",
      "material-symbols:inventory",
      "material-symbols:local-shipping",
      "fluent:building-shop",
      "fluent:building-retail",
      "fluent:cart",
      "fluent:payment",
      "fluent:money",
      "fluent:wallet",
      "ph:shopping-cart",
      "ph:storefront",
      "ph:bag",
      "ph:barcode",
      "ph:credit-card",
      "ph:money",
      "ri:store-2",
      "ri:store-3",
      "ri:shopping-bag",
      "ri:shopping-basket",
      "ri:shopping-cart",
    ],
  },
  "Servicios & Otros": {
    prefix: "services",
    icons: [
      "mdi:spa",
      "mdi:car-service",
      "mdi:home-city",
      "mdi:hospital-box",
      "mdi:dumbbell",
      "mdi:book-open-page-variant",
      "mdi:scissors-cutting",
      "mdi:palette",
      "mdi:music",
      "mdi:camera",
      "material-symbols:spa",
      "material-symbols:medical-services",
      "material-symbols:fitness-center",
      "fluent:vehicle-car-24-filled",
      "fluent:book-24-filled",
      "ph:paint-brush-bold",
      "ri:service-fill",
      "mdi:account-tie",
      "mdi:account-wrench",
      "mdi:account-hard-hat",
      "mdi:hammer-wrench",
      "mdi:tools",
      "mdi:scissors-cutting",
      "mdi:content-cut",
      "mdi:nail",
      "mdi:spray",
      "mdi:hair-dryer",
      "mdi:face-woman-shimmer",
      "mdi:lipstick",
      "mdi:mirror",
      "mdi:comb",
      "mdi:palette-advanced",
      "mdi:brush-variant",
      "mdi:paint",
      "mdi:paint-roller",
      "mdi:format-paint",
      "mdi:wall",
      "mdi:hammer",
      "mdi:screwdriver",
      "mdi:saw-blade",
      "mdi:ladder",
      "mdi:pipe-wrench",
      "mdi:pliers",
      "mdi:ruler",
      "mdi:ruler-square",
      "mdi:tape-measure",
      "mdi:medical-bag",
      "mdi:pill",
      "mdi:bandage",
      "mdi:hospital",
      "mdi:hospital-building",
      "mdi:doctor",
      "mdi:nurse",
      "mdi:microscope",
      "mdi:test-tube",
      "mdi:dna",
      "mdi:tooth",
      "mdi:tooth-outline",
      "mdi:brain",
      "mdi:eye",
      "mdi:ear-hearing",
      "mdi:hand-heart",
      "mdi:heart-pulse",
      "mdi:wheelchair",
      "mdi:dumbbell",
      "mdi:weight-lifter",
      "mdi:yoga",
      "mdi:run",
      "mdi:bike",
      "mdi:swim",
      "mdi:basketball",
      "mdi:football",
      "mdi:tennis",
      "mdi:volleyball",
      "mdi:golf",
      "mdi:karate",
      "mdi:boxing-glove",
      "mdi:skateboard",
      "mdi:snowboard",
      "mdi:ski",
      "mdi:diving-scuba",
      "mdi:diving-snorkel",
      "mdi:guitar-acoustic",
      "mdi:guitar-electric",
      "mdi:piano",
      "mdi:drum",
      "mdi:trumpet",
      "mdi:violin",
      "mdi:microphone-variant",
      "mdi:music-note",
      "mdi:playlist-music",
      "mdi:school",
      "mdi:school-outline",
      "mdi:book-open-variant",
      "mdi:book-education",
      "mdi:pencil",
      "mdi:pencil-ruler",
      "mdi:calculator",
      "mdi:abacus",
      "mdi:math-compass",
      "mdi:flask",
      "mdi:atom",
      "material-symbols:engineering",
      "material-symbols:psychology",
      "material-symbols:dentistry",
      "material-symbols:sports",
      "material-symbols:fitness",
      "material-symbols:school",
      "material-symbols:science",
      "material-symbols:music-note",
      "fluent:vehicle-car",
      "fluent:vehicle-truck",
      "fluent:tools",
      "fluent:scissors",
      "fluent:paint",
      "ph:paint-brush",
      "ph:paint-bucket",
      "ph:first-aid",
      "ph:stethoscope",
      "ph:scissors",
    ],
  },
  "Logos & Marcas": {
    prefix: "brands",
    icons: [
      "logos:facebook",
      "logos:instagram-icon",
      "logos:whatsapp-icon",
      "logos:twitter",
      "logos:tiktok-icon",
      "logos:youtube-icon",
      "logos:snapchat",
      "logos:pinterest",
      "logos:linkedin-icon",
      "logos:google-maps",
    ],
  },
};

export const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  const categories = Object.keys(ICON_SETS);
  const currentCategory = ICON_SETS[categories[currentTab]];

  const filteredIcons = currentCategory.icons.filter((name) => name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
  const paginatedIcons = filteredIcons.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Reset page when changing tab or search
  React.useEffect(() => {
    setPage(1);
  }, [currentTab, search]);

  const renderIconOrEmoji = (value: string) => {
    if (value?.includes(":")) {
      return <Icon icon={value} width='24' height='24' />;
    }
    return <span style={{ fontSize: "24px" }}>{value}</span>;
  };

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          cursor: "pointer",
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          minHeight: "40px",
        }}
      >
        {value && renderIconOrEmoji(value)}
        <Typography>{value ? (value.includes(":") ? value.split(":")[1] : value) : "Seleccionar ícono"}</Typography>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='md' fullWidth>
        <Box sx={{ p: 3 }}>
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }} variant='scrollable' scrollButtons='auto'>
            {categories.map((category, index) => (
              <Tab key={category} label={category} value={index} />
            ))}
          </Tabs>

          <TextField fullWidth label='Buscar ícono' value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {paginatedIcons.map((iconName) => (
              <Grid item xs={4} sm={3} md={2} key={iconName}>
                <Box
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Icon icon={iconName} width='32' height='32' />
                  <Typography
                    variant='caption'
                    sx={{
                      mt: 1,
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    {iconName.split(":")[1]}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              style={{
                padding: "8px 16px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                backgroundColor: page === 1 ? "#f0f0f0" : "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              Anterior
            </button>
            <Typography sx={{ alignSelf: "center" }}>
              Página {page} de {totalPages}
            </Typography>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              style={{
                padding: "8px 16px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                backgroundColor: page === totalPages ? "#f0f0f0" : "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              Siguiente
            </button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default IconSelector;
