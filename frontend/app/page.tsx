'use client'
import Link from 'next/link';
import {followings} from '../../backend/model/followings'
import { useState, useEffect } from 'react';
import useUserData from './hooks/useUserData';




// let apiurl = "http://localhost:5000";

// interface Following {
//   username: string;
//   full_name: string;
//   category: string[];
//   description: string;
// }

// interface User {
//   _id: string;
//   name: string;
//   username: string;
//   followings: Following[];
//   categories: string[];
// }

const Home: React.FC = () => {




  // Replace these with actual data
  // const firstName = "John";
  // const numFollowing = 52;

  const [firstName, setFirstName] = useState<string>('John');
  const [numFollowing, setNumFollowing] = useState<number>(52);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newCategory, setNewCategory] = useState('');


  const { user, loading, error } = useUserData('erickkkk_photos');

  // const followers = Array.from({ length: 50 }, (_, i) => `Follower ${i + 1}`);

  const renderFollowings = () => {
    if (!user) return null;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFollowings = user.followings.slice(indexOfFirstItem, indexOfLastItem);


    return (
      <>
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Followings</h2>
          <ul className="mt-4 space-y-2">
            {currentFollowings.map((following, index) => (
              <li key={index} className="border p-2 rounded">
                <h3 className="font-semibold">{following.username}</h3>
                <p>{following.full_name || '(No full name)'}</p>
                <p>Categories: {following.category.join(', ') || '(No categories)'}</p>
                <p>Description: {following.description || '(No description)'}</p>
              </li>
            ))}
          </ul>
        </div>
        <Pagination
          totalItems={user.followings.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
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

  // const renderCategories = () => {
  //   if (!user || !user.categories.length) return null;

  //   return (
  //     <div className="mt-8">
  //       <h2 className="text-3xl font-bold">Categories</h2>
  //       <ul className="mt-4 space-y-2">
  //         {user.categories.map((category, index) => (
  //           <li key={index} className="border p-2 rounded">
  //             <p>{category}</p>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // };

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
        <h2 className="text-2xl font-semibold">Welcome to the Main Page</h2>
        <p className="mt-2">This is the main content of the page.</p>
        <div className="mt-4">
          <p className="text-lg">Hi {firstName}</p>
          <p className="text-lg">Following Number: {numFollowing}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Follower List</h2>
          <button
            id="toggle-followers"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Show All
          </button>
          <div className="scrollable-box mt-4" id="followers-list">
            {followings.slice(0, 15).map((following, index) => (
              <div key={index} className="py-2">{following.username}</div>
            ))}
            {/* Add more followers here */}
            <div className="hidden" id="more-followers">
              {followings.slice(15).map((following, index) => (
                <div key={index + 15} className="py-2">{following.username}</div>
              ))}
            </div>
          </div>
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

          {/* {user ? (
            <>
              <h2 className="text-2xl font-semibold">Welcome, {user.name}!</h2>
              <p className="mt-2">Username: @{user.username}</p>
              {renderFollowings()}
              {renderCategories()}
            </>
          ) : (
            <div>Loading...</div>
          )} */}
        </main>

        </div>
      </main>
      {/* <script src="/collapsible.js" /> */}
    </div>
  );
};

export default Home;