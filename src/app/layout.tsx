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
      <body className={inter.className}>
        <div className="bg-gray-800 min-h-screen">
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Link href="/" className={styles.headerHref}>
                HOME
              </Link>
            </div>
            {user.username ? (
              <div className={styles.headerRight}>
                <Link href="/play" className={styles.headerHref}>
                  PLAYGROUND
                </Link>
                <Link href="/posts" className={styles.headerHref}>
                  POSTS
                </Link>
                <Link href="/people" className={styles.headerHref}>
                  PEOPLE
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
