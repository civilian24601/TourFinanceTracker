import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { ArticleSection } from "@/components/learn/article-section";
import { SAMPLE_ARTICLES } from "@/types/learn";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-4 space-y-6 pb-32">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Learn</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10"
            />
          </div>
        </div>

        <p className="text-muted-foreground">
          Expert insights on tour finances, music tech, and business growth
        </p>

        {/* Article sections */}
        <div className="space-y-8">
          {SAMPLE_ARTICLES.map((section, index) => (
            <ArticleSection key={index} section={section} />
          ))}
        </div>
      </main>
      <Navigation />
    </div>
  );
}