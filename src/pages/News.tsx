import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Loader2, ExternalLink, Zap, MousePointerClick, Newspaper, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  // { name: "General", url: "https://news.abidjan.net/rss" },
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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>(null); // Start with NULL to show Welcome

  useEffect(() => {
    if (!activeTab) return; // Don't fetch if no category is selected

    let isMounted = true;
    const fetchIvorianNews = async () => {
      setLoading(true);
      try {
        const rssUrl = encodeURIComponent(activeTab.url);
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

        const response = await fetch(API_URL);
        const data = await response.json();

        if (isMounted && data.status === 'ok') {
          const formattedNews = data.items.map((item: any) => ({
            title: item.title,
            date: new Date(item.pubDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }),
            excerpt: item.description.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...",
            category: activeTab.name,
            link: item.link,
            thumbnail: item.thumbnail || item.enclosure?.link || (item.content?.match(/src="([^"]+)"/)?.[1])
          }));
          setNewsItems(formattedNews);
        }
      } catch (error) {
        console.error("RSS Fetch Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchIvorianNews();
    return () => { isMounted = false; };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-orange-500/10 via-background to-green-600/10">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Zap size={14} fill="currentColor" /> Direct from Abidjan
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            Le Journal
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto uppercase tracking-widest text-[10px]">
            The most reliable source for Ivorian current events in the Diaspora.
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
                  activeTab?.name === cat.name
                    ? "bg-foreground text-background border-foreground scale-105 shadow-xl"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-background min-h-[60vh]">
        <div className="container mx-auto px-4">
          {!activeTab ? (
            /* --- WELCOME STATE --- */
            <div className="max-w-4xl mx-auto text-center space-y-12 animate-in fade-in zoom-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <WelcomeStep 
                  icon={<MousePointerClick className="text-orange-500" />} 
                  title="Select Channel" 
                  desc="Choose a category from the command bar above to begin." 
                />
                <WelcomeStep 
                  icon={<Newspaper className="text-primary" />} 
                  title="Live RSS" 
                  desc="We pull real-time headlines directly from Abidjan servers." 
                />
                <WelcomeStep 
                  icon={<Globe className="text-green-600" />} 
                  title="Stay Rooted" 
                  desc="Keep your connection to Ivory Coast strong, no matter the distance." 
                />
              </div>
              
              <div className="p-12 rounded-[3rem] bg-muted/30 border-2 border-dashed border-border flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center mb-6 shadow-inner">
                  <div className="h-3 w-3 bg-primary rounded-full animate-ping" />
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">System Ready</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">Waiting for frequency selection...</p>
              </div>
            </div>
          ) : loading ? (
            /* --- LOADING STATE --- */
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="animate-spin text-primary mb-6" size={60} />
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] animate-pulse italic">
                Synchronizing {activeTab.name} Feed...
              </p>
            </div>
          ) : (
            /* --- NEWS GRID --- */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-10 duration-700">
              {newsItems.map((item, index) => (
                <NewsCard key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENTS TO KEEP CODE CLEAN --- */

const WelcomeStep = ({ icon, title, desc }: any) => (
  <div className="flex flex-col items-center p-6 space-y-4">
    <div className="p-4 bg-card rounded-2xl shadow-sm border border-border">
      {cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="font-black uppercase tracking-tighter italic text-lg">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const NewsCard = ({ item }: { item: any }) => (
  <Card className="flex flex-col border-none shadow-none hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] overflow-hidden bg-card hover:-translate-y-2">
    {item.thumbnail ? (
      <div className="h-48 overflow-hidden bg-muted">
        <img src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
    ) : (
      <div className="h-48 bg-muted/50 flex items-center justify-center italic text-[10px] opacity-30 font-bold uppercase">No Preview</div>
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
      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight uppercase italic line-clamp-2">
        {item.title}
      </h3>
    </CardHeader>
    <CardContent className="p-8 pt-0 flex flex-col justify-between flex-grow">
      <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">{item.excerpt}</p>
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-foreground text-background w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
        Full Article <ExternalLink size={14} />
      </a>
    </CardContent>
  </Card>
);

// Note: Ensure you import { cloneElement } from "react" at the top
import { cloneElement } from "react";

export default News;