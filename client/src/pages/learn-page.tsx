import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { ArticleSection } from "@/components/learn/article-section";
import { SAMPLE_ARTICLES } from "@/types/learn";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <main className="container mx-auto py-6 px-4 space-y-6 pb-32">
        {/* Header section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-primary">Learn</h1>
          <p className="text-muted-foreground">
            Expert insights on tour finances, music tech, and business growth
          </p>
          <div className="flex justify-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10 bg-[#2d2d30] border-none"
              />
            </div>
          </div>
        </div>

        {/* Article sections */}
        <div className="space-y-8 mt-8 overflow-hidden">
          {SAMPLE_ARTICLES.map((section, index) => (
            <ArticleSection key={index} section={section} />
          ))}
        </div>
      </main>
      <Navigation />
    </div>
  );
}