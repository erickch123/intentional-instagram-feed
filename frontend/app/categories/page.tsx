'use client'
import Link from 'next/link';
import { useState } from 'react';
import useUserData from '../hooks/useUserData';

const Categories: React.FC = () => {
  const { user, loading, error, setUser } = useUserData('erickkkk_photos');
  const [newCategory, setNewCategory] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;
  
    try {
      const response = await fetch(`http://localhost:5000/users/categories/${user?.username}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
  
      // Ensure all required fields are present and correctly typed
      const updatedUser = {
        ...user,
        categories: [...(user?.categories || []), newCategory],
        _id: user?._id || '', // Ensure _id is not undefined
        name: user?.name || '',
        username: user?.username || '',
        followings: user?.followings || [],
      };
  
      setUser(updatedUser);
      setNewCategory('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const renderCategories = () => {
    if (!user || !user.categories.length) return null;

    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold">Categories</h2>
        <ul className="mt-4 space-y-2">
          {user.categories.map((category, index) => (
            <li key={index} className="border p-2 rounded cursor-pointer" onClick={() => handleCategoryClick(category)}>
            <p>{category}</p>
          </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderFollowingsByCategory = () => {
    if (!user || !selectedCategory) return null;

    const followingsByCategory = user.followings.filter(following => following.category.includes(selectedCategory));

    if (!followingsByCategory.length) return <p>No followings in this category.</p>;

    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold">Followings in {selectedCategory}</h2>
        <ul className="mt-4 space-y-2">
          {followingsByCategory.map((following, index) => (
            <li key={index} className="border p-2 rounded">
              <h3 className="font-semibold">{following.username}</h3>
              <p>{following.full_name || '(No full name)'}</p>
              <p>Categories: {following.category.join(', ') || '(No categories)'}</p>
              <p>Description: {following.description || '(No description)'}</p>
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
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {renderCategories()}
        {renderFollowingsByCategory()}
        <div className="mt-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category"
            className="border p-2 rounded text-black"
          />
          <button
            onClick={handleAddCategory}
            className="ml-2 bg-blue-500 text-white p-2 rounded"
          >
            Add Category
          </button>
        </div>
      </main>
    </div>
  );
}

export default Categories;