import type { APIRoute } from 'astro';
import { submitComment } from '../../services/wordpress';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check Content-Type
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Invalid Content-Type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parse the JSON payload
    const body = await request.json();
    const { postId, author, email, content } = body;

    // Validate inputs
    if (!postId || !author || !email || !content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Submit to WordPress via GraphQL
    const result = await submitComment(Number(postId), author, email, content);

    if (result && result.success) {
      return new Response(JSON.stringify({ success: true, message: "Comment submitted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ error: "Failed to submit comment to WordPress" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (error: any) {
    console.error("Comment API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
