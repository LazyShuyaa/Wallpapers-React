import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SkeletonLoader = () => (
  <div className="bg-gray-200 shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
  </div>
);

const WallpaperPage = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [newWallpapers, setNewWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { query } = useParams();
  const observer = useRef();

  const fetchWallpapers = async (page) => {
    try {
      const response = await axios.post(`/api/search?query=${query}`, { page });
      return response.data;
    } catch (error) {
      throw new Error('Error');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWallpapers(page);
        setNewWallpapers(data);
        setHasMore(data.length > 0);
        setLoading(false);
      } catch (error) {
        setError('Error');
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

  const lastWallpaperRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          setWallpapers((prevWallpapers) => [...prevWallpapers, ...newWallpapers]);
          setNewWallpapers([]);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, newWallpapers]
  );

  return (
    <div className="relative p-5 sm:p-8">
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <div className="masonry-layout columns-1 gap-5 sm:columns-2 md:columns-3 lg:columns-4">
        {wallpapers.map((wallpaper, index) => (
          <a key={index} href={wallpaper.image_url} target="_blank" rel="noopener noreferrer" className="break-inside avoid mb-5 block">
            <div className="bg-gray-200 shadow-md overflow-hidden">
              <img
                src={wallpaper.thumbnail_url}
                alt={wallpaper.caption}
                loading="lazy"
                className="w-full object-cover transition-opacity duration-500"
              />
            </div>
          </a>
        ))}
        {newWallpapers.map((wallpaper, index) => {
          const isLastWallpaper = newWallpapers.length === index + 1;
          const ref = isLastWallpaper ? lastWallpaperRef : null;
          
          return (
            <a key={index} href={wallpaper.image_url} target="_blank" rel="noopener noreferrer" ref={ref} className="break-inside avoid mb-5 block">
              <div className="bg-gray-200 shadow-md overflow-hidden">
                <img
                  src={wallpaper.thumbnail_url}
                  alt={wallpaper.caption}
                  loading="lazy"
                  className="w-full object-cover transition-opacity duration-500"
                />
              </div>
            </a>
          );
        })}
        {loading && Array.from({ length: 10 }).map((_, index) => <SkeletonLoader key={index} />)}
      </div>
      {!hasMore && !loading && (
        <div className="text-center mt-4">No More Wallpapers</div>
      )}
    </div>
  );
};

export default WallpaperPage;
