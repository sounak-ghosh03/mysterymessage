"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User;

    return (
        <nav>
            <div>
                <a href="#">Mystery Message </a>
                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome, {user?.username || user?.email}
                        </span>
                        <Button
                            className="w-full md:w-auto"
                            onClick={() => signOut()}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href={"/sign-in"}>
                        <Button>Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
