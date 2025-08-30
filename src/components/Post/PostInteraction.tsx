"use client";

import { useOptimistic, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { deletePost, likePost } from "../../lib/action";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";

const PostInteraction = ({
    userid,
    postId,
    likes,
    commentNumber,
}: {
    userid: any;
    postId: number;
    likes: string[];
    commentNumber: number;
}) => {
    const { isLoaded, userId } = useAuth();
    const [likeState, setLikeState] = useState({ likeCount: likes.length, isLiked: userId ? likes.includes(userId) : false });

    const [optimistic, setOptimistic] = useOptimistic(
        likeState,
        (state) => {
            return {
                likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
                isLiked: !state.isLiked,
            };
        }
    );

    const likeAction = async () => {
        setOptimistic("");
        try {
            likePost(postId);
            setLikeState((state) => ({
                likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
                isLiked: !state.isLiked,
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAction = async () => {
        try {
            await deletePost(postId);
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex items-center justify-between text-sm gap-2 mb-1">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 font-medium p-1.5 rounded-xl">
                    <form
                        action={likeAction}
                        className="flex items-center"
                    >
                        <button>
                            <Image
                                src={"/red-heart-icon.png"}
                                width={16}
                                height={16}
                                alt=""
                                className="cursor-pointer transform transition duration-250 hover:scale-125"
                            />
                        </button>
                    </form>

                    <span className="text-gray-300">|</span>

                    <span className="text-[#111827]">
                        {optimistic.likeCount}
                        <span className="hidden md:inline">{" "}{optimistic.likeCount > 1 ? "Likes" : "Like"}</span>
                    </span>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 font-medium p-1.5 rounded-xl">
                    <Image
                        src="/instagram-comment-icon.png"
                        width={16}
                        height={16}
                        alt=""
                        className="cursor-pointer"
                    />
                    <span className="text-gray-300">|</span>

                    <span className="text-[#111827]">
                        {commentNumber}<span className="hidden md:inline">{" "}{commentNumber > 1 ? "Comments" : "Comment"}</span>
                    </span>
                </div>
            </div>


            {userId === userid ?
                <MdDeleteOutline
                    className='text-lg text-red-500 cursor-pointer'
                    onClick={deleteAction}
                /> :
                null
            }
        </div>
    );
};

export default PostInteraction;
