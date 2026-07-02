import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tools } from "@/lib/tools-registry";
import { Card } from "@/components/ui/Card";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";

export default function HomePage() {
  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops.home ?? []} />
      <div className="mb-10 max-w-2xl sm:mb-14">
        <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Multi-utility toolkit
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
          Everyday calculators, <span className="text-accent">solved</span> instantly.
        </h1>
        <p className="mt-4 text-sm text-white/60 sm:text-base">
          Pick a tool below. Every value updates in real time as you type or drag — no submit buttons required.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.slug} href={`/${tool.slug}`} className="group block">
              <Card
                className="animate-rise flex h-full flex-col gap-5 p-6 transition-colors duration-300 hover:border-accent/40 hover:bg-white/[0.08]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-white/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{tool.name}</h2>
                  <p className="mt-1.5 text-sm text-white/50">{tool.description}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
