import { inngest } from "./client";
import { createAgent, gemini } from '@inngest/agent-kit';
import ImageKit from "imagekit";
import { parse } from "path";
import { HistoryTable } from "@/configs/schema";
import { db } from "@/configs/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const AiCareerChatAgent = createAgent({
    name:'AiCareerChatAgent',
    description: 'An Ai agent that helps users with career-related questions.',
    system: `You are a helpful, professional AI Career Coach Agent. Your role is to provide personalized career advice, answer questions, and guide users in making smarter career decisions. Always respond with clarity, encouragement, and actionable advice, tailored to the user's situation.
If the user asks something unrelated to careers (e.g., topics not about job search, skill development, career transitions, or industry trends), politely guide the conversation back to career-related topics by suggesting relevant career questions instead.`,
    model:gemini({
        model:"gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY 
    })
})

export const AiResumeAnalyzerAgent = createAgent({
    name:'AiResumeAnalyzerAgent',
    description:"AI Resume Analyzer Agent that helps users analyze their resumes and provides suggestions for improvement.",
    system:`You are an advanced AI Resume Analyzer Agent.

Task:
Evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format. The schema must match the layout and structure of a visual UI that includes:

Overall score

Section scores

Summary feedback

Improvement tips

Strengths

Weaknesses

Input: Plain text resume.

Goal: Output a JSON report with the following structure:

Overall Score: Return a number between 0 and 100, where 100 is perfect.

Overall Feedback: Short message (e.g., "Excellent", "Needs improvement").

Summary Comment: 1–2 sentence evaluation summary.

Section Scores for:

Contact Info

Experience

Education

Skills

Each section should include:

Score (as percentage)

Optional comment about that section

Tips for Improvement: 3–5 tips.

What's Good: 1–3 strengths.

Needs Improvement: 1–3 weaknesses.

Second File Content:
Example JSON Schema:

json
{
    "overall_score": 85,
    "overall_feedback": "Excellent!",
    "summary_comment": "Your resume is strong, but there are areas to refine.",
    "sections": {
        "contact_info": {
            "score": 95,
            "comment": "Perfectly structured and complete."
        },
        "experience": {
            "score": 88,
            "comment": "Strong bullet points and impact."
        },
        "education": {
            "score": 70,
            "comment": "Consider adding relevant coursework."
        },
        "skills": {
            "score": 60,
            "comment": "Expand on specific skill proficiencies."
        }
    },
    "tips_for_improvement": [
        "Add more numbers and metrics to your experience section to show impact.",
        "Integrate more industry-specific keywords relevant to your target roles.",
        "Start bullet points with strong action verbs to make your achievements stand out."
    ],
    "whats_good": [
        "Clean and professional formatting.",
        "Clear and concise contact information.",
        "Relevant work experience."
    ],
    "needs_improvement": [
        "Skills section lacks detail.",
        "Some experience bullet points could be stronger.",
        "Missing a professional summary/objective."
    ]
} `,
    model:gemini({
        model:"gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY 
    })
})

export const AIRoadmapGeneratorAgent = createAgent({
    name:'AIRoadmapGeneratorAgent',
    description: 'Generate Detailed Tree like Flow Roadmap',
    system:`Generate a React flow tree-structured learning roadmap for user input position/skills in the following format:
vertical tree structure with meaningful x/y positions to form a flow
• Structure should be similar to roadmap.sh layout
• Steps should be ordered from fundamentals to advanced
• Include branching for different specializations (if applicable)
• Each node must have a title, short description, and learning resource link
• Use unique IDs for all nodes and edges
• Make it more spacious node positioning
• Add little space between nodes and make it look clean and nicely alligned
• Response in JSON format:
{
    "roadmapTitle": "",
    "description": "<3-5 Lines>",
    "duration": "",
    "initialNodes": [
        {
            "id": "1",
            "type": "turbo",
            "position": { "x": 0, "y": 0 },
            "data": {
                "title": "Step Title",
                "description": "Short two-line explanation of what the step covers.",
                "link": "Helpful link for learning this step"
            }
        }
    ],
    "initialEdges": [
        {
            "id": "e1-2",
            "source": "1",
            "target": "2"
        }
    ]
}`,
    model:gemini({
        model:"gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY 
    })
})

