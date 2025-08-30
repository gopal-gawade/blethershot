import Image from 'next/image'
import React from 'react'
import { FaInfoCircle } from "react-icons/fa"

export default function AdOrInstructions() {
    return (
        <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between text-[#111827] text-xl font-medium">
                <span>Advertisement</span>

                <FaInfoCircle className='text-[#3b82f6] text-lg' />
            </div>

            <div className="flex justify-center items-center mt-1 gap-2 rounded-lg overflow-hidden">
                <Image
                    src="/playing_video_games-wallpaper-960x540.jpg"
                    alt=""
                    width={320}
                    height={100}
                    className="rounded-lg object-cover origin-top-left transform transition duration-250 hover:scale-105"
                />
            </div>

            <p className='text-sm text-[#4b5563]'>
                Join the fun
            </p>
        </div>
    )
}
