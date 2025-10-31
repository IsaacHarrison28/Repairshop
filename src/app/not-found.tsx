import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "This page could not be found.",
};

export default function NotFound() {
  return (
    <div className="px-2 w-full">
      <div className="mx-auto flex flex-col items-center justify-center gap-4 mt-20">
        <h2 className="text-2xl">Page Not Found!</h2>
        <Image
          src={"/images/not-found-1024x1024.png"}
          className="m-0 rounded-xl"
          alt="404 - Page Not Found"
          width={300}
          height={300}
          sizes="300px"
          priority={true}
          title="Page Not Found"
        />
      </div>
      <Link className="text-center hover:underline " href="/tickets">
        <h3>Go Home</h3>
      </Link>
    </div>
  );
}
