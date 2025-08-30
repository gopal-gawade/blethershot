import React from 'react'
import { FaInfoCircle } from "react-icons/fa"

export default function Announcement() {
    return (
        <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between text-[#111827] text-xl font-medium">
                <span>Announcement</span>

                <FaInfoCircle className='text-[#3b82f6] text-lg' />
            </div>

            <p className='text-sm text-[#4b5563]'>
                Hello, this is an ongoing project built with Next.js, React, TypeScript, HTML, CSS,Tailwind CSS and Prisma.
                It's a learning project for me as I'm getting to grips with Next.js, and I'll finish it up soon.
            </p>
        </div>
    )
}
