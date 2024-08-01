import Link from 'next/link';

const Home: React.FC = () => {
  // Replace these with actual data
  const firstName = "John";
  const numFollowing = 52;
  const followers = Array.from({ length: 50 }, (_, i) => `Follower ${i + 1}`);

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
            {followers.slice(0, 15).map((follower, index) => (
              <div key={index} className="py-2">{follower}</div>
            ))}
            {/* Add more followers here */}
            <div className="hidden" id="more-followers">
              {followers.slice(15).map((follower, index) => (
                <div key={index + 15} className="py-2">{follower}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <script src="/collapsible.js" />
    </div>
  );
};

export default Home;