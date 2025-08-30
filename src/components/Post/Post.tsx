import React, { Suspense } from 'react'
import { Post as PostDetail, User } from '@prisma/client';
import Image from 'next/image';
import PostInteraction from './PostInteraction';
import Comment from '../Comment/Comment';

type postType = PostDetail &
{ user: User } &
{ likes: [{ userId: string }] } &
{ _count: { comments: number } };

export default function Post({ post }: {
    post: postType
}) {

    return (
        <div className='flex flex-col gap-2 p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 text-[#111827]'>
            <div className="flex items-center gap-2">
                <Image
                    src={post.user.avatar || "/account-grey-icon.png"}
                    width={20}
                    height={20}
                    alt=""
                    className="w-10 h-10 rounded-full"
                />
                <span className="text-md">
                    {post.user.name && post.user.surname
                        ? post.user.name + " " + post.user.surname
                        : post.user.username}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                {post.img && (
                    <div className="w-full min-h-96 relative">
                        <Image
                            src={post.img}
                            fill
                            className="object-cover rounded-md"
                            alt=""
                        />
                    </div>
                )}
                <p>{post.desc}</p>
            </div>

            <hr className="h-[0.5px] my-1 bg-[#e5e7eb] border-0" />

            <Suspense fallback="Loading...">
                <PostInteraction
                    userid={post.user.id}
                    postId={post.id}
                    likes={post.likes.map((like) => like.userId)}
                    commentNumber={post._count.comments}
                />
            </Suspense>

            <Suspense fallback="Loading...">
                <Comment postId={post.id} />
            </Suspense>

            <hr className="h-[0.5px] my-1 bg-[#e5e7eb] border-0" />
        </div>
    )
}
