import { Link } from "react-router-dom";

const Hero = () => {
  return (
   <section className="bg-green-200 text-green-950 py-12 sm:py-16 lg:py-24 bg-mobile-sm-only">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-y-10 lg:gap-y-0 lg:gap-x-12 items-center">
    {/* ───── text ───── */}
    <div className="lg:col-span-2 space-y-6">
      <p className="font-[ubuntu] leading-tight text-3xl sm:text-5xl lg:text-6xl xl:text-5xl">
        Fill Your Cart Without Leaving Home
      </p>

      <p className="text-base sm:text-lg lg:text-xl xl:text-xl max-w-2xl leading-relaxed">
        Discover a vast selection of quality products, including fresh groceries and everyday essentials, all available at your fingertips. Enjoy fast, reliable delivery that brings convenience and savings straight to your doorstep.
      </p>

      <Link
        to="/products"
        className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 no-underline rounded-lg border-2 border-green-950 font-semibold text-green-950 hover:bg-green-950 hover:text-white transition"
      >
        Get Started
      </Link>
    </div>

    {/* ───── image ───── */}
    <div className="hidden md:flex justify-center lg:justify-end">
      <img
        src="https://static.vecteezy.com/system/resources/previews/048/560/469/non_2x/shopping-cart-filled-with-grocery-items-and-vegetables-isolated-on-a-transparent-background-png.png"
        alt="Shopping cart"
        className="w-64 sm:w-80 lg:w-full max-w-md object-contain"
      />
    </div>
  </div>
</section>

  );
};

export default Hero;
