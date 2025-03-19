import { ArticleCard } from "./article-card";
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
      <div className="relative -mx-4">
        <div 
          className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory no-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {section.articles.map((article) => (
            <div 
              key={article.id} 
              className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] snap-start"
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}