export const AiCareerAgent = inngest.createFunction(
    { id: "AiCareerAgent" },
    { event: "AiCareerAgent" },
    async ({ event, step }) => {
        const {userInput} = await event?.data;
        const result = await AiCareerChatAgent.run(userInput);
        return result;
    }
);

var imagekit = new ImageKit({
    //@ts-ignore
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY ,
    //@ts-ignore
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    //@ts-ignore
    urlEndpoint : process.env.IMAGEKIT_ENDPOINT_URL
});

export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" },
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    const { recordId, base64ResumeFile, pdfText, aiAgentType, userEmail } = event.data;

    // Upload file to ImageKit
    const uploadFileUrl = await step.run("uploadImage", async () => {
      const imageKitFile = await imagekit.upload({
        file: base64ResumeFile,
        fileName: `${Date.now()}.pdf`,
        isPublished: true
      });
      return imageKitFile.url;
    });

    // Run AI Resume Analyzer
    const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);

    // ✅ ADDED ERROR HANDLING FOR JSON PARSING
    let parseJson;
    try {
      // @ts-ignore
      const rawContent = aiResumeReport.output[0].content;
      const rawContentJson = rawContent.replace('```json', '').replace('```', '').trim();
      parseJson = JSON.parse(rawContentJson);
    } catch (error) {
      console.error("JSON Parse Error in Resume Agent:", error);
      // Fallback JSON structure
      parseJson = {
        overall_score: 0,
        overall_feedback: "Error analyzing resume",
        summary_comment: "Sorry, there was an error processing your resume. Please try again.",
        sections: {
          contact_info: { score: 0, comment: "Error" },
          experience: { score: 0, comment: "Error" },
          education: { score: 0, comment: "Error" },
          skills: { score: 0, comment: "Error" }
        },
        tips_for_improvement: ["Please try uploading your resume again"],
        whats_good: [],
        needs_improvement: []
      };
    }

    // Save to database
    const saveToDb = await step.run("SaveToDb", async () => {
      // @ts-ignore
      const result = await db.insert(HistoryTable).values({
        recordId: recordId,
        content: parseJson,
        aiAgentType: aiAgentType,
        createdAt: new Date().toISOString(),
        userEmail: userEmail,
        metaData: uploadFileUrl
      });
      console.log(result);
      return parseJson;
    });

    return saveToDb;
  }
);

export const AIRoadmapAgent = inngest.createFunction(
    { id: "AiRoadmapAgent" },
    { event: "AiRoadmapAgent" },
    async ({ event, step }) => {
        const {roadmapId, userInput, userEmail} = await event.data;

        const roadmapResult = await AIRoadmapGeneratorAgent.run("UserInput:"+userInput);

        // ✅ ADDED ERROR HANDLING FOR JSON PARSING
        let parseJson;
        try {
          // @ts-ignore
          const rawContent = roadmapResult.output[0].content;
          const rawContentJson = rawContent.replace('```json', '').replace('```', '').trim();
          parseJson = JSON.parse(rawContentJson);
        } catch (error) {
          console.error("JSON Parse Error in Roadmap Agent:", error);
          // Fallback JSON structure
          parseJson = {
            roadmapTitle: "Error Generating Roadmap",
            description: "Sorry, there was an error generating your roadmap. Please try again.",
            duration: "Unknown",
            initialNodes: [],
            initialEdges: []
          };
        }

        // Save to database
        const saveToDb = await step.run("SaveToDb", async () => {
          // @ts-ignore
          const result = await db.insert(HistoryTable).values({
            recordId: roadmapId,
            content: parseJson,
            aiAgentType: '/ai-tools/ai-roadmap-agent',
            createdAt: new Date().toISOString(),
            userEmail: userEmail,
            metaData: userInput
          });
          console.log(result);
          return parseJson;
        });

        return saveToDb;
    }
);