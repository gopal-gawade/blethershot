import React from 'react'
import prisma from '../../lib/client';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image'
import Link from 'next/link'

export default async function ProfileCard({ type }: {
    type: "home" | "profile"
}) {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

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
        <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-6">
            <div className="h-44 lg:h-20 relative">
                <Image
                    src={user.cover ? user.cover : "/abstract_white_aesthetic_minimalism_wavy-wallpaper-960x540.jpg"}
                    alt=""
                    fill
                    className="rounded-md object-cover object-center transform transition duration-250 hover:scale-105"
                />
                <Image
                    src={user.avatar ? user.avatar : "/account-grey-icon.png"}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-32 h-32 lg:h-12 lg:w-12 absolute left-0 right-0 m-auto -bottom-4 ring-2 ring-white z-10 transform transition duration-250 hover:scale-105"
                />
            </div>

            <div className="flex flex-col gap-2 items-stretch text-center">
                <span className="text-lg text-[#111827]">
                    {user.name && user.surname
                        ? `${user.name} ${user.surname}`
                        : user.username}
                </span>

                <span className="text-sm text-[#4b5563]">
                    {user._count.followers} Followers
                </span>

                {type === "home" ?
                    <Link href={`/profile/${user.username}`}>
                        <button className="cursor-pointer p-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow hover:opacity-90 transition">
                            My Profile
                        </button>
                    </Link> :
                    null
                }

                <Link href={`/peoples/${user.username}`}>
                    <button className="cursor-pointer p-2 w-full rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition">
                        Connect with friends
                    </button>
                </Link>
            </div>
        </div>
    )
}
