import React from 'react'
import ProfileCard from '../ProfileCard/ProfileCard'
import Announcement from '../Announcement'

export default function LeftMenus({ type }: {
    type: "home" | "profile"
}) {
    return (
        <div className='flex flex-col gap-4'>
            {type === "home" || "profile" ?
                <ProfileCard type={type} /> :
                null
            }

            <Announcement />
        </div>
    )
}
