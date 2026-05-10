"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [book, setBook] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) router.push("/auth/signin");
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null; // Will redirect
  }

  async function handleGenerate() {
    if (!book) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Call OpenAI API
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book }),
      });

      if (!res.ok) throw new Error("Failed to generate summary");

      const data = await res.json();
      setResult(data);

      // Automatically save to MongoDB
      await saveSummary(data);
    } catch (err: any) {
      setError(err.message || "Error generating summary");
    }

    setLoading(false);
  }

  async function saveSummary(data: any) {
    try {
      await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          summary: data.summary,
          recommendations: data.recommendations,
          userEmail: email || "anonymous",
        }),
      });
    } catch (err) {
      console.error("Error saving to MongoDB:", err);
    }
  }

  async function handleSendEmail() {
    if (!result || !email) {
      setError("Please generate a summary and enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          bookTitle: result.title,
          summary: result.summary,
          recommendations: result.recommendations,
        }),
      });

      if (!res.ok) throw new Error("Failed to send email");

      alert("✅ Email sent successfully!");
      setShowEmailForm(false);
    } catch (err: any) {
      setError(err.message || "Error sending email");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-6 shadow-lg relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📚</span>
            <h1 className="text-4xl font-bold">BookBrief AI</h1>
          </div>
          <p className="text-blue-100 text-lg">Get intelligent summaries and personalized book recommendations</p>
        </div>
        <button
          onClick={() => signOut()}
          className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Sign Out
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">
            ❌ {error}
          </div>
        )}

        {/* INPUT SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Enter a Book Title
          </label>
          <div className="flex gap-3 mb-4">
            <input
              className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900"
              placeholder="e.g., The Great Gatsby, Dune, 1984..."
              value={book}
              onChange={(e) => setBook(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !book}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>

          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email (optional - to receive summaries)
            </label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* RESULT SECTION */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* BOOK CARD */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-6">
                <h2 className="text-3xl font-bold text-white">{result.title}</h2>
              </div>
              
              {/* SUMMARY */}
              <div className="p-8">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">✨</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">Summary</h3>
                    <p className="text-gray-600 leading-relaxed">{result.summary}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RECOMMENDATIONS */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-2xl font-bold text-gray-800">Recommended Reading</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.recommendations.map((r: string, i: number) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-md hover:border-blue-400 transition cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {i === 0 ? "⭐" : i === 1 ? "🌟" : "✨"}
                        </span>
                        <p className="text-gray-700 font-medium">{r}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMAIL FORM */}
            {!showEmailForm && (
              <div className="flex gap-4 justify-center pb-8">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition"
                >
                  Search Another
                </button>
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center gap-2"
                >
                  📧 Send to Email
                </button>
                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                  💾 Saved
                </button>
              </div>
            )}

            {/* SEND EMAIL CONFIRMATION */}
            {showEmailForm && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4">📧 Send Summary to Email</h3>
                <p className="text-gray-600 mb-4">Email address: <span className="font-semibold">{email || "Not provided"}</span></p>
                <div className="flex gap-4">
                  <button
                    onClick={handleSendEmail}
                    disabled={!email || loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition"
                  >
                    {loading ? "Sending..." : "Send Email"}
                  </button>
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {!result && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Enter a book title to get started →</p>
          </div>
        )}
      </div>
    </div>
  );
}