import { Button } from "@/components/ui/button";
import {
  LoginLink
} from "@kinde-oss/kinde-auth-nextjs/components";


export default function Login() {
    return(
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Repair Shop</h1>
            <Button asChild>
            <LoginLink className="px-6 py-2 text-lg font-medium">Sign In</LoginLink>
            </Button>
        </main>
    )
}