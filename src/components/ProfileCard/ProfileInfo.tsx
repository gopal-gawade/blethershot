import Link from 'next/link'
import React from 'react'
import { MdDateRange } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { User } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import prisma from '../../lib/client'
import UpdateProfile from './UpdateProfile';
import FollowUnfollow from './Follow/FollowUnfollow';

export default async function ProfileInfo({ user }: {
    user?: User
}) {
    const createdAtDate = user?.createdAt ? new Date(user?.createdAt) : new Date();

    const formattedDate = createdAtDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let isUserBlocked = false;
    let isFollowing = false;
    let isFollowingSent = false;

    const { userId: currentUserId } = await auth();

    if (currentUserId) {
        const res = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: user?.id,
            },
        });
        res ? (isUserBlocked = true) : (isUserBlocked = false);

        const resfollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: user?.id,
            },
        });

        resfollow ? (isFollowing = true) : (isFollowing = false);

        const resfollowreq = await prisma.followRequest.findFirst({
            where: {
                senderId: currentUserId,
                receiverId: user?.id,
            },
        });

        resfollowreq ? (isFollowingSent = true) : (isFollowingSent = false);
    }

    return (
        <div>
            <div className="flex items-center justify-between text-[#111827] text-xl font-medium">
                <span>User Information</span>

                {currentUserId === user?.id ? (
                    <UpdateProfile user={user} />
                ) : (
                    <Link href="/" className="text-[#3b82f6] text-sm">
                        See all
                    </Link>
                )}
            </div>

            <div className="flex flex-col gap-2 text-[#4b5563]">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-lg ">
                        {user?.name && user?.surname
                            ? `${user?.name} ${user?.surname}`
                            : user?.username}
                    </span>

                    <span className="text-sm">
                        @{user?.username}
                    </span>
                </div>

                <div className="flex flex-col items-start gap-1 text-sm">
                    <span className="text-sm">
                        {user?.description}
                    </span>

                    <span className='flex items-center gap-1'>
                        <GrLocation /> Living {user?.city ? "in" : "on"} {user?.city ? user.city : "Earth"}
                    </span>

                    <span className='flex items-center gap-1'>
                        <MdDateRange /> Joined {formattedDate}
                    </span>
                </div>

                {currentUserId && currentUserId !== user?.id && (
                    <FollowUnfollow
                        userId={user?.id}
                        isUserBlocked={isUserBlocked}
                        isFollowing={isFollowing}
                        isFollowingSent={isFollowingSent}
                    />
                )}
            </div>
        </div>
    )
}
