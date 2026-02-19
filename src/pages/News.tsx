import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Loader2, ExternalLink, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "General", url: "https://news.abidjan.net/rss" },
  { name: "Afrique", url: "https://news.abidjan.net/rss/afrique.xml" },
  { name: "Economie", url: "https://news.abidjan.net/rss/economie.xml" },
  { name: "Politique", url: "https://news.abidjan.net/rss/politique.xml" },
  { name: "International", url: "https://news.abidjan.net/rss/international.xml" },
  { name: "Showbizz", url: "https://news.abidjan.net/rss/showbizz.xml" },
  { name: "Sante", url: "https://news.abidjan.net/rss/sante.xml" },
  { name: "Arts", url: "https://news.abidjan.net/rss/arts.xml" },
];

const News = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);

  useEffect(() => {
    const fetchIvorianNews = async () => {
      setLoading(true);
      try {
        // Use the RSS-to-JSON proxy to bypass CORS
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(activeTab.url)}`;

        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === 'ok') {
          const formattedNews = data.items.map((item: any) => ({
            title: item.title,
            date: new Date(item.pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            excerpt: item.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...",
            category: activeTab.name,
            link: item.link,
            thumbnail: item.thumbnail || item.enclosure?.link // Try to get images if available
          }));
          setNewsItems(formattedNews);
        }
      } catch (error) {
        console.error("Error fetching Abidjan.net news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIvorianNews();
  }, [activeTab]); // Refetch whenever the user clicks a new category

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-orange-500/10 via-background to-green-600/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} fill="currentColor" /> Official RSS Feed
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            Le Journal
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Real-time updates from Abidjan.net. Stay connected to the pulse of Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-y border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                  activeTab.name === cat.name
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-transparent hover:border-border"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="animate-spin text-primary mb-6" size={60} />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-sm animate-pulse">
                  Fetching {activeTab.name} Feed...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {newsItems.map((item, index) => (
                  <Card
                    key={index}
                    className="flex flex-col border-none shadow-none hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] overflow-hidden bg-card hover:-translate-y-2"
                  >
                    {item.thumbnail && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-black px-3 py-1 bg-primary text-white rounded-full uppercase tracking-tighter">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                          <Calendar size={12} className="text-orange-500" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight uppercase italic">
                        {item.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex flex-col justify-between flex-grow">
                      <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                        {item.excerpt}
                      </p>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-foreground text-background w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
                      >
                        Read on Abidjan.net
                        <ExternalLink size={14} />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;