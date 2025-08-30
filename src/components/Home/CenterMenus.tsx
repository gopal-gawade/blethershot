import React from "react";
import AddPost from "../Post/AddPost";
import AllPost from "../Post/AllPost";

export default function CenterMenus({
  searchParams,
}: {
  searchParams?: { cursor?: string };
}) {
  const hasCursor = Boolean(searchParams?.cursor);

  return (
    <div className="flex flex-col gap-4">
      {!hasCursor && <AddPost />}
      <AllPost />
    </div>
  );
}
