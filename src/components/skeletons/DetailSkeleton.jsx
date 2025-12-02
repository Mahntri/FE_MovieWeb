import React from 'react';
import Skeleton from './Skeleton';

const DetailSkeleton = () => {
  return (
    <div className="bg-gray-900 min-h-screen pb-20">
      
      {/* 1. HERO BANNER SKELETON */}
      <div className="relative w-full h-[600px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/50 to-transparent" />
        
        <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col md:flex-row items-end h-full px-6 pb-12 gap-8">
          {/* Ảnh Poster Lớn */}
          <Skeleton className="hidden md:block w-72 h-[450px] rounded-xl flex-shrink-0" />
          
          <div className="flex-1 mb-4 w-full">
            {/* Tiêu đề */}
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-12 w-1/2 mb-6" />
            
            {/* Rating & Genres */}
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            {/* Overview */}
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            {/* Nút bấm */}
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT SKELETON */}
      <div className="max-w-screen-xl mx-auto px-6 mt-10 space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#1f1f1f] p-6 rounded-xl border border-gray-800">
            <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1"><Skeleton className="h-4 w-20 mb-2"/><Skeleton className="h-4 w-32"/></div>
            </div>
            <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1"><Skeleton className="h-4 w-20 mb-2"/><Skeleton className="h-4 w-32"/></div>
            </div>
            <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1"><Skeleton className="h-4 w-20 mb-2"/><Skeleton className="h-4 w-32"/></div>
            </div>
        </div>

        {/* Casts */}
        <div>
            <Skeleton className="h-8 w-40 mb-6" /> {/* Title */}
            <div className="flex gap-4 overflow-hidden">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="flex flex-col items-center min-w-[100px]">
                        <Skeleton className="w-24 h-32 rounded-lg mb-2" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>
        </div>

        {/* Trailer */}
        <div>
            <Skeleton className="h-8 w-40 mb-6" />
            <Skeleton className="w-full h-[500px] rounded-xl" />
        </div>

      </div>
    </div>
  );
};

export default DetailSkeleton;