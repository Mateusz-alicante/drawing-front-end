"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { useAtom } from "jotai";
import { savedDrawingAtom } from "../utils/atoms";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const router = useRouter();

  const [drawing, setDrawing] = useAtom(savedDrawingAtom);
  return (
    <main className={inter.className}>
      <div className={styles.home}></div>
      <div className={styles.titleCard}>
        <div className={styles.title}>BLUEDRAW</div>
        <div onClick={() => router.push("/play")} className={styles.tryPlay}>
          PLAYGROUND
        </div>
      </div>
    </main>
  );
}
