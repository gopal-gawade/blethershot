import prisma from '../../lib/client'
import { User } from '@prisma/client'
import Image from "next/image";

export default async function ProfileMedia({ user }: {
    user?: User
}) {
    const postsWithMedia = await prisma.post.findMany({
        where: {
            userId: user?.id,
            img: {
                not: null,
            },
        },
        take: 8,
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <span className="text-[#111827] text-md">
                User Media
            </span>

            <div className="flex gap-2 justify-between flex-wrap mt-2 text-[#111827]">
                {postsWithMedia.length
                    ? postsWithMedia.filter((post) => post?.img !== "").map((post) => {
                        return (
                            <div className="relative w-1/5 h-12" key={post.id}>
                                <Image
                                    src={post.img!}
                                    alt=""
                                    fill
                                    className="object-cover rounded-md transform transition duration-250 hover:scale-105"
                                />
                            </div>
                        )
                    }) :
                    "No media found!"
                }
            </div>
        </div>
    )
}
