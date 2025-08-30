"use client";

import React, { useOptimistic, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Comment, User } from '@prisma/client';
import { addComment, deleteComment } from '../../lib/action'
import Image from 'next/image';
import { MdDeleteOutline } from "react-icons/md";

type CommentWithUser = Comment & { user: User };

export default function CommentList({
    comments,
    postId,
}: {
    comments: CommentWithUser[];
    postId: number;
}) {
    const { user } = useUser();
    const [comment, setComment] = useState(comments);
    const [desc, setDesc] = useState("");
    const [show, setShow] = useState(false);

    const add = async () => {
        if (!user || !desc) return;

        setOptimistic({
            id: Math.random(),
            desc,
            createdAt: new Date(Date.now()),
            userId: user.id,
            postId: postId,
            user: {
                id: user.id,
                username: "Sending...",
                avatar: user.imageUrl || "/account-grey-icon.png",
                cover: "",
                description: "",
                name: "",
                surname: "",
                city: "",
                createdAt: new Date(Date.now()),
            },
        });
        try {
            const createdComment = await addComment(postId, desc);
            setComment((prev) => [createdComment, ...prev]);
        } catch (err) {
            console.log(err)
        }
    };

    const deleteCmmt = async (commentId?: number, postId?: number) => {
        if (!user) return;
        try {
            await deleteComment(commentId, postId);
            setComment(comments);
        } catch (err) {
            console.log(err)
        }
    };

    const [optimistic, setOptimistic] = useOptimistic(comment, (state, value: CommentWithUser) => [value, ...state]);

    return (
        <div className='text-[#4b5563]'>
            {user && (
                <div className="flex items-center gap-2">
                    <Image
                        src={user.imageUrl || "account-grey-icon.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                    />
                    <form
                        action={add}
                        className="w-full p-1.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
                    >
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="bg-transparent outline-none flex-1 text-sm"
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </form>
                </div>
            )}

            <div className="flex justify-end">
                <p
                    className='text-xs cursor-pointer mt-1.5'
                    onClick={() => setShow(!show)}
                >
                    {optimistic?.length === 0 ?
                        null :
                        <span>{show && postId ? optimistic?.length === 1 ? "Hide comment" : "Hide comments" : optimistic?.length === 1 ? "Show comment" : "Show comments"}</span>
                    }
                </p>
            </div>

            {show && postId ?
                <div className="">
                    {optimistic.map((comment) => (
                        <div className="flex gap-4 justify-between mt-2" key={comment.id}>
                            <Image
                                src={comment.user.avatar || "account-grey-icon.png"}
                                alt=""
                                width={12}
                                height={12}
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="flex flex-col gap-1 flex-1">
                                <span className="font-medium">
                                    {comment.user.name && comment.user.surname
                                        ? comment.user.name + " " + comment.user.surname
                                        : comment.user.username}
                                </span>

                                <div className='flex justify-between items-center'>
                                    <p>{comment.desc}</p>

                                    {comment.user.id === user?.id ?
                                        <MdDeleteOutline
                                            className='text-md text-red-500 cursor-pointer'
                                            onClick={() => deleteCmmt(comment?.id, postId)}
                                        /> :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div> :
                null
            }
        </div>
    )
}
