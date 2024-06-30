import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SpinnerLoader = () => (
  <div className="flex justify-center items-center h-48">
    <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
  </div>
);

const WallpaperPage = () => {
  const [wallpapers, setWallpapers] = useState([]);
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
        const imagePromises = data.map(
          (wallpaper) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = wallpaper.thumbnail_url;
              img.onload = resolve;
              img.onerror = resolve;
            })
        );
        await Promise.all(imagePromises);
        setWallpapers((prevWallpapers) => [...prevWallpapers, ...data]);
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
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="relative p-5 sm:p-8">
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wallpapers.map((wallpaper, index) => {
          const isLastWallpaper = wallpapers.length === index + 1;
          const ref = isLastWallpaper ? lastWallpaperRef : null;

          return (
            <a key={index} href={wallpaper.image_url} target="_blank" rel="noopener noreferrer" ref={ref} className="block break-inside avoid mb-5">
              <div className="relative bg-gray-200 shadow-md overflow-hidden" style={{ paddingBottom: '75%' }}>
                <img
                  src={wallpaper.thumbnail_url}
                  alt={wallpaper.caption}
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
            </a>
          );
        })}
      </div>
      {loading && <SpinnerLoader />}
      {!hasMore && !loading && (
        <div className="text-center mt-4">No More Wallpapers</div>
      )}
    </div>
  );
};

export default WallpaperPage;
