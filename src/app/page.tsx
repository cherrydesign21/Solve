import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getToolsByCategory } from "@/lib/tools-registry";
import { Card } from "@/components/ui/Card";
import { ToolBackdrop } from "@/components/layout/ToolBackdrop";
import { toolBackdrops } from "@/lib/tool-backdrops";

export default function HomePage() {
  const groups = getToolsByCategory().filter((group) => group.tools.length > 0);

  return (
    <div className="relative">
      <ToolBackdrop icons={toolBackdrops.home ?? []} />
      <div className="mb-10 max-w-2xl sm:mb-14">
        <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Multi-utility toolkit
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
          Everyday calculators, <span className="text-accent">solved</span> instantly.
        </h1>
        <p className="mt-4 text-sm text-white/60 sm:text-base">
          Pick a tool below, grouped the same way as the sidebar. Every value updates in real time as you
          type or drag — no submit buttons required.
        </p>
      </div>

      <div className="flex flex-col gap-12 sm:gap-16">
        {groups.map(({ category, tools: categoryTools }) => (
          <section key={category}>
            <div className="mb-5 flex items-baseline gap-3 sm:mb-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                {category}
              </h2>
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-xs text-white/25">{categoryTools.length}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoryTools.map((tool, i) => {
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
                        <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                        <p className="mt-1.5 text-sm text-white/50">{tool.description}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
