export interface InsightCard {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  impact: 'positive' | 'negative' | 'neutral';
  value?: string;
  trend?: number;
}

export interface InsightSection {
  title: string;
  description?: string;
  insights: InsightCard[];
}

export const SAMPLE_INSIGHTS: InsightSection[] = [
  {
    title: "Tour Revenue Analysis",
    description: "Key financial metrics and trends from your tours",
    insights: [
      {
        id: "1",
        title: "Merchandise Sales Trending Up",
        description: "Your merch revenue has increased by 25% compared to last tour",
        category: "Revenue",
        date: "Mar 19, 2025",
        readTime: "2 mins",
        impact: "positive",
        value: "+25%",
        trend: 25
      },
      {
        id: "2",
        title: "Venue Size Optimization",
        description: "Mid-sized venues showing best ROI in current market",
        category: "Strategy",
        date: "Mar 18, 2025",
        readTime: "3 mins",
        impact: "positive",
        value: "15% better ROI"
      },
      {
        id: "3",
        title: "Transportation Costs Alert",
        description: "Fuel costs trending higher than previous tours",
        category: "Expenses",
        date: "Mar 17, 2025",
        readTime: "2 mins",
        impact: "negative",
        value: "-10%"
      }
    ]
  },
  {
    title: "Cost Optimization",
    description: "Opportunities to reduce expenses and improve margins",
    insights: [
      {
        id: "4",
        title: "Equipment Rental Strategy",
        description: "Analysis shows buying could be more cost-effective",
        category: "Equipment",
        date: "Mar 16, 2025",
        readTime: "4 mins",
        impact: "neutral",
        value: "$5,000 potential savings"
      },
      {
        id: "5",
        title: "Venue Contract Insights",
        description: "New negotiation opportunities identified",
        category: "Venues",
        date: "Mar 15, 2025",
        readTime: "3 mins",
        impact: "positive",
        value: "+8% margin"
      },
      {
        id: "6",
        title: "Staff Scheduling Efficiency",
        description: "Optimal crew size recommendations by venue type",
        category: "Staffing",
        date: "Mar 14, 2025",
        readTime: "3 mins",
        impact: "positive",
        value: "12% cost reduction"
      }
    ]
  },
  {
    title: "Market Trends",
    description: "Industry insights and market opportunities",
    insights: [
      {
        id: "7",
        title: "Digital Ticket Trends",
        description: "NFT ticket opportunities in your market",
        category: "Technology",
        date: "Mar 13, 2025",
        readTime: "4 mins",
        impact: "positive",
        value: "Emerging Opportunity"
      },
      {
        id: "8",
        title: "Streaming Revenue",
        description: "Live streaming potential for upcoming shows",
        category: "Digital",
        date: "Mar 12, 2025",
        readTime: "3 mins",
        impact: "positive",
        value: "New Revenue Stream"
      },
      {
        id: "9",
        title: "Fan Engagement Metrics",
        description: "Social media impact on ticket sales",
        category: "Marketing",
        date: "Mar 11, 2025",
        readTime: "3 mins",
        impact: "neutral",
        value: "Data Analysis"
      }
    ]
  }
];
