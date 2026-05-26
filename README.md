# AI Workflow Builder

AI Workflow Builder is a clean Next.js portfolio project that helps small businesses turn vague, repetitive business processes into practical automation plans.

Users describe a process in normal language, and the app uses the OpenAI API to generate a structured automation plan with recommended tools, realistic time savings, implementation steps, risks, a client-friendly summary, and a conceptual n8n-style blueprint.

## Screenshots

Screenshots can be added here after running the app locally.

- Landing page
- Workflow input page
- Results dashboard
- Saved workflows page

## Why this project matters

Many small businesses lose hours every week on repetitive admin tasks such as copying data between tools, sending follow-up emails, updating CRMs, and routing requests manually. AI Workflow Builder demonstrates how AI can turn a vague process description into a practical automation plan that business owners can understand and act on.

The project is designed to show real product thinking: it does not pretend to deploy automations automatically. Instead, it provides a clear analysis, realistic time savings, implementation guidance, and a conceptual workflow structure that could later be converted into a real automation.

## Features

- Professional SaaS-style landing page
- Workflow input form with validation
- Server-side OpenAI API route to keep the API key private
- Structured JSON response parsing and normalization
- Realistic time-savings calculations based on user input
- Results dashboard with clean cards and code block output
- Copy client summary and workflow JSON actions
- Save workflows in browser local storage
- Saved workflows page with open and delete actions
- Responsive UI for desktop and mobile
- Basic API rate limiting and error handling

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- OpenAI API
- Browser local storage
- Lucide React icons

## How To Run Locally

```bash
npm install
npm run dev
```

Open the app at:

```bash
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Optional model override:

```bash
OPENAI_MODEL=gpt-4o-mini
```

The OpenAI API key is only read inside the Next.js API route and is never exposed to the frontend.

## Example Use Case

Business type: Dental clinic

Process name: New patient intake

Current process: Patients fill in a contact form. Someone manually checks the email, copies the details into the CRM, sends a confirmation email, and creates a reminder task.

Tools used: Gmail, Google Sheets, CRM

Pain point: Too much manual copying and mistakes sometimes happen.

Frequency: 30 times per week

Minutes per task: 8

Expected output includes a practical workflow plan, recommended tools, estimated weekly and monthly time savings, implementation steps, risks, and a conceptual n8n-style JSON structure.

## What I Learned

- How to design an AI product around a clear business problem
- How to keep API keys server-side in a Next.js application
- How to request and validate structured AI output
- How to normalize AI-generated estimates using deterministic business logic
- How to build a clean responsive dashboard with reusable components
- How to persist useful app data with local storage for a lightweight MVP

## Future Improvements

- Real n8n export
- Supabase authentication
- Team workspaces
- Integration with Gmail/Slack/Notion
- PDF export
- ROI calculator
- Multi-language support

## Project Structure

```text
app/
  api/generate-workflow/route.ts  Server-side OpenAI workflow generation
  builder/page.tsx                Workflow input form
  results/page.tsx                Results dashboard
  saved/page.tsx                  Saved workflows view
components/                       Reusable UI components
lib/                              Validation, normalization, and storage helpers
types/                            Shared TypeScript workflow types
```

## Notes

The n8n-style blueprint is intentionally conceptual. It is useful for planning and communication, but it is not a working n8n workflow export yet.
