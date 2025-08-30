import React from 'react';
import { auth } from '@clerk/nextjs/server';
import prisma from '../../lib/client';
import Post from './Post';
import { headers } from 'next/headers';

export default async function AllPost({ username }: { username?: string }) {
  const { userId } = await auth();
  const reqHeaders = await headers();
  const url = new URL(reqHeaders.get('referer') || 'http://localhost');
  const cursorParam = url.searchParams.get('cursor');

  let posts: any[] = [];
  const limit = 5;

  const cursor = cursorParam ? Number(cursorParam) : undefined;

  if (username) {
    posts = await prisma.post.findMany({
      where: { user: { username } },
      include: {
        user: true,
        likes: { select: { userId: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });
  }

  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map(f => f.followingId);
    const ids = [userId, ...followingIds];

    posts = await prisma.post.findMany({
      where: { userId: { in: ids } },
      include: {
        user: true,
        likes: { select: { userId: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });
  }

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return (
    <div className="text-md flex flex-col gap-4">
      {posts.length ?
        posts.map(post => <Post key={post.id} post={post} />) :
        <h1>No posts found!</h1>
      }

      {nextCursor && (
        <form method="get">
          <input
            type="hidden"
            name="cursor"
            value={nextCursor}
          />

          {username &&
            <input
              type="hidden"
              name="username"
              value={username}
            />
          }

          <button
            type="submit"
            className="cursor-pointer p-2 w-full rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition"
          >
            Load More
          </button>
        </form>
      )}
    </div>
  );
}
