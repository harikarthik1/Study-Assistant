import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, QuizQuestion, StudySet } from "../types/study";

export interface GenerationOptions {
  flashcardCount?: number;
  quizCount?: number;
  signal?: AbortSignal;
}

// Helper to clean raw text and extract JSON
function extractAndParseJSON(text: string): any {
  let cleaned = text.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Find first { or [ and last } or ]
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // Remove potential trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse JSON response: ${(err as Error).message}`);
  }
}

// Validate study set structure
function validateStudySet(data: any, originalNotes: string): StudySet {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response: Expected a JSON object");
  }

  const topic =
    typeof data.topic === "string" && data.topic.trim().length > 0
      ? data.topic.trim()
      : originalNotes.slice(0, 40).trim() || "Study Topic";

  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    throw new Error("Invalid response: Missing or empty 'flashcards' array");
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error("Invalid response: Missing or empty 'questions' array");
  }

  const flashcards: Flashcard[] = data.flashcards.map((fc: any, index: number) => {
    if (!fc.question || !fc.answer) {
      throw new Error(`Flashcard at index ${index} is missing question or answer`);
    }
    return {
      id: fc.id || `fc_${index + 1}_${Date.now()}`,
      question: String(fc.question).trim(),
      answer: String(fc.answer).trim(),
    };
  });

  const questions: QuizQuestion[] = data.questions.map((q: any, index: number) => {
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Quiz question at index ${index} is missing question or valid options`);
    }

    const options = q.options.map((opt: any) => String(opt).trim());
    let correctAnswer = String(q.correctAnswer || "").trim();

    // Check if correctAnswer is an index or letter like "A", "B", etc.
    if (/^[0-3]$/.test(correctAnswer)) {
      const idx = parseInt(correctAnswer, 10);
      if (options[idx]) {
        correctAnswer = options[idx];
      }
    } else if (/^[A-D]$/i.test(correctAnswer)) {
      const idx = correctAnswer.toUpperCase().charCodeAt(0) - 65;
      if (options[idx]) {
        correctAnswer = options[idx];
      }
    }

    // Ensure correctAnswer is in options; if not, default to first option
    if (!options.includes(correctAnswer)) {
      const match = options.find(
        (opt: string) =>
          opt.toLowerCase().includes(correctAnswer.toLowerCase()) ||
          correctAnswer.toLowerCase().includes(opt.toLowerCase())
      );
      correctAnswer = match || options[0];
    }

    return {
      id: q.id || `q_${index + 1}_${Date.now()}`,
      question: String(q.question).trim(),
      options,
      correctAnswer,
      explanation: q.explanation ? String(q.explanation).trim() : undefined,
    };
  });

  return {
    id: `set_${Date.now()}`,
    topic,
    rawNotes: originalNotes,
    createdAt: Date.now(),
    flashcards,
    questions,
  };
}

export async function generateStudySetWithGemini(
  notes: string,
  options: GenerationOptions = {}
): Promise<StudySet> {
  const { flashcardCount = 5, quizCount = 5, signal } = options;

  if (!notes || notes.trim().length === 0) {
    throw new Error("Notes cannot be empty. Please enter some text or topic.");
  }

  // Strictly read Gemini API key from .env file
  const effectiveKey =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_GEMINI_API_KEY || ""
      : "";

  if (!effectiveKey || effectiveKey.trim() === "") {
    throw new Error(
      "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file in the project root."
    );
  }

  const prompt = `You are an expert educational tutor. Analyze the following study notes or topic and produce a structured study set with exactly ${flashcardCount} high-yield flashcards and ${quizCount} multiple-choice quiz questions.

STUDY NOTES / TOPIC:
"""
${notes}
"""

REQUIREMENTS:
1. Provide a concise, clear 'topic' name summarizing the material.
2. Produce ${flashcardCount} flashcards with insightful questions and clear, educational answers.
3. Produce ${quizCount} multiple-choice quiz questions. Each question MUST have exactly 4 options and the exact 'correctAnswer' (which must match one of the 4 options verbatim). Provide an optional short 'explanation'.
4. Return ONLY a valid JSON object strictly matching this schema:
{
  "topic": "Topic Title",
  "flashcards": [
    {
      "id": "fc_1",
      "question": "Clear question?",
      "answer": "Detailed answer."
    }
  ],
  "questions": [
    {
      "id": "q_1",
      "question": "Multiple choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this answer is correct."
    }
  ]
}`;

  try {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                  },
                  required: ["id", "question", "answer"],
                },
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["id", "question", "options", "correctAnswer"],
                },
              },
            },
            required: ["topic", "flashcards", "questions"],
          },
        },
      });

      const responseText = response.text || "";
      if (!responseText) {
        throw new Error("Received empty response from Gemini API");
      }

      const parsed = extractAndParseJSON(responseText);
      return validateStudySet(parsed, notes);
    } catch (sdkError: any) {
      if (sdkError?.name === "AbortError" || signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(
        effectiveKey
      )}`;

      const restResponse = await fetch(restUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
        signal,
      });

      if (!restResponse.ok) {
        const errJson = await restResponse.json().catch(() => ({}));
        const errMsg =
          errJson.error?.message ||
          `Gemini API Error: HTTP ${restResponse.status} ${restResponse.statusText}`;
        throw new Error(errMsg);
      }

      const restData = await restResponse.json();
      const rawText =
        restData.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!rawText) {
        throw new Error("Gemini returned an empty response body");
      }

      const parsed = extractAndParseJSON(rawText);
      return validateStudySet(parsed, notes);
    }
  } catch (error: any) {
    if (error.name === "AbortError" || signal?.aborted) {
      throw error;
    }
    console.error("Gemini Generation Error:", error);
    throw new Error(
      error.message || "The AI returned an unexpected study format."
    );
  }
}
