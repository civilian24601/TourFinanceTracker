import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { ArticleSection } from "@/components/learn/article-section";
import { SearchModal } from "@/components/learn/search-modal";
import { SAMPLE_ARTICLES } from "@/types/learn";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LearnPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#262629]">
      <Header />
      <main className="container mx-auto py-6 px-4 space-y-6 pb-32">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Learn</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="text-muted-foreground hover:text-white"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-muted-foreground">
          Expert insights on tour finances, music tech, and business growth
        </p>

        {/* Article sections */}
        <div className="space-y-8 mt-8 overflow-hidden">
          {SAMPLE_ARTICLES.map((section, index) => (
            <ArticleSection key={index} section={section} />
          ))}
        </div>
      </main>
      <Navigation />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}