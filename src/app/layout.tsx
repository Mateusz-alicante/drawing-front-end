"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "./layout.module.css";
import { userAtom } from "../utils/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import Background from "../Components/Background/Background";
import { useEffect } from "react";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: any;
}) {
  const router = useRouter();
  const [user, setUser]: any = useAtom(userAtom);
  return (
    <html lang="en">
      <Head>
        <title>BlueDraw</title>
        <meta property="og:title" content="BlueDraw" key="title" />
      </Head>
      <body className={inter.className}>
        <div
          className="min-h-screen"
          style={{ backgroundColor: "rgb(35, 35, 35)" }}
        >
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Link href="/" className={styles.headerHref}>
                HOME
              </Link>
            </div>
            {user?.username ? (
              <div className={styles.headerRight}>
                <Link href="/play" className={styles.headerHref}>
                  PLAYGROUND
                </Link>
                <Link href="/posts" className={styles.headerHref}>
                  POSTS
                </Link>
                <Link href="/people" className={styles.headerHref}>
                  PROFILE
                </Link>
                <Link
                  href="/loggedout"
                  className={styles.headerHref}
                  onClick={() => {
                    setUser({});
                  }}
                >
                  LOG OUT
                </Link>
              </div>
            ) : (
              <div className={styles.headerRight}>
                <Link href="/play" className={styles.headerHref}>
                  PLAYGROUND
                </Link>
                <Link href="/signup" className={styles.headerHref}>
                  SIGNUP
                </Link>
                <Link href="/login" className={styles.headerHref}>
                  LOGIN
                </Link>
              </div>
            )}
          </div>
          {children}
          <Background />
        </div>
      </body>
    </html>
  );
}
