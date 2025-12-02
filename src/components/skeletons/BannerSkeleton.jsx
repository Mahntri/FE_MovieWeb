import React from 'react';
import Skeleton from './Skeleton';

const BannerSkeleton = () => {
  return (
    <div className="relative w-full h-[700px] bg-gray-900">
       <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
       <div className="relative z-10 max-w-screen-xl mx-auto h-full flex flex-col justify-center px-4 pt-32">
          <Skeleton className="h-16 w-3/4 md:w-1/2 mb-6" /> {/* Tên phim */}
          <div className="flex gap-3 mb-6">
             <Skeleton className="h-8 w-20 rounded-full" />
             <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full md:w-1/3 mb-2" /> {/* Mô tả */}
          <Skeleton className="h-4 w-full md:w-1/3 mb-8" />
          <div className="flex gap-4">
             <Skeleton className="h-12 w-32 rounded-full" />
             <Skeleton className="h-12 w-32 rounded-full" />
          </div>
       </div>
    </div>
  );
};
export default BannerSkeleton;