export const MetricCard = ({ title, value, icon }) => {
  return (
    <div className='bg-white rounded-lg border border-black/20  p-6'>
      <div className='flex justify-between items-center mb-2'>
        <h3 className='text-sm font-medium'>{title}</h3>
        {icon}
      </div>
      <div className='text-2xl font-bold text-[#5b7898]'>{value}</div>
    </div>
  );
};
