export interface Article {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  readTime: string;
  mainImage?: string;
  category: string;
}

export interface ArticleSection {
  title: string;
  description?: string;
  articles: Article[];
}

export const SAMPLE_ARTICLES: ArticleSection[] = [
  {
    title: "Get ahead of tax season",
    articles: [
      {
        id: "1",
        title: "Tax Deductions Every Touring Musician Should Know",
        author: "Marcus Rivera, CPA",
        excerpt: "From instrument depreciation to travel expenses, learn the key deductions that can save touring musicians thousands.",
        date: "Mar 15, 2025",
        readTime: "4 mins",
        category: "Taxes"
      },
      {
        id: "2",
        title: "Understanding Foreign Income for International Tours",
        author: "Sarah Chen",
        excerpt: "Navigate the complexities of earning income across borders during your world tour.",
        date: "Mar 12, 2025",
        readTime: "5 mins",
        category: "Taxes"
      },
      {
        id: "3",
        title: "Digital Nomad Musicians: Tax Implications",
        author: "James Wilson",
        excerpt: "How to handle taxes when you're making music and money from anywhere in the world.",
        date: "Mar 10, 2025",
        readTime: "3 mins",
        category: "Taxes"
      }
    ]
  },
  {
    title: "Smart money moves to consider",
    articles: [
      {
        id: "4",
        title: "AI-Powered Revenue Streams for Musicians",
        author: "Tech Insights Team",
        excerpt: "Explore how AI is creating new opportunities for musicians to monetize their craft.",
        date: "Mar 8, 2025",
        readTime: "6 mins",
        category: "Technology"
      },
      {
        id: "5",
        title: "Maximizing Merch Revenue on Tour",
        author: "Emily Rodriguez",
        excerpt: "Strategic approaches to merchandise planning and sales during live performances.",
        date: "Mar 5, 2025",
        readTime: "4 mins",
        category: "Business"
      },
      {
        id: "6",
        title: "Investment Strategies for Artists",
        author: "Michael Chang",
        excerpt: "Smart ways to invest your tour earnings for long-term financial security.",
        date: "Mar 3, 2025",
        readTime: "5 mins",
        category: "Investment"
      }
    ]
  },
  {
    title: "Tech & Innovation",
    articles: [
      {
        id: "7",
        title: "GPT-4 for Music Business Management",
        author: "Dr. Lisa Kumar",
        excerpt: "How AI is revolutionizing tour planning and financial forecasting for musicians.",
        date: "Mar 1, 2025",
        readTime: "4 mins",
        category: "Technology"
      },
      {
        id: "8",
        title: "Blockchain Royalties: A New Era",
        author: "Alex Thompson",
        excerpt: "Understanding how blockchain technology is transforming music royalty payments.",
        date: "Feb 28, 2025",
        readTime: "5 mins",
        category: "Technology"
      },
      {
        id: "9",
        title: "Digital Wallets for Touring Artists",
        author: "Finance Tech Team",
        excerpt: "Modern solutions for managing international payments and expenses on tour.",
        date: "Feb 25, 2025",
        readTime: "3 mins",
        category: "Technology"
      }
    ]
  }
];
