"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default () => {
  const router = useRouter();
  useEffect(() => {
    console.log("redirecting to play");
    router.push("/play");
  });
  return <div>This is the error page</div>;
};
