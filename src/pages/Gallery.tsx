import Header from "@/components/Header";
import Footer from "@/components/Footer";
import cultureImage from "@/assets/culture-celebration.jpg";
import heroImage from "@/assets/hero-community.jpg";

const Gallery = () => {
  // Placeholder gallery - in production, these would be actual event photos
  const galleryItems = [
    {
      image: cultureImage,
      title: "Independence Day Celebration 2024",
      category: "Cultural Events",
    },
    {
      image: heroImage,
      title: "Community Gathering",
      category: "Social Events",
    },
    {
      image: cultureImage,
      title: "Cultural Night Gala",
      category: "Cultural Events",
    },
    {
      image: heroImage,
      title: "Family Cookout",
      category: "Social Events",
    },
    {
      image: cultureImage,
      title: "Traditional Dance Performance",
      category: "Cultural Events",
    },
    {
      image: heroImage,
      title: "Youth Program Launch",
      category: "Community Programs",
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
              Photo Gallery
            </h1>
            <p className="text-xl text-muted-foreground">
              Capturing the vibrant moments and beautiful memories of our AIT family
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl shadow-elegant hover:shadow-warm transition-all duration-300 aspect-square"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-sm font-semibold mb-2 text-accent">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section Placeholder */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Event Videos Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're working on creating a video gallery to share highlights from our amazing events. 
              Check back soon for dance performances, speeches, and memorable moments!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
