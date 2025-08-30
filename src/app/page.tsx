import CenterMenus from "../components/Home/CenterMenus";
import LeftMenus from "../components/Home/LeftMenus";
import RightMenus from "../components/Home/RightMenus";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home({ searchParams }: { searchParams?: { cursor?: string } }) {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex flex-col">
        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-[#111827] rounded-3xl shadow-xl px-4 py-4 sm:py-12 my-4 sm:mt-8 text-center bg-white/70 bg-blend-overlay">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Share what’s on your mind ✨
          </h1>

          <p className="text-xl mb-8 max-w-3xl mx-auto">
            📸 Post a photo, ✍️ write your thoughts, or 🎉 capture little moments from your day. Every update becomes part of your story. Your feed is your space — a timeline of memories, ideas, and highlights you want to share with the world.
          </p>
        </div>

        <div className="w-full rounded-3xl shadow-xl px-4 py-4 sm:py-12 my-4 sm:mb-4 text-center bg-[linear-gradient(180deg,#f5f6fa_0%,#ffffffcc_100%)]">
          <h2 className="text-xl md:text-3xl font-bold text-[#111827] mb-4">
            Connect through conversations 💬
          </h2>

          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            🤝 Posts are more than just content — they start conversations. 🗨️ Friends can comment, react, and join in, making every post an opportunity to connect. 🌍 Discover what others are sharing, add your voice, and grow your community one interaction at a time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      <div className="w-full lg:w-[20%]">
        <LeftMenus type="home" />
      </div>

      <div className="w-full xl:w-[50%] lg:w-[70%]">
        <CenterMenus searchParams={searchParams} />
      </div>

      <div className="w-full xl:w-[25%] lg:w-[30%]">
        <RightMenus />
      </div>
    </div>
  );
}
