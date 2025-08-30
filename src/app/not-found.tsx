"use client";

import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className='h-[86vh] w-full flex flex-col items-center justify-center gap-4'>
            <h2 className='text-2xl font-bold'>
                PAGE NOT FOUND
            </h2>

            <h3>
                Sorry! we couldn't find the page you're looking for.
            </h3>

            <Link href={'/'}>
                <button className="cursor-pointer p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow hover:opacity-90 transition">
                    Go Back
                </button>
            </Link>
        </div>
    )
}

export default NotFound
