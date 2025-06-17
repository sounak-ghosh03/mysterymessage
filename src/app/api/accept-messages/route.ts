import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (updatedUser) {
            return Response.json(
                {
                    success: true,
                    message: "User status updated successfully",
                    updatedUser,
                },
                { status: 200 }
            );
        } else {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.log("failed to update user status to accept messages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }
    try {
        const userId = user._id;
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "User found",
                isAcceptingMessages: foundUser.isAcceptingMessages,
                foundUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("failed to update user status to accept messages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            { status: 500 }
        );
    }
}
