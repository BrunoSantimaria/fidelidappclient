export const sortPromotions = (promotions, isPromotionHot) => {
  if (!promotions) return [];

  return [...promotions].sort((a, b) => {
    // Programas de puntos siempre arriba
    if (a.systemType === "points") return -1;
    if (b.systemType === "points") return 1;

    // Promoción activa del día ('hot') en segundo lugar
    if (isPromotionHot(a)) return -1;
    if (isPromotionHot(b)) return 1;

    // El resto por startDate cronológicamente
    const dateA = new Date(a.startDate || 0).getTime();
    const dateB = new Date(b.startDate || 0).getTime();
    return dateA - dateB;
  });
};
