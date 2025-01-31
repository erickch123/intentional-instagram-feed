'use client'
import Link from 'next/link';

import { useState, useEffect } from 'react';
import {useUserData} from './hooks/useUserData';


const Home: React.FC = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [newCategory, setNewCategory] = useState<{ [key: string]: string }>({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredFollowings, setFilteredFollowings] = useState<any[]>([]);



  const { user, loading, error,setUser } = useUserData('erickkkk_photos');
  const handleAddCategoryToFollowing = async (followingUsername: string) => {
    if (!newCategory[followingUsername] || newCategory[followingUsername].trim() === '') {
      setErrorMessages({ ...errorMessages, [followingUsername]: 'Category is required.' });
      return;
    }

    try {

      const response = await fetch(`http://localhost:5000/users/followings/${user?.username}/${followingUsername}/${newCategory[followingUsername]}`, {
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

      const res = await response.json();
      const updatedCategoryModel = res.data;

      // setUser(updatedUser);
      // Ensure all required fields are present and correctly typed
      // const updatedFollowing = {
      //   res.message.name
      // };

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
      console.log("after",updatedUser)
  
      setUser(updatedUser);

      if (searchTerm) {
        const updatedFilteredFollowings = filteredFollowings.map(following =>
          following.username === followingUsername
            ? { ...following, categories: [...following.categories, updatedCategoryModel] }
            : following
        );
        setFilteredFollowings(updatedFilteredFollowings);
      }

      setNewCategory({ ...newCategory, [followingUsername]: '' });
      setErrorMessages({ ...errorMessages, [followingUsername]: '' }); // Clear error message on success
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessages({ ...errorMessages, [followingUsername]: err.message });
      } else {
        setErrorMessages({ ...errorMessages, [followingUsername]: 'An unknown error occurred.' });
      }
    }
  };
  const deleteCategoryOfAFollowing = async (followingUsername:string, category:string) => {
    try {
      const response = await fetch(`http://localhost:5000/users/categories/${user?.username}/followings/${followingUsername}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Update the UI or state after successful deletion
      console.log(`Deleted category ${category} from following ${followingUsername}`);
      // Optionally, you can refresh the followings list or update the state here
      const updatedUser = {
        ...user,
        followings: user!.followings.map(following =>
          following.username === followingUsername
          ? { ...following, categories: following.categories.filter(cat => cat.name !== category) }
          : following
        ),
        _id: user!._id || '', // Ensure _id is not undefined
        name: user!.name || '',
        username: user!.username || '',
        categories: user!.categories || [],
      };
      console.log("after",updatedUser)
  
      setUser(updatedUser);


    }  catch (err) {
      if (err instanceof Error) {
        setErrorMessages({ ...errorMessages, [followingUsername]: err.message });
      } else {
        setErrorMessages({ ...errorMessages, [followingUsername]: 'An unknown error occurred.' });
      }
    }
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
    if (term.trim() === '') {
      setFilteredFollowings([]);
    } else {
      const filtered = user?.followings.filter(following =>
        following.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFollowings(filtered || []);
    }
  };
  const renderFollowings = () => {
    if (!user) return null;


    const followings = searchTerm ? filteredFollowings : user.followings || [];
    // const followings = user.followings || [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFollowings = followings.slice(indexOfFirstItem, indexOfLastItem);



    return (
      <>
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Followings</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by username"
            className="border p-2 rounded w-full mt-2 text-black"
          />
          <ul className="mt-4 space-y-2">
            {currentFollowings.map((following, index) => (
            <li key={index} className="border p-2 rounded flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
              <a href={`https://instagram.com/${following.username}`} target="_blank" rel="noopener noreferrer">
    {following.username}
  </a>
                </h3>
              <p>{following.fullName || '(No full name)'}</p>
              <p>
              Categories: {following.categories.length > 0 
                ? following.categories.map(category => category.name).join(', ') 
                : '(No categories)'}
          </p>
              <p>Description: {following.description || '(No description)'}</p>
            </div>
            <div className="ml-4 flex flex-col items-start">
              {/* <input
                type="text"
                value={newCategory[following.username] || ''}
                onChange={(e) => setNewCategory({ ...newCategory, [following.username]: e.target.value })}
                placeholder="Add new category"
                className="border p-2 rounded text-black mb-2"
              /> */}
              <select
                value={newCategory[following.username] || ''}
                onChange={(e) => setNewCategory({ ...newCategory, [following.username]: e.target.value })}
                className="border p-2 rounded text-black mb-2"
              >
                <option value="" disabled>Select a category</option>
                {user?.categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAddCategoryToFollowing(following.username)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add
              </button>
              <button
                  onClick={() => deleteCategoryOfAFollowing(following.username, newCategory[following.username])}
                  className="bg-red-500 text-white p-2 rounded mt-2"
                >
                  Delete
                </button>
              {errorMessages[following.username] && (
                    <div className="mt-4 p-2 bg-red-500 text-white rounded">
                      {errorMessages[following.username]}
                    </div>
                  )}              
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
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPageButtons = 5; // Maximum number of page buttons to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    // for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    //   pageNumbers.push(i);
    // }

    const handleJumpToPage = () => {
      const pageNumber = prompt("Enter page number:");
      const page = Number(pageNumber);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}`);
      }
    };
  

    return (
      <div className="pagination mt-4 flex justify-center">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 bg-gray-200 rounded"
        >
          Previous
        </button>
      )}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 mx-1 bg-gray-200 rounded"
          >
            1
          </button>
          {startPage > 2 && <span className="px-4 py-2 mx-1">...</span>}
        </>
      )}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
        >
          {number}
        </button>
      ))}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-4 py-2 mx-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 mx-1 bg-gray-200 rounded"
          >
            {totalPages}
          </button>
        </>
      )}
      {currentPage < totalPages && (
        <>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 bg-gray-200 rounded"
        >
          Next
        </button>
        <button
        onClick={handleJumpToPage}
        className="px-4 py-2 mx-1 bg-gray-200 rounded"
      >
        Jump to Page
      </button>
      </>
      )}
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