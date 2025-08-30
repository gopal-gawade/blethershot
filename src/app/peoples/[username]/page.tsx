import prisma from '../../../lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function page({ params }: {
    params: Promise<{ username?: string }>
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

    const users = await prisma.user.findMany({})

    const followers = await prisma.follower.findMany({
        where: {
            followerId: user.id
        }
    })
    const followerIds = followers?.map((v) => v.followingId)

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 text-sm flex flex-col gap-4 text-[#111827]">
                <div className="flex justify-between items-center">
                    <span className="text-md">
                        Users
                    </span>
                </div>

                <div className='flex flex-col gap-2'>
                    {users?.length !== 0 && users.filter((self) => self.id !== user.id).filter((req) => !followerIds.includes(req.id)).map((usersingle) => {
                        return (
                            <div className="flex flex-col md:flex-row items-center gap-4" key={usersingle.id}>
                                <Image
                                    src={usersingle.avatar || "/account-grey-icon.png"}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                />

                                <span className="text-md">
                                    <Link href={`/profile/${usersingle.username}`}>
                                        {usersingle.username}
                                    </Link>
                                </span>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-md">
                        Friends
                    </span>
                </div>

                <div className='flex flex-col gap-2'>
                    {users?.length !== 0 && users.filter((self) => self.id !== user.id).filter((req) => followerIds.includes(req.id)).map((usersingle) => {
                        return (
                            <div className="flex flex-col md:flex-row items-center gap-4" key={usersingle.id}>
                                <Image
                                    src={usersingle.avatar || "/account-grey-icon.png"}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover"
                                />

                                <span className="text-md">
                                    <Link href={`/profile/${usersingle.username}`}>
                                        {usersingle.username}
                                    </Link>
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
