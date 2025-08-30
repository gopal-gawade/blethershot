import React from 'react'
import prisma from '../../lib/client'
import CommentList from './CommentList';

export default async function Comment({ postId }: {
    postId: number
}) {
    const comments = await prisma.comment.findMany({
        where: {
            postId,
        },
        include: {
            user: true
        }
    })

    return (
        <div>
            <CommentList
                comments={comments}
                postId={postId}
            />
        </div>
    )
}
