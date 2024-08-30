'use client'
import Link from 'next/link';
import { useState } from 'react';
import useUserData from '../hooks/useUserData';



const Categories: React.FC = () => {
  const { user, loading, error, setUser } = useUserData('erickkkk_photos');


  const [newCategory, setNewCategory] = useState<string>('');

   const renderCategories = () => {
    if (!user || !user.categories.length) return null;

    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold">Categories</h2>
        <ul className="mt-4 space-y-2">
        {user.categories.map((category, index) => (
            <li key={index} className="border p-2 rounded">
              <p>{category}</p> {/* Directly rendering the string */}
            </li>
          ))}
        </ul>
      </div>
    );
  };




  return (
    <div className="container mx-auto p-4">
      <header className="bg-red-500 p-4 text-white">
        <h1 className="text-3xl font-bold">Categories Page</h1>
      </header>
      <nav className="mt-4">
        <ul className="flex space-x-4">
          <li><Link href="/" className="text-blue-500">Home</Link></li>
          <li><Link href="/about" className="text-blue-500">About</Link></li>
          <li><Link href="/categories" className="text-blue-500">Categories</Link></li>
        </ul>
      </nav>
      <main className="mt-8">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <p className="mt-2">Explore our categories here.</p>
        {renderCategories()}
      </main>
    </div>
  );
}


// TODO User is able to create category
export default Categories;