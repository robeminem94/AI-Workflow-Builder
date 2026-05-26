import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Workflow } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Card } from "@/components/card";
import { SectionHeading } from "@/components/section-heading";

const steps = [
  "Describe your process",
  "AI analyzes automation opportunities",
  "Get a workflow plan"
];

const useCases = [
  "Lead intake automation",
  "Invoice processing",
  "Customer support routing",
  "CRM updates",
  "Email follow-ups"
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-brand-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Practical AI automation planning for small businesses
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            AI Workflow Builder
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">
            Turn messy business processes into clear automation plans.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Describe how work gets done today and receive a structured plan with recommended tools,
            realistic time savings, implementation steps, and a client-ready summary.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/builder" size="lg">
              Build a Workflow
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/saved" variant="secondary" size="lg">
              View Saved Workflows
            </ButtonLink>
          </div>
        </div>

        <Card className="relative overflow-hidden p-0">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400" />
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Example Output</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">New patient intake</h2>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <Workflow className="h-7 w-7" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-cloud p-4">
                <p className="text-sm font-medium text-slate-500">Automation opportunity</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Capture form submissions, update the CRM, send confirmation emails, and create reminders automatically.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Metric label="Saved per week" value="3.5h" />
                <Metric label="Complexity" value="Medium" />
                <Metric label="Tools" value="4" />
              </div>
              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="text-sm font-medium text-slate-500">Workflow steps</p>
                <ol className="mt-3 space-y-3 text-sm text-slate-700">
                  {[
                    "New web form submission triggers workflow",
                    "Patient details are validated and added to CRM",
                    "Confirmation email is sent automatically"
                  ].map((step) => (
                    <li key={step} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From vague process to practical automation plan"
          description="The app keeps the process simple: describe the work, let AI structure the opportunity, then review a business-friendly plan."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-lg font-bold text-brand-600">
                {index + 1}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {index === 0 && "Add the business type, tools, frequency, time spent, and what feels painful today."}
                {index === 1 && "The API route asks OpenAI for structured JSON and normalizes time savings with your inputs."}
                {index === 2 && "Review cards, copy summaries, save workflows locally, or start a new analysis."}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <SectionHeading
          eyebrow="Use cases"
          title="Built for everyday admin bottlenecks"
          description="Small teams can use the builder to explore automation ideas before committing to tools or implementation work."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {useCases.map((useCase) => (
            <Link
              key={useCase}
              href="/builder"
              className="group rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-100 hover:shadow-soft"
            >
              <div className="mb-5 h-1.5 w-12 rounded-full bg-brand-500 transition group-hover:w-16" />
              <h3 className="font-semibold text-ink">{useCase}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Explore automation fit and next steps.</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
