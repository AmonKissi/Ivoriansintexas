import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom"; // Ensure this is imported at the top

const Gallery = () => {
  // Using your custom high-quality images from Abidjan
  const galleryItems = [
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/12/Cathedrale-Abj-600x600.jpg",
      title: "St. Paul's Cathedral",
      category: "Architecture",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/12/4-600x600.jpg",
      title: "Plateau Business District",
      category: "Abidjan",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/09/facade-2-600x600.jpg",
      title: "Modern Facades",
      category: "Infrastructure",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/11/Espace-salons-7e-etage-600x600.jpg",
      title: "Luxury Lounge Views",
      category: "Hospitality",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/12/Parc-des-expo-dAbidjan-3-600x600.jpg",
      title: "Abidjan Expo Park",
      category: "Landmarks",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/12/4-1-600x600.jpg",
      title: "Urban Development",
      category: "Plateau",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/12/Palais-de-la-culture-5-600x527.jpg",
      title: "Palais de la Culture",
      category: "Culture",
    },
    {
      image: "https://www.mangalis.com/wp-content/uploads/sites/166/2024/11/DJI_0537-1-600x600.jpg",
      title: "Aerial Abidjan",
      category: "Skyline",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-orange-500/10 via-background to-green-600/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            AIT Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Showcasing the modern beauty and architectural marvels of our home, Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-square bg-muted"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-tight uppercase italic">
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

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center border-2 border-dashed border-primary/20 rounded-[3rem] p-12 bg-background/50">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 italic tracking-tighter uppercase">
              Your Perspective
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              AIT members are travelers and storytellers. Share your own high-quality captures of home with us.
            </p>
            <Link to="/login">
  <button className="bg-green-600 text-white font-black px-12 py-5 rounded-full hover:bg-green-700 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-sm">
    Submit a Photo
  </button>
</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;