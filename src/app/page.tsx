"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { savedDrawingAtom } from "../utils/atoms";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import axios from "axios";

const inter = Inter({ subsets: ["latin"], weight: "700" });

export default function Home() {
  const router = useRouter();

  const testRequest = async () => {
    const response = await axios.get("/api/test");
    console.log(response);
  };

  useEffect(() => {
    testRequest();
  }, []);

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
