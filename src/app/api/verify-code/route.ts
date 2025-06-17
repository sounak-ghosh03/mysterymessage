import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = user.verifyCodeExpiration > new Date();
        if (isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully",
                },
                { status: 200 }
            );
        } else if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Verification code is incorrect or expired",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            { status: 500 }
        );
    }
}
