import React from 'react';
import CardSkeleton from './CardSkeleton';

const ListSkeleton = () => {
  return (
    <div className="pt-24 px-4 md:px-8 max-w-screen-xl mx-auto min-h-screen">
      {/* Tiêu đề */}
      <div className="flex justify-center mb-8">
        <div className="h-8 w-64 bg-gray-800 animate-pulse rounded-md"></div>
      </div>

      {/* Thanh tìm kiếm giả */}
      <div className="flex justify-center mb-8">
         <div className="h-10 w-96 bg-gray-800 animate-pulse rounded-full"></div>
      </div>

      {/* Lưới phim */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Render 10 cái thẻ giả */}
        {Array(10).fill(0).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
export default ListSkeleton;