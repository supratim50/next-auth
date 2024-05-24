import {connect} from "@/dbConfig/dbConfig";
import User from '@/models/userModel';
import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, password} = reqBody;

        const user = await User.findOne({$or: [{username: username}, {email: username}]});

        if(!username) {
            return NextResponse.json({message: "User is not exist!"}, {status: 400})
        }

        const verifiedPassword = await bcryptjs.compare(password, user.password);

        if(!verifiedPassword) {
            return NextResponse.json({message: "Please check your username and password!"}, {status: 400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'});

        const response = NextResponse.json({
            message: "Logged In Success",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}