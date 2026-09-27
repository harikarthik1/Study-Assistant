# StudyAI — AI-Powered Study Assistant

StudyAI is an interactive study application that transforms free-form lecture notes, articles, and educational topics into structured, interactive study sets with 3D flip flashcards and customizable quizzes using **Google Gemini AI**.

---

## 🌟 Key Features

1. **Free-Form Text & Topic Input**:
   - Paste unstructured lecture notes, key terms, or topic summaries.
   - Character counter and quick-clear controls.

2. **Google Gemini AI Integration**:
   - Leverages `@google/genai` with structured JSON schema output (`responseMimeType: "application/json"`).
   - Generates high-yield flashcards and 4-option multiple choice quiz questions.
   - Built-in API Key management modal directly accessible from the header (with local storage persistence) or via `.env`.

3. **Resilience & Bad Output Handling**:
   - **Malformed JSON Recovery**: Strips Markdown code blocks, cleans trailing commas, and extracts valid JSON payloads.
   - **Schema & Shape Validation**: Validates array lengths, question structure, option arrays, and auto-corrects answer index/letter representations.
   - **Stale Response Protection**: Uses `AbortController` to cancel in-flight requests and prevent outdated AI responses from overwriting newer user requests.
   - **Graceful Error State**: Clean error screen matching the design specifications with a safe "Try Again" mechanism that preserves user notes.

4. **Interactive Study Tools**:
   - **3D Flip Flashcards**: Interactive cards with realistic 3D perspective flip, mastery tracking ("Mark as Mastered"), and a toggleable All-Cards Grid View.
   - **Interactive Quiz Engine**: Multiple-choice questions with letter badges (A, B, C, D), instant selection feedback, and progress tracking.
   - **Results & Mistake Retesting**: Complete score breakdown (Correct, Needs Review, Score percentage) and one-click **"Retry Mistakes"** mode to re-test only incorrect answers.
   - **Keyboard Navigation**:
     - Flashcards: `Space` (flip), `ArrowLeft` / `ArrowRight` (previous/next card).
     - Quiz: `1-4` or `A-D` (select option), `Enter` (next question / finish quiz).

5. **Session History**:
   - Automatic local session saving to reload and review recent study sets at any time.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Running

```bash
# 1. Clone the repository and navigate to directory
cd study-assistant

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# (or: npm run dev)
```

The application will be running locally at `http://localhost:5173`.

### Gemini API Key Configuration
The application reads the Gemini API key strictly from your `.env` file.

1. Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Restart the dev server (`npm start` or `npm run dev`).

---

## 🏗️ Architecture & State Management

- **Frontend**: React 19, TypeScript, React Router v7, Tailwind CSS v4.
- **State Management**: `StudyContext` utilizing React Context API, `useMemo`, `useCallback`, and `useRef` for request cancellation tokens and local storage caching.
- **AI Service Layer (`src/services/gemini.ts`)**:
  - Encapsulates Gemini SDK calls and REST fallback endpoints.
  - Robust JSON parsing with structure assertion and recovery.

---

## 🤖 AI Usage Note

In accordance with the assignment guidelines:
- **AI Tooling Used**: Antigravity / Gemini 3.7 for pair programming, code generation, error recovery architecture design, and UI component styling.
- **Human Oversight**: Custom layout requirements, color matching against provided design mockups, TypeScript schema validation logic, and mistake-retesting flows were directed and reviewed.

---

## ⏱️ Time Spent

- **Architecture & Setup**: ~45 minutes
- **Gemini API Integration & Error Resilience**: ~1.5 hours
- **UI Components & Pixel-Perfect Design Matching**: ~2 hours
- **Testing, Keyboard Shortcuts, & Documentation**: ~45 minutes
- **Total Time**: ~5 hours

---

## 📝 Known Limitations & Future Improvements

- Currently generates text-based flashcards and multiple-choice questions; future iterations could support image-based questions and spaced repetition intervals (SM-2 algorithm).
- Cloud sync for cross-device study session continuity.
