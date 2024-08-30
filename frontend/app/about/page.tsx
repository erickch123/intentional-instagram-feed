import Link from 'next/link';

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="bg-green-500 p-4 text-white">
        <h1 className="text-3xl font-bold">About Page</h1>
      </header>
      <nav className="mt-4">
        <ul className="flex space-x-4">
          <li><Link href="/" className="text-blue-500">Home</Link></li>
          <li><Link href="/about" className="text-blue-500">About</Link></li>
          <li><Link href="/categories" className="text-blue-500">Categories</Link></li>
        </ul>
      </nav>
      <main className="mt-8">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <p className="mt-2">This page provides information about us.</p>
      </main>
    </div>
  );
}

export default About;