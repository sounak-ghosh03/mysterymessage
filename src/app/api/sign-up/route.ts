import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { use } from "react";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiration = new Date(
                    Date.now() + 3600000
                );

                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiration: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                message: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully, Please check your email to verify your account",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log("Error registering user ", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}
