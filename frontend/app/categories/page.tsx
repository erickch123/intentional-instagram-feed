'use client'
import Link from 'next/link';
import { useState } from 'react';
import {useUserData,Category} from '../hooks/useUserData';

const Categories: React.FC = () => {
  const { user, loading, error, setUser } = useUserData('erickkkk_photos');
  const [newCategoryName, setNewCategory] =  useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [renameCategory, setRenameCategory] = useState<string>('');
  const [categoryToRename, setCategoryToRename] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFollowings, setFilteredFollowings] = useState<any[]>([]);


  

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') return;
  
    try {
      const response = await fetch(`http://localhost:5000/users/categories/${user?.username}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
  
      
      if (!response.ok) {
        console.log(response);
        throw new Error(`Failed to add category due to errr response: ${response}`);
      }
      const result = await response.json();
      const addedCategory = result.data;


      // Ensure all required fields are present and correctly typed
      const updatedUser = {
        ...user,
        categories: [...(user?.categories || []), addedCategory],
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

  const handleRenameCategory = async () => {
    if (!categoryToRename || renameCategory.trim() === '') return;

    try {
      const response = await fetch(`http://localhost:5000/users/categories/${user?.username}/rename`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldCategory: categoryToRename, newCategory: renameCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename category');
      }

      const result = await response.json();
      const updatedCategory = result.data;


      // Ensure all required fields are present and correctly typed
      const updatedUser = {
        ...user,
        categories: user!.categories.map(category =>
          category.name === categoryToRename ? updatedCategory : category
        ),
        _id: user!._id || '', // Ensure _id is not undefined
        name: user!.name || '',
        username: user!.username || '',
        followings: user!.followings || [],
      };
  
      setUser(updatedUser);
      setCategoryToRename('');
      setRenameCategory('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredFollowings([]);
    } else {
      const filtered = user?.followings.filter(following =>
        following.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFollowings(filtered || []);
    }
  };

  const handleAddToCategory = async (followingUsername: string) => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`http://localhost:5000/users/followings/${user?.username}/${followingUsername}/${selectedCategory}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to add following to category');
      }

      const res = await response.json();
      const updatedCategoryModel = res.data;

      // Update the user's followings with the new category
      const updatedUser = {
        ...user,
        followings: user!.followings.map(following =>
          following.username === followingUsername
            ? { ...following, categories: [...following.categories, updatedCategoryModel] }
            : following
        ),
        _id: user!._id || '', // Ensure _id is not undefined
        name: user!.name || '',
        username: user!.username || '',
        categories: user!.categories || [],
      };

      setUser(updatedUser);
      setSearchTerm('');
      setFilteredFollowings([]);
    } catch (err) {
      console.error(err);
    }
  };


  const renderCategories = () => {
   
    if (!user || !user.categories || !user.categories.length) return null;

    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold">Categories</h2>
        <h4 className="text-3xl ">Click any category to see the followings list</h4>
        <ul className="mt-4 space-y-2">
        {user.categories.map((category) => (
          <li key={category.id} className="border p-2 rounded flex justify-between items-center">
            <p
              onClick={() => handleCategoryClick(category.name)}
              className="cursor-pointer"
            >
              {category.name}
            </p>
            <div className="flex items-center">
              <button
                onClick={() => setCategoryToRename(category.name)}
                className="ml-2 bg-yellow-500 text-white p-1 rounded"
              >
                Rename
              </button>
              {categoryToRename === category.name && (
                <div className="ml-2 flex items-center">
                  <input
                    type="text"
                    value={renameCategory}
                    onChange={(e) => setRenameCategory(e.target.value)}
                    placeholder="Rename category"
                    className="border p-2 rounded text-black"
                  />
                  <button
                    onClick={handleRenameCategory}
                    className="ml-2 bg-green-500 text-white p-2 rounded"
                  >
                    Rename
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      </div>
    );
  };

  const renderFollowingsByCategory = () => {
    if (!user || !selectedCategory) return null;

    const followingsByCategory = user.followings.filter(following =>
      following.categories.some(category => category.name === selectedCategory)
    );
    if (!followingsByCategory.length) return <p>No followings in this category.</p>;

    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold">Followings in {selectedCategory}</h2>
        <ul className="mt-4 space-y-2">
          {followingsByCategory.map((following, index) => (
            <li key={index} className="border p-2 rounded">
              <h3 className="font-semibold">  
                <a href={`https://instagram.com/${following.username}`} target="_blank" rel="noopener noreferrer">
                {following.username}
                </a>
              </h3>
              {/* <p>{following.full_name || '(No full name)'}</p>
              <p>Categories: {following.category.join(', ') || '(No categories)'}</p>
              <p>Description: {following.description || '(No description)'}</p> */}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h3 className="text-2xl font-bold">Add an Instagram username to this category</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by username"
            className="border p-2 rounded w-full mt-2"
          />
          {filteredFollowings.length > 0 && (
            <ul className="mt-4 space-y-2">
              {filteredFollowings.map((following, index) => (
                <li key={index} className="border p-2 rounded flex justify-between items-center">
                  <span>{following.username}</span>
                  <button
                    onClick={() => handleAddToCategory(following.username)}
                    className="px-4 py-2 bg-blue-500 text-black rounded"
                  >
                    Add to {selectedCategory}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>


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
            value={newCategoryName}
            onChange={(e) => setNewCategory(e.target.value )}
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