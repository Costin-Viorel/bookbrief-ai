import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { email, bookTitle, summary, recommendations } = await req.json();

    if (!email || !bookTitle || !summary) {
      return NextResponse.json(
        { error: "Email, book title, and summary are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const recommendationsHTML = (recommendations || [])
      .map((book: string) => `<li style="margin: 8px 0;">${book}</li>`)
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px;">📚 BookBrief AI</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Your Book Summary</p>
        </div>

        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">${bookTitle}</h2>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin: 0 0 12px 0;">Summary</h3>
            <p style="color: #4b5563; margin: 0; line-height: 1.6;">${summary}</p>
          </div>

          ${
            recommendationsHTML
              ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 12px 0;">📖 Similar Books You Might Enjoy</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${recommendationsHTML}
              </ul>
            </div>
          `
              : ""
          }

          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}" style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Explore More Books
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
          <p>© 2026 BookBrief AI. All rights reserved.</p>
        </div>
      </div>
    `;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@bookbrief.ai",
      subject: `📚 BookBrief: Summary of "${bookTitle}"`,
      html: htmlContent,
    };

    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${email}`,
    });
  } catch (error: any) {
    console.error("SendGrid Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
