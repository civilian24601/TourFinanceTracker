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
      <ScrollArea className="w-full overflow-x-auto" style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x',
      }}>
        <div className="flex gap-4 pb-4">
          {section.articles.map((article) => (
            <div key={article.id} className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px]">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}