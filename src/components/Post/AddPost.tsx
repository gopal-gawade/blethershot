"use client";

import React, { useState } from "react";
import { addPost } from "../../lib/action";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";

export default function AddPost() {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded) return <h1>Loading...</h1>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("desc", desc);

    try {
      await addPost(formData, img?.secure_url || "");
      setDesc("");
      setImg(null);
      router.replace("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 gap-2">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <Image
            src={user?.imageUrl || "/account-grey-icon.png"}
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-full"
          />

          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400/40 outline-none transition"
              name="desc"
              value={desc} // controlled value
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-between gap-4 mt-4 text-[#111827] flex-wrap">
          <CldUploadWidget
            uploadPreset="ggsocial"
            onSuccess={(result) => setImg(result.info)}
          >
            {({ open }) => (
              <button
                className="cursor-pointer p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition flex items-center gap-2"
                onClick={() => open()}
              >
                <Image
                  src="/cloud-data-upload-icon.png"
                  alt=""
                  width={30}
                  height={30}
                />

                <span>Photo</span>
              </button>
            )}
          </CldUploadWidget>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow hover:opacity-90 transition"
          >
            {loading ? "Sending" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
