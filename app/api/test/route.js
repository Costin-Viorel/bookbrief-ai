import { getCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const col = await getCollection("summaries");

    const data = await col.find({}).toArray();

    return Response.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { success: false, message: "DB error" },
      { status: 500 }
    );
  }
}