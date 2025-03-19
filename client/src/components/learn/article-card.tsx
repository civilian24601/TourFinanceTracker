import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays } from "lucide-react";
import type { Article } from "@/types/learn";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="aspect-[16/9] relative bg-muted rounded-t-lg overflow-hidden">
        {article.mainImage ? (
          <img
            src={article.mainImage}
            alt={article.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Image placeholder</span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex flex-col space-y-2">
          <Badge variant="secondary" className="w-fit">
            {article.category}
          </Badge>
          <h3 className="font-semibold text-lg leading-tight hover:text-primary">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground">{article.author}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-1" />
            {article.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {article.readTime}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
