import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Section = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setError(null);
      try {
        const response = await axios.get('/api/home');
        setWallpapers(response.data);
      } catch (error) {
        console.error('Api error', error);
        setError('Api error');
      }
    };

    fetchWallpapers();
  }, []);

  return (
    <div className="section-container">
      {error ? (
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      ) : (
        <div className="p-5 sm:p-8">
          <div className="masonry-layout columns-1 gap-5 sm:columns-2 md:columns-3 lg:columns-4">
            {wallpapers.map((wallpaper, index) => (
              <WallpaperCard key={index} wallpaper={wallpaper} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WallpaperCard = ({ wallpaper }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="break-inside avoid mb-5">
      <div className="bg-gray shadow-md overflow-hidden">
        <img
          src={wallpaper.thumbnail_url}
          alt={wallpaper.caption}
          className={`w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default Section;
