import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { book } = await req.json();

    if (!book || book.trim() === "") {
      return NextResponse.json(
        { error: "Book title is required" },
        { status: 400 }
      );
    }

    // Generate summary using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a concise summary (150-200 words) for the book "${book}". Also suggest 3 similar books. 
          
          Format your response as JSON:
          {
            "summary": "...",
            "recommendations": ["Book 1", "Book 2", "Book 3"]
          }`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0].message.content;
    let result;

    try {
      result = JSON.parse(content || "{}");
    } catch {
      result = {
        summary: content,
        recommendations: [],
      };
    }

    return NextResponse.json({
      title: book,
      summary: result.summary,
      recommendations: result.recommendations || [],
    });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
