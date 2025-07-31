import Image from "next/image";
import db from "@/lib/db";
import { Button } from "@/components/ui/button";
export default async function Home() {
  const data =  await db.user.findFirst();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {JSON.stringify(data)}
      <Button className="bg-blue-500 text-white hover:bg-blue-600">
        Click Me
      </Button>
    </div>
  );
}
