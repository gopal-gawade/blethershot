"use client";

import { acceptFollowRequest, declineFollowRequest } from "../../../lib/action";
import { useAuth } from "@clerk/nextjs";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useState } from "react";

type RequestWithUser = FollowRequest & {
    sender: User;
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
    const [requestState, setRequestState] = useState(requests);
    const { isLoaded, userId } = useAuth();

    const accept = async (requestId: number, userId: string) => {
        removeOptimisticRequest(requestId);
        try {
            await acceptFollowRequest(userId);
            setRequestState((prev) => prev.filter((req) => req.id !== requestId));
        } catch (err) { }
    };
    const decline = async (requestId: number, userId: string) => {
        removeOptimisticRequest(requestId);
        try {
            await declineFollowRequest(userId);
            setRequestState((prev) => prev.filter((req) => req.id !== requestId));
        } catch (err) { }
    };

    const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
        requestState,
        (state, value: number) => state.filter((req) => req.id !== value)
    );
    return (
        <div className="text-[#111827]">
            {optimisticRequests.filter((rq) => rq.senderId !== userId).map((request) => (
                <div className="flex items-center justify-between" key={request.id}>
                    <Link href={`/profile/${request.sender.username}`}>
                        <div className="flex items-center gap-4">
                            <Image
                                src={request.sender.avatar || "account-grey-icon"}
                                alt=""
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-md">
                                {request.sender.name && request.sender.surname
                                    ? request.sender.name + " " + request.sender.surname
                                    : request.sender.username}
                            </span>
                        </div>
                    </Link>

                    <div className="flex gap-3 justify-end">
                        <form action={() => accept(request.id, request.sender.id)}>
                            <button>
                                <Image
                                    src="/done-icon.png"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="cursor-pointer"
                                />
                            </button>
                        </form>

                        <form action={() => decline(request.id, request.sender.id)}>
                            <button>
                                <Image
                                    src="/close-round-line-icon.png"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="cursor-pointer"
                                />
                            </button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FriendRequestList;
