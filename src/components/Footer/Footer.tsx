"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import style from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname(); // 現在のパスを取得
  const router = useRouter();
  return (
    <footer>
      {pathname !== "/" && pathname !== "/pokemon" && (
        <button
          className={style.footerButton}
          onClick={() => router.push("/pokemon")}
        >
          一覧ページへ
        </button>
      )}
    </footer>
  );
}
