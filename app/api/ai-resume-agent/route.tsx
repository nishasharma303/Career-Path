import { NextRequest, NextResponse } from 'next/server';
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"; 
import { inngest } from '@/inngest/client';
import axios from 'axios';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile: File | null = formData.get('resumeFile') as unknown as File;
    const recordId = formData.get('recordId');
    const user = await currentUser();

    if (!resumeFile) {
      return NextResponse.json({ error: "No resume file uploaded" }, { status: 400 });
    }

    // Load PDF text
    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();
    console.log("First Page:", docs[0]);

    // Convert PDF to Base64
    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Send the event to Inngest
    const result = await inngest.send({
      name: "AiResumeAgent",
      data: { 
        recordId,
        resumeFileName: resumeFile.name,
        base64ResumeFile: base64,
        pdfText: docs[0]?.pageContent,
        aiAgentType: '/ai-tools/ai-resume-analyzer',
        userEmail: user?.primaryEmailAddress?.emailAddress,
      },
    });

    // Extract runId
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

      if (runStatus?.data?.[0]?.status === "Completed") {
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
