import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Music App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/songs" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Songs</h2>
          <p className="text-gray-600">Browse and play your favorite songs</p>
        </Link>
        
        <Link href="/playlists" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Playlists</h2>
          <p className="text-gray-600">Create and manage your playlists</p>
        </Link>
        
        <Link href="/artists" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Artists</h2>
          <p className="text-gray-600">Discover new artists and their music</p>
        </Link>
        
        <Link href="/albums" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Albums</h2>
          <p className="text-gray-600">Explore music albums</p>
        </Link>
        
        <Link href="/search" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Search</h2>
          <p className="text-gray-600">Search for songs, artists, and albums</p>
        </Link>
        
        <Link href="/profile" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Manage your account and preferences</p>
        </Link>
      </div>
    </div>
  )
}
