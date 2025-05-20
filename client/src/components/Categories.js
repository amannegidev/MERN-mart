import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="px-5 py-2 ">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {categories?.map((c) => (
            <Link
              key={c._id}
              to={`/category/${c.slug}`}
              className="no-underline text-base md:text-lg font-sans text-green-900  border-green-300 px-3 py-2 rounded hover:bg-green-200 transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
