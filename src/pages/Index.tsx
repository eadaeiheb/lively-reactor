import NavigationMenu from "../components/NavigationMenu";
import HeroSection from "../components/HeroSection";
import ContentSection from "../components/ContentSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <NavigationMenu />
      <HeroSection />
      <ContentSection />
    </main>
  );
};

export default Index;