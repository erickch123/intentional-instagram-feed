'use client'
import Link from 'next/link';
import {followings} from '../../backend/model/followings'
import { useState, useEffect } from 'react';
import useUserData from './hooks/useUserData';


const Home: React.FC = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [newCategory, setNewCategory] = useState<{ [key: string]: string }>({});
  const [followingUsername, setFollowingUsername] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState<string>('');



  const { user, loading, error,setUser } = useUserData('erickkkk_photos');

  // const followers = Array.from({ length: 50 }, (_, i) => `Follower ${i + 1}`);


  const handleAddCategoryToFollowing = async (followingUsername: string) => {
    if (!newCategory[followingUsername] || newCategory[followingUsername].trim() === '') {
      setErrorMessage('Category is required.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/followings/${user?.username}/${followingUsername}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory[followingUsername] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category to following');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setNewCategory({ ...newCategory, [followingUsername]: '' });
      setErrorMessage(''); // Clear error message on success
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };
  const renderFollowings = () => {
    if (!user) return null;

    const followings = user.followings || [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFollowings = followings.slice(indexOfFirstItem, indexOfLastItem);



    return (
      <>
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Followings</h2>
          <ul className="mt-4 space-y-2">
            {currentFollowings.map((following, index) => (
            <li key={index} className="border p-2 rounded flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{following.username}</h3>
              <p>{following.full_name || '(No full name)'}</p>
              <p>Categories: {following.category.join(', ') || '(No categories)'}</p>
              <p>Description: {following.description || '(No description)'}</p>
            </div>
            <div className="ml-4 flex flex-col items-start">
              <input
                type="text"
                value={newCategory[following.username] || ''}
                onChange={(e) => setNewCategory({ ...newCategory, [following.username]: e.target.value })}
                placeholder="Add new category"
                className="border p-2 rounded text-black mb-2"
              />
              <button
                onClick={() => handleAddCategoryToFollowing(following.username)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add
              </button>
            </div>
          </li>
            ))}
          </ul>
        </div>
        {user.followings && (
          <Pagination
            totalItems={user.followings.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
)}
      </>
    );
  };

  const Pagination = ({ totalItems, currentPage, itemsPerPage, onPageChange }: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (pageNumber: number) => void;
  }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination mt-4 flex justify-center">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-500 p-4 text-white">
        <h1 className="text-3xl font-bold">IntentionalGram</h1>
      </header>
      <nav className="mt-4">
        <ul className="flex space-x-4">
          <li><Link href="/" className="text-blue-500">Home</Link></li>
          <li><Link href="/about" className="text-blue-500">About</Link></li>
          <li><Link href="/categories" className="text-blue-500">Categories</Link></li>
        </ul>
      </nav>
      <main className="mt-8">
       
       
          <main className="mt-8">
          {user ? (
            <>
              <h2 className="text-2xl font-semibold">Welcome, {user.name}!</h2>
              <p className="mt-2">Username: @{user.username}</p>
              {renderFollowings()}
              <div className="mt-4">
                <input
                  type="text"
                  value={newCategory[followingUsername] || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, [followingUsername]: e.target.value })}
                  placeholder="Add new category"
                  className="border p-2 rounded text-black"
                />
                <input
                  type="text"
                  value={followingUsername}
                  onChange={(e) => setFollowingUsername(e.target.value)}
                  placeholder="Following username"
                  className="border p-2 rounded ml-2 text-black"
                />
                <button
                  onClick={() => handleAddCategoryToFollowing(followingUsername)}
                  className="ml-2 bg-blue-500 text-white p-2 rounded"
                >
                  Add Category to Following
                </button>
              </div>
              {errorMessage && (
              <div className="mt-4 p-2 bg-red-500 text-white rounded">
                {errorMessage}
              </div>
            )}
            </>
          ) : (
            <div>Loading...</div>
          )}

        </main>

      </main>
      {/* <script src="/collapsible.js" /> */}
    </div>
  );
};

export default Home;