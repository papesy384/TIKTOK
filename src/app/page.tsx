import { Feed } from "@/components/Feed";

const MOCK_VIDEOS = [
  {
    id: "1",
    src: "/videos/messi.mp4",
    username: "@leomessi",
    description: "Leo Messi — football / soccer clip.",
  },
  {
    id: "2",
    src: "/videos/placeholder-1.mp4",
    username: "@sintel_movie",
    description: "Movie — fantasy short film clip (Sintel).",
  },
  {
    id: "3",
    src: "/videos/bunny.mp4",
    username: "@bigbuckbunny",
    description: "Animation — Big Buck Bunny cartoon.",
  },
  {
    id: "4",
    src: "/videos/jellyfish.mp4",
    username: "@nature_chill",
    description: "Nature — jellyfish, ambient vibes.",
  },
];

export default function Home() {
  return (
    <main className="h-screen-dynamic h-screen w-full">
      <Feed videos={MOCK_VIDEOS} />
    </main>
  );
}
