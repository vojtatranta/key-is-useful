"use client";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { Post, PostForm } from "./post-form";
import { useState } from "react";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { IdentityChangeTest } from "./identity-change-test";

export function CrudShowcase({ posts }: { posts: Post[] }) {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const selectedPost =
    selectedPostId !== null
      ? posts.find((post) => post.id === selectedPostId)
      : null;
  const router = useRouter();
  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
      setSelectedPostId(null);
    },
  });
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handlePostSubmit = async (name: string) => {
    if (!selectedPostId) {
      await createPost.mutateAsync({ name });
      return;
    }

    updatePost.mutate({ name, id: selectedPostId });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="min-h-[185px] max-w-xs">
        <PostForm
          // NOTE: random key here is not ideal at all, this component should be wrapped to prevent needles resetting of the state
          key={selectedPost?.id ?? `new-post-${String(Math.random() * 100000)}`}
          pending={createPost.isPending || updatePost.isPending}
          selectedPost={selectedPost ?? null}
          onSubmit={handlePostSubmit}
          onNewPostFormRequest={() => setSelectedPostId(null)}
        />
      </div>

      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-200 md:rounded-lg dark:border-gray-700">
            <table className="dark:divide-gray-70 min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                  >
                    Created at
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                  >
                    Updated at
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {post.id}
                    </td>
                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {post.name}
                    </td>
                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {String(post.createdAt?.toUTCString() ?? "n/a")}
                    </td>
                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      {String(post.updatedAt?.toUTCString() ?? "n/a")}
                    </td>
                    <td className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      <div className="flex items-center gap-x-6">
                        <button
                          onClick={() => {
                            setSelectedPostId(post.id);
                          }}
                          className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
