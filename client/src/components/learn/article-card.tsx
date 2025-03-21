import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays } from "lucide-react";
import type { Article } from "@/types/learn";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="w-full h-[380px] hover:shadow-lg transition-shadow duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] bg-[#2d2d30] rounded-lg overflow-hidden flex flex-col">
      <div className="aspect-[16/9] relative bg-[#2d2d30] overflow-hidden">
        {article.mainImage ? (
          <img
            src={article.mainImage}
            alt={article.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-[#4a806b] bg-opacity-20 flex items-center justify-center">
            <span className="text-[#4a806b]">Image placeholder</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4 flex-grow">
        <div className="flex flex-col h-full">
          <Badge variant="secondary" className="w-fit mb-2">
            {article.category}
          </Badge>
          <h3 className="font-semibold text-lg leading-tight text-white hover:text-primary line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{article.author}</p>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
            {article.excerpt}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1" />
              {article.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}