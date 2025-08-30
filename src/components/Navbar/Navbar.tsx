import React from 'react'
import Link from 'next/link'
import { FaHouseChimney } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Sidedrawer from './Sidedrawer';

export default function Navbar() {
    return (
        <div className="h-20 flex items-center justify-between text-[#000000]">
            <Link href="/" className="font-bold text-2xl">
                Blethershot
            </Link>

            <div className="w-[50%] hidden md:flex text-md items-center justify-between">
                <div className="flex gap-4 items-center">
                    <Link href="/" className="flex items-center justify-start gap-1">
                        <FaHouseChimney />
                        <span>Home</span>
                    </Link>
                </div>
            </div>

            <div className="w-[30%] flex items-center gap-4 xl:gap-6 justify-end">
                <ClerkLoading>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#FFFFFF] border-solid border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
                </ClerkLoading>

                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <SignInButton>
                        <div className="flex items-center justify-start gap-1 cursor-pointer">
                            <MdAccountCircle className="text-2xl " />
                            <span>Login/Register</span>
                        </div>
                    </SignInButton>
                </SignedOut>
            </div>

            <Sidedrawer />
        </div>
    )
}
