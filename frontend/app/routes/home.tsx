import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">Welcome to FastShip</h1>
      <p className="mt-3 text-2xl mb-4">Start your journey with us right now!</p>
      <Button className="mt-5" asChild>
        <Link to="/seller/login">Seller Login</Link>
      </Button>
      <Button className="mt-5" asChild>
        <Link to="/partner/login">Delivery Partner Login</Link>
      </Button>
    </div>
  )
}
