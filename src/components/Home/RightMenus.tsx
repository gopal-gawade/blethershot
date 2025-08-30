import React from 'react'
import { User } from '@prisma/client';
import ProfileInfo from '../ProfileCard/ProfileInfo';
import ProfileMedia from '../ProfileCard/ProfileMedia';
import AdOrInstructions from '../AdOrInstructions';
import FriendRequests from '../ProfileCard/Follow/FriendRequests';

export default async function RightMenus({ user }: {
    user?: User
}) {

    return (
        <div>
            {user ?
                <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-4 mb-4">
                    <ProfileInfo user={user} />
                </div> :
                null
            }

            {user ?
                <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-4 mb-4">
                    <ProfileMedia user={user} />
                </div> :
                null
            }

            <AdOrInstructions />
            <FriendRequests />
        </div>
    )
}
