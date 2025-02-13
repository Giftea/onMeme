"use client"
import { useEffect, useState } from "react";

export default function NFTList() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetch("/api/nfts")
      .then((res) => res.json())
      .then((data) => setNfts(data));
  }, []);
console.log(nfts)
  return (
    <div>
      <h2>NFTs</h2>
    
    </div>
  );
}
