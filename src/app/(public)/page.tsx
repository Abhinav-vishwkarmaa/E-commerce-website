// import Navbar from './navbar';
// import Categories from './categories';
// import HeroSelection from './hero-selection';
// import PriceSaver from './price-saver';
// import TrendingProducts from './trending-product';
import Navbar from "./home/navbar";
import HeroSelection from "./home/hero-selection";
import Categories from "./home/categories";
import PriceSaver from "./home/price-saver"; 
import TrendingProducts from "./home/trending-product";

export default function HomePage() {
  return (
    <section className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      <div className="relative z-10">
        <div id="hero">
          <HeroSelection />
        </div>
        <div id="trending">
          <TrendingProducts />
        </div>
        <div id="categories">
          <Categories />
        </div>
        <div id="pricesaver">
          <PriceSaver />
        </div>
      </div>
    </section>
  );
}
