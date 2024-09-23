"use client";
import React from "react";
import style from "./Container.module.css";

export default function Container({ children }: { children: React.ReactNode }) {
  return <div className={style.wrapper}>{children}</div>;
}
