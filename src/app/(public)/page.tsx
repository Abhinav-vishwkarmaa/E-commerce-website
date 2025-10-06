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
    <section className="min-h-screen bg-gradient-to-br bg-yellow-500 to-pink-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

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
