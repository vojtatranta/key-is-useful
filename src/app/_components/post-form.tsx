"use client";

import { inferProcedureOutput } from "@trpc/server";
import { useEffect, useState } from "react";
import { AppRouter } from "~/server/api/root";
import classNames from "classnames";

type TruthyPart<T> = T extends undefined ? never : T;
export type Post = TruthyPart<
  inferProcedureOutput<AppRouter["post"]["getById"]>
>;

export function PostForm({
  pending,
  selectedPost,
  onNewPostFormRequest,
  onSubmit,
}: {
  pending?: boolean;
  selectedPost: Post | null;
  onNewPostFormRequest?: () => void;
  onSubmit?: (nextName: string) => void;
}) {
  const [name, setName] = useState(selectedPost?.name ?? "");

  function getSubmitButtonLabel() {
    if (selectedPost) {
      return "Update";
    }

    return "Add";
  }

  return (
    <form
      onSubmit={(e) => {
        if (!name) {
          return;
        }
        e.preventDefault();
        onSubmit?.(name);
      }}
      className="flex flex-col gap-2"
    >
      <p
        className={classNames({
          visible: Boolean(selectedPost),
          invisible: !selectedPost,
        })}
      >
        You are editing post <strong>{selectedPost?.id ?? ""}</strong>
      </p>
      <input
        type="text"
        placeholder="Title"
        disabled={pending}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={Boolean(pending) || Boolean(!name)}
      >
        {pending ? "..." : getSubmitButtonLabel()}
      </button>
      {selectedPost && (
        <button
          className="w-xxs rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={Boolean(pending) || Boolean(!name)}
          onClick={onNewPostFormRequest}
        >
          Reset
        </button>
      )}
    </form>
  );
}
