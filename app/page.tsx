import { getAddress } from "@/lib/chopin-server";

export default async function Home() {
  const address = await getAddress()
  
  return (
    <div>
{address}
    </div>
  );
}
