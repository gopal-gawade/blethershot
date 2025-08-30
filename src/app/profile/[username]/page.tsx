import LeftMenus from '../../../components/Home/LeftMenus'
import RightMenus from '../../../components/Home/RightMenus'
import AllPost from '../../../components/Post/AllPost'
import prisma from '../../../lib/client'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Profile({ params }: {
  params: Promise<{ username: string }>
}) {
  const username = (await params).username;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
  });

  if (!user) return notFound();

  const { userId: currentUserId } = await auth();

  let isBlocked;

  if (currentUserId) {
    const res = await prisma.block.findFirst({
      where: {
        blockerId: user?.id,
        blockedId: currentUserId
      }
    })

    if (res) {
      isBlocked = true;
    }
  }
  else {
    isBlocked = false
  }

  if (isBlocked) {
    return notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      <div className="hidden lg:block lg:w-[20%]">
        <LeftMenus type='profile' />
      </div>

      <div className="w-full xl:w-[50%] lg:w-[70%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="w-full h-64 lg:h-42 relative">
              <Image
                src={user.cover || "/abstract_white_aesthetic_minimalism_wavy-wallpaper-960x540.jpg"}
                alt=""
                fill
                className="rounded-tl-3xl rounded-tr-3xl object-cover"
              />
              <Image
                src={user.avatar ? user.avatar : "/account-grey-icon.png"}
                alt=""
                width={80}
                height={80}
                className="w-24 h-24 rounded-full absolute left-0 right-0 m-auto -bottom-2 ring-4 ring-[#FFFFFF] object-cover transform transition duration-250 hover:scale-105"
              />
            </div>

            <h1 className="m-2 mt-6 text-2xl">
              {user.name && user.surname
                ? `${user.name} ${user.surname}`
                : user.username}
            </h1>

            <div className="flex items-center gap-2 m-2">
              <div className="flex flex-col items-center w-24">
                <span className="font-medium">{user._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>

              <div className="flex flex-col items-center w-24">
                <span className="font-medium">{user._count.followers}</span>
                <span className="text-sm">Followers</span>
              </div>

              <div className="flex flex-col items-center w-24">
                <span className="font-medium">{user._count.followings}</span>
                <span className="text-sm">Following</span>
              </div>
            </div>

            <Link
              href={`/peoples/${user.username}`}
              className='mb-4 lg:hidden'
            >
              <button className="cursor-pointer p-2 w-full rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition">
                Connect with friends
              </button>
            </Link>
          </div>

          <AllPost username={user.username} />
        </div>
      </div>

      <div className="w-full xl:w-[25%] lg:w-[30%]">
        <RightMenus user={user} />
      </div>
    </div>
  )
}
