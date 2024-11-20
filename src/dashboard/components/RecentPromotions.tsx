import { useDashboard } from "../../hooks";
import { useNavigateTo } from "../../hooks/useNavigateTo";

interface Promotion {
  id: string;
  name: string;
  createdAt: string;
  status: "active" | "inactive";
  systemType: "points" | "visits";
  visitsRequired: number;
}

interface RecentPromotionsProps {
  promotions?: Promotion[];
}

export const RecentPromotions = ({ promotions = [] }: RecentPromotionsProps) => {
  const { getPromotionById } = useDashboard();
  const { handleNavigate } = useNavigateTo();

  const handlePromotionClick = (promotionId: string) => {
    getPromotionById(promotionId);
    handleNavigate(`/dashboard/promotion/${promotionId}`);
  };

  console.log("promociones", promotions);

  // Ordenar promociones por fecha de creación (más recientes primero)
  const sortedPromotions = [...promotions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className='bg-white rounded-lg border border-t-4 border-black/20 border-t-[#5b7898] p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-[#5b7898]'>Promociones Recientes</h2>
          <p className='text-gray-600 text-sm mt-1'>Últimas promociones creadas</p>
        </div>
      </div>

      <div className='mt-4 space-y-4'>
        {promotions.length === 0 ? (
          <p className='text-gray-500 text-sm'>No hay promociones recientes</p>
        ) : (
          sortedPromotions.slice(0, 5).map((promotion) => (
            <div
              key={promotion._id}
              className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors'
              onClick={() => handlePromotionClick(promotion._id)}
            >
              <div>
                <p className='font-medium'>{promotion.name}</p>
                <div className='flex gap-2 items-center'>
                  <p className='text-sm text-gray-500'>
                    {promotion.title} - {new Date(promotion.createdAt).toLocaleDateString("es-ES")}
                  </p>
                  <span className='text-sm text-gray-500'>•</span>
                  <p className='text-sm text-gray-500'>
                    {promotion.systemType === "points" ? "Sistema de Puntos" : `Sistema de Visitas (${promotion.visitsRequired} visitas)`}
                  </p>
                </div>
              </div>
              <span className='px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>Activa</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
