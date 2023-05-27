import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "./layout.module.css";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath: any;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Link href="/">HOME</Link>
            </div>
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
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
