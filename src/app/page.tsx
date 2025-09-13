import { SongCard } from '@/components/song-card';
import { mockSongs } from '@/lib/data';

export default function Home() {
  const recentUploads = mockSongs.slice(0, 6);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recentUploads.map((song) => (
            <SongCard key={song.id} song={song} playlist={recentUploads} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...mockSongs].reverse().map((song) => (
            <SongCard key={song.id} song={song} playlist={mockSongs} />
          ))}
        </div>
      </section>
    </div>
  );
}
