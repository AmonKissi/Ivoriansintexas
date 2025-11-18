import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const News = () => {
  const newsItems = [
    {
      title: "AIT Celebrates 10 Years of Community Building",
      date: "February 15, 2025",
      excerpt: "This year marks a decade of bringing Ivorians together in Texas. We reflect on our journey and the incredible growth of our community.",
      category: "Milestone",
    },
    {
      title: "Youth Mentorship Program Launches in Spring",
      date: "February 10, 2025",
      excerpt: "AIT is proud to announce a new mentorship initiative connecting young Ivorians with experienced professionals in various fields.",
      category: "Program Launch",
    },
    {
      title: "Independence Day 2025 - Save the Date!",
      date: "February 5, 2025",
      excerpt: "Mark your calendars for August 7th! This year's Independence Day celebration will be our biggest yet, featuring live performances and traditional cuisine.",
      category: "Event Announcement",
    },
    {
      title: "Member Spotlight: Success Stories from Our Community",
      date: "January 28, 2025",
      excerpt: "Meet three AIT members who have achieved remarkable success in business, education, and community service.",
      category: "Community",
    },
    {
      title: "New Partnership with Local Organizations",
      date: "January 20, 2025",
      excerpt: "AIT partners with Texas African communities to strengthen cultural exchange and mutual support initiatives.",
      category: "Partnership",
    },
    {
      title: "Scholarship Fund Established for Ivorian Students",
      date: "January 10, 2025",
      excerpt: "Thanks to generous donations from our members, AIT launches a scholarship program to support Ivorian students pursuing higher education in Texas.",
      category: "Education",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              News & Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay informed about the latest happenings in the Ivorian community
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {newsItems.map((item, index) => (
                <Card
                  key={index}
                  className="hover:shadow-warm transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold px-3 py-1 bg-gradient-primary text-white rounded-full">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.excerpt}</p>
                    <button className="mt-4 text-primary font-semibold hover:underline">
                      Read More →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
