import React from 'react';
import Skeleton from './Skeleton';

const CardSkeleton = () => {
  return (
    <div className="flex flex-col">
      {/* Khung ảnh */}
      <Skeleton className="w-full aspect-[2/3] rounded-lg mb-3" />
      {/* Tên phim */}
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};
export default CardSkeleton;