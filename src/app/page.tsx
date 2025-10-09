import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black bg-[url(/images/home-img.jpg)] bg-cover bg-center min-h-screen">
      <main className="flex flex-col max-w-5xl mx-auto justify-center h-screen text-center">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 w-4/5 sm:max-w-96 mx-auto text-white sm:text-2xl animate-appear">
          <h1 className="text-4xl font-bold">Dan&apos;s computer repair shop</h1>
          <address>
            555 Gateway Lane <br />
            Kansas City, KS 555555
          </address>
          <p>
            Open daily: 9 am to 5 pm
          </p>
          <Link href="tel:555555555" className="hover:underline">5555-555555</Link>
        </div>
      </main>
    </div>
  );
}