import { ArticleCard } from "./article-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ArticleSection as ArticleSectionType } from "@/types/learn";

interface ArticleSectionProps {
  section: ArticleSectionType;
}

export function ArticleSection({ section }: ArticleSectionProps) {
  return (
    <div className="py-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 text-white">{section.title}</h2>
        {section.description && (
          <p className="text-muted-foreground">{section.description}</p>
        )}
      </div>
      <ScrollArea className="w-full overflow-x-auto" type="scroll" scrollHideDelay={150}>
        <div className="flex space-x-4 pb-4 px-[1px]">
          {section.articles.map((article) => (
            <div key={article.id} className="min-w-[350px] max-w-[350px] first:pl-0 last:pr-0">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}