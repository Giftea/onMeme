"use client";
import Image from "next/image";
export default function Avatar({
  size,
  url,
}: {
  size?: number;
  userAddress: string;
  url?: string | null;
}) {

  const avatar = url
    ? url
    : "https://tan-usual-nightingale-869.mypinata.cloud/ipfs/bafkreifqh73xq3z7dnt4yprvh7onwzz4xpm6zqy3w5ze3u4ccqngzpy2j4";

  return (
    <Image
      width={size || 100}
      height={size || 100}
      src={avatar}
      alt="Avatar"
      className="border border-secondary bg-muted-foreground p-1 rounded-full"
    />
  );
}
