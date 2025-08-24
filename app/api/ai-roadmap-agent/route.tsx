import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { roadmapId, userInput } = await req.json();
    const user = await currentUser();

    // Send the event to Inngest
    const result = await inngest.send({
  name: "AiRoadmapAgent",
  data: { 
    userInput:userInput,
    roadmapId: roadmapId,
    userEmail: user?.primaryEmailAddress?.emailAddress
  }
});

    // Get the runId
    const runId: string | undefined = (result as any).id || (result as any).ids?.[0];
    if (!runId) {
      return NextResponse.json(
        { error: "Failed to get runId from Inngest" },
        { status: 500 }
      );
    }

    // Poll for completion
    const aiResponse = await pollForResult(runId);

    // Return AI response
    return NextResponse.json({ aiResponse });

  } catch (error: any) {
    console.error("POST /ai-chat error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Poll Inngest run until completion
async function pollForResult(runId: string): Promise<string> {
  const MAX_ATTEMPTS = 30;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    try {
      const runStatus = await getRunStatus(runId);

      // Check if completed
      if (runStatus?.data?.[0]?.status === "Completed") {
        // Extract AI response from output
        const output = runStatus.data[0].output?.output?.[0]?.content;
        return output || "I couldn't process that request";
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;

    } catch (error) {
      console.error("Polling error:", error);
      return "Error checking response status";
    }
  }

  return "Request timed out";
}

// Fetch run status from Inngest
async function getRunStatus(runId: string) {
  try {
    const response = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        },
      }
    );

    return response.data;

  } catch (error: any) {
    console.error("getRunStatus error:", error.response?.data || error.message);
    throw error;
  }
}