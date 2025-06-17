import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

// Gemini doesn't support streaming in edge runtime natively,
// so we will return plain text for now.
export async function POST(req: Request) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: "What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?". Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return new NextResponse(text, {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    } catch (error: any) {
        console.error("Gemini API Error:", error);

        return NextResponse.json(
            {
                name: error?.name || "UnknownError",
                message: error?.message || "An error occurred.",
            },
            { status: 500 }
        );
    }
}









//OPENAI DOES NOT PROVIDE FREE API KEY

// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//     try {
//         // Ask OpenAI for a streaming chat completion
//         const prompt =
//             "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//         // Call the OpenAI model
//         const response = await openai.completions.create({
//             model: "gpt-3.5-turbo-instruct",
//             max_tokens: 400,
//             stream: true,
//             prompt,
//         });

//         // Convert the response into a friendly text-stream
//         const stream = OpenAIStream(response);

//         // Respond with the stream
//         return new StreamingTextResponse(stream);
//     } catch (error) {
//         if (error instanceof OpenAI.APIError) {
//             // OpenAI API error handling
//             const { name, status, headers, message } = error;
//             return NextResponse.json(
//                 { name, status, headers, message },
//                 { status }
//             );
//         } else {
//             // General error handling
//             console.error("An unexpected error occurred:", error);
//             throw error;
//         }
//     }
// }
