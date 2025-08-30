import prisma from "../../../lib/client";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import FriendRequestList from "./FriendRequestList";

const FriendRequests = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  if (requests.filter((rq: any) => rq.senderId !== userId).length === 0) return null;

  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    include: {
      _count: {
        select: {
          followers: true
        }
      }
    }
  })

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between text-[#111827] text-xl font-medium">
        <span>Friend Requests</span>

        <Link
          href={`/peoples/${user.username}`}
          className="text-[#3b82f6] text-sm"
        >
          See all
        </Link>
      </div>

      <FriendRequestList requests={requests} />
    </div>
  );
};

export default FriendRequests;
