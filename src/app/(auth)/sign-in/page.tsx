"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";

export default function SignInForm() {
    const router = useRouter();
    // const searchParams = useSearchParams();
    // const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            callbackUrl: "/dashboard",
            identifier: data.identifier,
            password: data.password,
        });
        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                toast("Login Failed", {
                    description: "Incorrect email or password",
                });
            } else {
                toast("Login Failed", {
                    description: result.error,
                });
            }
        }
        if (result?.url) {
            router.replace("/dashboard");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome to Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign in to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <Input
                                        placeholder="email or username"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        placeholder="password"
                                        type="password"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{" "}
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
