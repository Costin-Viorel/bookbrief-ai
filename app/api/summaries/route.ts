import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { title, summary, recommendations, userEmail } = await req.json();

    if (!title || !summary) {
      return NextResponse.json(
        { error: "Title and summary are required" },
        { status: 400 }
      );
    }

    const summaries = await getCollection("summaries");

    const newDocument = {
      title,
      summary,
      recommendations: recommendations || [],
      userEmail: userEmail || "anonymous",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await summaries.insertOne(newDocument);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Summary saved successfully",
    });
  } catch (error: any) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { error: "Failed to save summary" },
      { status: 500 }
    );
  }
}

// GET all summaries (optional)
export async function GET(req: NextRequest) {
  try {
    const summaries = await getCollection("summaries");
    const data = await summaries.find({}).limit(50).toArray();

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error: any) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}
