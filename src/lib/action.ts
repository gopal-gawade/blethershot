"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const followFunc = async (userId: any) => {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
        throw new Error("Unauthenticated!");
    }

    try {
        const alreadyFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId
            }
        })

        if (alreadyFollow) {
            await prisma.follower.delete({
                where: {
                    id: alreadyFollow?.id
                }
            })
        }
        else {
            const alreadyFollowReq = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId,
                },
            })

            if (alreadyFollowReq) {
                await prisma.followRequest.delete({
                    where: {
                        id: alreadyFollowReq.id,
                    },
                });
            }
            else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId,
                    },
                })
            }
        }
    }
    catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
}

export const blockFunc = async (userId: any) => {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
        throw new Error("Unauthenticated!");
    }

    try {
        const alreadyBlock = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: userId,
            },
        });

        if (alreadyBlock) {
            await prisma.block.delete({
                where: {
                    id: alreadyBlock.id,
                },
            });
        } else {
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const acceptFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
        throw new Error("Unauthenticated!!");
    }

    try {
        const alreadyFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (alreadyFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: alreadyFollowRequest.id,
                },
            });

            await prisma.follower.create({
                data: {
                    followerId: userId,
                    followingId: currentUserId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const declineFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) {
        throw new Error("Unauthenticated!!");
    }

    try {
        const alreadyFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (alreadyFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: alreadyFollowRequest.id,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const updateProfile = async (
    prevState: {
        success: boolean;
        error: boolean
    },
    payload: {
        formData: FormData;
        cover: string
    }
) => {
    const { formData, cover } = payload;
    const fields = Object.fromEntries(formData);

    const filteredFields = Object.fromEntries(
        Object.entries(fields).filter(([_, value]) => value !== "")
    );

    const Profile = z.object({
        name: z.string().max(60).optional(),
        surname: z.string().max(60).optional(),
        cover: z.string().optional(),
        description: z.string().max(255).optional(),
        city: z.string().max(60).optional(),
    });

    const validatedFields = Profile.safeParse({ cover, ...filteredFields });

    if (!validatedFields.success) {
        return { success: false, error: true };
    }

    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: true };
    }

    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: validatedFields.data,
        });
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};

export const addPost = async (formData: FormData, img: string) => {
    const desc = formData.get("desc") as string;
    const Desc = z.string().min(1).max(255);
    const validatedDesc = Desc.safeParse(desc);

    if (!validatedDesc.success) {
        return;
    }
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated!");
    }

    try {
        await prisma.post.create({
            data: {
                desc: validatedDesc.data,
                userId,
                img,
            },
        });
        revalidatePath("/");
    } catch (err) {
        console.log(err);
    }
};

export const deletePost = async (postId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated!");
    }

    try {
        await prisma.post.delete({
            where: {
                id: postId,
                userId,
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
        throw new Error("Somrt")
    }
};

export const likePost = async (postId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated!");
    }

    try {
        const alreadyLike = await prisma.like.findFirst({
            where: {
                postId,
                userId,
            },
        });

        if (alreadyLike) {
            await prisma.like.delete({
                where: {
                    id: alreadyLike.id,
                },
            });
        } else {
            await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
    }
};

export const addComment = async (postId: number, desc: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated!");
    }

    try {
        const createdComment = await prisma.comment.create({
            data: {
                desc,
                userId,
                postId,
            },
            include: {
                user: true,
            },
        });

        return createdComment;
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const deleteComment = async (commentId: any, postId: any) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthenticated!");
    }

    try {
        await prisma.comment.delete({
            where: {
                userId,
                id: commentId,
                postId: postId
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
    }
}
