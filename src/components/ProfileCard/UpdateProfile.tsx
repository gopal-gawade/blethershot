"use client"
import { updateProfile } from '../../lib/action';
import { User } from '@prisma/client'
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom';
import { MdOutlineCancel } from "react-icons/md";

export default function UpdateProfile({ user }: {
    user: User
}) {
    const [open, setOpen] = useState(false);
    const [cover, setCover] = useState<any>(false);

    const [state, formAction] = useActionState(updateProfile, { success: false, error: false });

    const router = useRouter();

    const handleClose = () => {
        setOpen(false);
        state.success && router.refresh()
    };

    const { pending } = useFormStatus();

    return (
        <div>
            <span
                className="text-[#3b82f6] text-sm cursor-pointer"
                onClick={() => setOpen(true)}
            >
                Update
            </span>
            {open && (
                <div className="absolute w-full h-full top-0 left-0 p-4 bg-white/70 flex items-center justify-center z-50 text-[#111827]">
                    <form
                        action={(formData) => formAction({ formData, cover: cover?.secure_url || "" })}
                        className="p-12 bg-[#FFFFFF] rounded-3xl shadow-xl hover:shadow-2xl flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative"
                    >
                        <h1 className='text-2xl'>
                            Update Profile
                        </h1>

                        <div className="mt-2 text-sm">
                            Use the navbar profile to change the avatar or username.
                        </div>

                        <CldUploadWidget
                            uploadPreset="ggsocial"
                            onSuccess={(result) => setCover(result.info)}
                        >
                            {({ open }) => {
                                return (
                                    <div
                                        className="flex flex-col gap-2 my-2"
                                        onClick={() => open()}
                                    >
                                        <label htmlFor="">
                                            Cover Picture
                                        </label>

                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <Image
                                                src={user.cover || "/person-silhouette-white-icon.png"}
                                                alt=""
                                                width={60}
                                                height={60}
                                                className="w-12 h-12 rounded-full object-cover bg-purple-600"
                                            />
                                            <span className="text-md underline">
                                                Change
                                            </span>
                                        </div>
                                    </div>
                                );
                            }}
                        </CldUploadWidget>


                        <div className="flex flex-col w-full sm:flex-row justify-between gap-2">
                            <div className="flex flex-col gap-2 text-sm sm:w-1/2">
                                <label htmlFor="" className="text-md">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    placeholder={user.name || "John"}
                                    className="w-full p-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
                                    name="name"
                                />
                            </div>

                            <div className="flex flex-col gap-2 text-sm sm:w-1/2">
                                <label htmlFor="" className="text-md">
                                    Surname
                                </label>

                                <input
                                    type="text"
                                    placeholder={user.surname || "Doe"}
                                    className="w-full p-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
                                    name="surname"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full sm:flex-row justify-between gap-2">
                            <div className="flex flex-col gap-2 text-sm sm:w-1/2">
                                <label htmlFor="" className="text-md">
                                    Description
                                </label>

                                <input
                                    type="text"
                                    placeholder={user.description || "Available"}
                                    className="w-full p-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
                                    name="description"
                                />
                            </div>

                            <div className="flex flex-col gap-2 text-sm sm:w-1/2">
                                <label htmlFor="" className="text-md">
                                    City
                                </label>

                                <input
                                    type="text"
                                    placeholder={user.city || "Mumbai"}
                                    className=" p-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
                                    name="city"
                                />
                            </div>
                        </div>

                        <button
                            className="cursor-pointer p-2 mt-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow hover:opacity-90 transition disabled:cursor-not-allowed"
                            disabled={pending}
                        >
                            {pending ? "Updating..." : "Update"}
                        </button>

                        {state.success && (
                            <span className="text-green-500">Profile has been updated!</span>
                        )}
                        {state.error && (
                            <span className="text-red-500">Something went wrong!</span>
                        )}
                        <MdOutlineCancel
                            className="absolute text-lg right-2 top-3 cursor-pointer"
                            onClick={handleClose}
                        />
                    </form>
                </div>
            )}
        </div>
    )
}
