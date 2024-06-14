"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { memo, useEffect, useState } from "react";

type ItemType = {
  id: string;
  title: string;
};

function Item(props: ItemType) {
  console.log("props", props);
  useEffect(() => {
    console.log("mounted item:", props.id);
    return () => {
      console.log("UNmounted item:", props.id);
    };
  }, []);

  return (
    <div>
      <h1 title={props.id}>{props.title}</h1>
    </div>
  );
}

const MemoizedItem = memo(Item);

export const IdentityChangeTest = memo(function IdentityChangeTest() {
  const [items, setItems] = useState<ItemType[]>([
    {
      id: "1",
      title: "Item 1",
    },
    {
      id: "2",
      title: "Item 2",
    },
    {
      id: "3",
      title: "Item 3",
    },
  ]);

  // @ts-ignore
  window.TEST___setItems = setItems;

  return (
    <div>
      {items.map((item) => (
        <MemoizedItem key={item.id} {...item} />
      ))}
    </div>
  );
});
