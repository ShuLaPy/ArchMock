import { notFound } from "next/navigation";
import { getProblemBySlug, PROBLEMS } from "@/data/problems";
import { ProblemLayout } from "@/components/problem/ProblemLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  return {
    title: problem ? `${problem.title} — sys.design` : "Problem not found",
  };
}

export default async function ProblemPage({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) notFound();

  return <ProblemLayout problem={problem} />;
}
