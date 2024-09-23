"use client";

import { usePathname } from "next/navigation";
import React from "react";
import style from "./Header.module.css";
import Link from "next/link";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

export default function Header() {
  const pathname = usePathname(); // 現在のパスを取得
  return (
    <header className={style.headerWrap}>
      <div className={style.headerInner}>
        <Link href="/" className={style.title}>
          <h1>
            <CatchingPokemonIcon />
            ポケモン図鑑
          </h1>
        </Link>
        <nav className={style.headerNav}>
          <ul>
            <li>
              <Link
                href="/"
                className={pathname === "/" ? style.activeLink : style.link}
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/pokemon"
                className={
                  pathname === "/pokemon" ? style.activeLink : style.link
                }
              >
                ポケモン一覧
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className={
                  pathname === "/search" ? style.activeLink : style.link
                }
              >
                ポケモン検索
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
