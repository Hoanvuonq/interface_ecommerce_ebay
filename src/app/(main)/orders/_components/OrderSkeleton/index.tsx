import Skeleton from "react-loading-skeleton";

export const OrderSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 mb-4 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Skeleton circle width={40} height={40} />
        <div>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={10} className="mt-1" />
        </div>
      </div>
      <Skeleton width={80} height={24} borderRadius={20} />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton width={60} height={60} borderRadius={12} />
      <div className="flex-1">
        <Skeleton width="70%" height={16} />
        <div className="flex gap-2 mt-2">
          <Skeleton width={50} height={12} />
          <Skeleton width={50} height={12} />
        </div>
      </div>
    </div>
  </div>
);
