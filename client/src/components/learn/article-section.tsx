import { ArticleCard } from "./article-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { ArticleSection as ArticleSectionType } from "@/types/learn";

interface ArticleSectionProps {
  section: ArticleSectionType;
}

export function ArticleSection({ section }: ArticleSectionProps) {
  return (
    <div className="py-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="flex w-full space-x-4 pb-4">
          {section.articles.map((article) => (
            <div key={article.id} className="w-[350px] shrink-0">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
