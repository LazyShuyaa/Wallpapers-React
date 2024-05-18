import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Section from './Section';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/wallpaper/${searchQuery}`);
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div
        className="relative bg-cover bg-center bg-black"
        style={{
          backgroundImage: `url('/subverso-ac-8HrVclautyw-unsplash.jpg')`,
          width: '100%',
          height: '400px',
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <form
          onSubmit={handleSubmit}
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-4"
        >
          <div className="flex flex-col items-start w-full max-w-lg">
            <p
              className="text-white text-3xl font-normal leading-relaxed mb-6"
              style={{ maxWidth: '800px' }}
            >
              Discover a vast collection of stunning wallpapers that perfectly match your style and personality.
            </p>
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search wallpapers..."
                name="search"
                className="border border-gray-300 px-4 py-2 rounded-l-lg focus:outline-none w-full text-black"
                value={searchQuery}
                onChange={handleChange}
                aria-label="Search wallpapers"
              />
              <button
                type="submit"
                className="bg-white hover:bg-gray-600 text-black px-4 py-2 rounded-r-lg focus:outline-none"
                aria-label="Search"
              >
                <FiSearch />
              </button>
            </div>
          </div>
        </form>
      </div>

      <Section />
    </div>
  );
};

export default SearchBar;
