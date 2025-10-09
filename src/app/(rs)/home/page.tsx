import { Metadata } from "next";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div>
      <div>Home page</div>
    </div>
  );
}
