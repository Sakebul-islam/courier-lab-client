import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Globe,
  Warehouse,
  Leaf,
  UserCheck,
  Truck,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Odometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";

// Quote form schema & type
const QuoteSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(80, { message: "Name must be under 80 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  weight: z
    .number({ message: "Weight must be a valid number" })
    .positive({ message: "Weight must be greater than 0" })
    .max(1000, { message: "Weight must be ≤ 1000 kg" }),
});

export type QuoteForm = z.infer<typeof QuoteSchema>;

export default function Home() {
  // Quote form setup
  const quoteForm = useForm<QuoteForm>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      name: "",
      email: "",
      weight: 0,
    } satisfies QuoteForm,
    mode: "onTouched",
  });

  // Handle quote form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onQuoteSubmit(values: QuoteForm) {
    setIsSubmitting(true);
    console.log("Form submitted with values:", values);
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate a random success/error response for demo purposes
    // const isSuccess = Math.random() > 0.2; // 80% success chance

    if (Math.random() > 0.2) {
      toast.success("Quote request sent!", {
        description:
          "We've received your details and will get back to you shortly.",
      });
      quoteForm.reset(); // Clear form on success
    } else {
      toast.error("Submission failed", {
        description:
          "Something went wrong. Please check your details and try again.",
      });
    }
  }

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Logistics Network",
      description:
        "Seamlessly connect to our extensive network for reliable shipping across continents.",
    },
    {
      icon: <Warehouse className="h-8 w-8 text-primary" />,
      title: "Smart Warehouse Solutions",
      description:
        "Optimize your inventory with our automated warehousing and fulfillment services.",
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Eco-Friendly Shipping",
      description:
        "Reduce your carbon footprint with our sustainable logistics and green packaging options.",
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "Dedicated Account Management",
      description:
        "Get personalized support and strategic advice from your own dedicated logistics expert.",
    },
  ];

  const stats = [
    {
      number: 250000,
      suffix: "+",
      label: "Parcels Delivered Monthly",
      decimals: 0,
    },
    { number: 1500, suffix: "+", label: "Business Partners", decimals: 0 },
    { number: 99.9, decimals: 1, suffix: "%", label: "Delivery Success Rate" },
    { number: 50, suffix: "+", label: "Global Warehouses", decimals: 0 },
  ];

  // Slider logic for brands section
  const brandsRef = useRef<HTMLDivElement | null>(null);
  const scrollBrands = (dir: "left" | "right") => {
    const el = brandsRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Odometer animation trigger
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSlide((slide + 1) % 5), 5000);
    return () => clearTimeout(timer);
  }, [slide]);

  const prev = () => setSlide((slide - 1 + 5) % 5);
  const next = () => setSlide((slide + 1) % 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero/Banner Slider Section */}
      <section className="relative flex items-center justify-center min-h-screen bg-black/80 overflow-hidden">
        <img
          src={(() => {
            const slides = [
              {
                image:
                  "https://cdn.pixabay.com/photo/2023/02/21/05/47/rain-7803539_1280.jpg",
                headline: "Fast & Secure Parcel Delivery",
                description:
                  "Experience lightning-fast parcel delivery with real-time tracking, secure handling, and nationwide coverage. Your trusted partner for all shipping needs.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2022/04/11/18/03/food-delivery-service-7126334_1280.jpg",
                headline: "Food & Essentials Delivered Fresh",
                description:
                  "From groceries to gourmet meals, we ensure your food and essentials arrive fresh, fast, and at your doorstep—rain or shine.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2022/07/28/19/10/courier-7350543_960_720.jpg",
                headline: "Courier Services for Every Need",
                description:
                  "Whether it’s documents, gifts, or urgent parcels, our reliable couriers deliver with care and speed across the city and beyond.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2018/04/19/08/52/city-trans-3332623_960_720.jpg",
                headline: "Urban & Intercity Logistics",
                description:
                  "Seamless city-to-city transport with real-time tracking, optimized routes, and secure handling for all your shipments.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2021/12/28/10/22/person-6898913_1280.jpg",
                headline: "Personalized Delivery Experience",
                description:
                  "Enjoy peace of mind with dedicated support, flexible delivery options, and a service tailored to your unique needs.",
              },
            ];
            return slides[slide].image;
          })()}
          alt={`Banner slide ${slide + 1}`}
          className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-700"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/80 z-10" />
        {/* Slider Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex gap-2">
          {(() => {
            const slides = [
              {
                image:
                  "https://cdn.pixabay.com/photo/2023/02/21/05/47/rain-7803539_1280.jpg",
                headline: "Fast & Secure Parcel Delivery",
                description:
                  "Experience lightning-fast parcel delivery with real-time tracking, secure handling, and nationwide coverage. Your trusted partner for all shipping needs.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2022/04/11/18/03/food-delivery-service-7126334_1280.jpg",
                headline: "Food & Essentials Delivered Fresh",
                description:
                  "From groceries to gourmet meals, we ensure your food and essentials arrive fresh, fast, and at your doorstep—rain or shine.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2022/07/28/19/10/courier-7350543_960_720.jpg",
                headline: "Courier Services for Every Need",
                description:
                  "Whether it’s documents, gifts, or urgent parcels, our reliable couriers deliver with care and speed across the city and beyond.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2018/04/19/08/52/city-trans-3332623_960_720.jpg",
                headline: "Urban & Intercity Logistics",
                description:
                  "Seamless city-to-city transport with real-time tracking, optimized routes, and secure handling for all your shipments.",
              },
              {
                image:
                  "https://cdn.pixabay.com/photo/2021/12/28/10/22/person-6898913_1280.jpg",
                headline: "Personalized Delivery Experience",
                description:
                  "Enjoy peace of mind with dedicated support, flexible delivery options, and a service tailored to your unique needs.",
              },
            ];
            return slides.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full border-2 ${
                  slide === i
                    ? "bg-primary border-primary"
                    : "bg-white/40 border-white/60"
                } transition`}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ));
          })()}
        </div>
        <div className="container relative z-20 px-4 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            {(() => {
              const slides = [
                {
                  image:
                    "https://cdn.pixabay.com/photo/2023/02/21/05/47/rain-7803539_1280.jpg",
                  headline: "Fast & Secure Parcel Delivery",
                  description:
                    "Experience lightning-fast parcel delivery with real-time tracking, secure handling, and nationwide coverage. Your trusted partner for all shipping needs.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2022/04/11/18/03/food-delivery-service-7126334_1280.jpg",
                  headline: "Food & Essentials Delivered Fresh",
                  description:
                    "From groceries to gourmet meals, we ensure your food and essentials arrive fresh, fast, and at your doorstep—rain or shine.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2022/07/28/19/10/courier-7350543_960_720.jpg",
                  headline: "Courier Services for Every Need",
                  description:
                    "Whether it’s documents, gifts, or urgent parcels, our reliable couriers deliver with care and speed across the city and beyond.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2018/04/19/08/52/city-trans-3332623_960_720.jpg",
                  headline: "Urban & Intercity Logistics",
                  description:
                    "Seamless city-to-city transport with real-time tracking, optimized routes, and secure handling for all your shipments.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2021/12/28/10/22/person-6898913_1280.jpg",
                  headline: "Personalized Delivery Experience",
                  description:
                    "Enjoy peace of mind with dedicated support, flexible delivery options, and a service tailored to your unique needs.",
                },
              ];
              return slides[slide].headline;
            })()}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto drop-shadow">
            {(() => {
              const slides = [
                {
                  image:
                    "https://cdn.pixabay.com/photo/2023/02/21/05/47/rain-7803539_1280.jpg",
                  headline: "Fast & Secure Parcel Delivery",
                  description:
                    "Experience lightning-fast parcel delivery with real-time tracking, secure handling, and nationwide coverage. Your trusted partner for all shipping needs.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2022/04/11/18/03/food-delivery-service-7126334_1280.jpg",
                  headline: "Food & Essentials Delivered Fresh",
                  description:
                    "From groceries to gourmet meals, we ensure your food and essentials arrive fresh, fast, and at your doorstep—rain or shine.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2022/07/28/19/10/courier-7350543_960_720.jpg",
                  headline: "Courier Services for Every Need",
                  description:
                    "Whether it’s documents, gifts, or urgent parcels, our reliable couriers deliver with care and speed across the city and beyond.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2018/04/19/08/52/city-trans-3332623_960_720.jpg",
                  headline: "Urban & Intercity Logistics",
                  description:
                    "Seamless city-to-city transport with real-time tracking, optimized routes, and secure handling for all your shipments.",
                },
                {
                  image:
                    "https://cdn.pixabay.com/photo/2021/12/28/10/22/person-6898913_1280.jpg",
                  headline: "Personalized Delivery Experience",
                  description:
                    "Enjoy peace of mind with dedicated support, flexible delivery options, and a service tailored to your unique needs.",
                },
              ];
              return slides[slide].description;
            })()}
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            <strong>Why choose us?</strong>
          </p>
          <ul className="flex flex-wrap justify-center gap-6 mb-10 text-white/90 text-base font-medium">
            <li className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Nationwide & global
              reach
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Secure & insured
              delivery
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> On-time, every time
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Dedicated support
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/track">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 text-background hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow"
            >
              <Link to="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="shadow-none border-none bg-transparent text-center"
              >
                <CardHeader>
                  <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-2 flex justify-center items-baseline">
                    <Odometer
                      value={statsInView ? stat.number : 0}
                      format=",ddd"
                    />
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {stat.suffix}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 items-center gap-12">
            {/* Left: Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6169027/pexels-photo-6169027.jpeg"
                alt="Warehouse logistics with workers and packages"
                className="w-full h-full object-cover aspect-[4/3] bg-muted"
              />
            </div>

            {/* Right: Content */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Your strategic logistics partner
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  We provide end-to-end logistics solutions to help your
                  business scale and succeed.
                </p>
              </div>
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - New Layout */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left: Messaging */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Get a custom shipping quote in minutes
              </h2>
              <p className="text-lg opacity-90 mb-6 max-w-xl">
                Transparent pricing. Real-time tracking. Nationwide coverage.
                Scale your logistics with a partner you can trust.
              </p>
              <ul className="grid gap-3 text-base opacity-95 mb-8">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-2 rounded-sm bg-primary-foreground/80" />
                  Same-day, next-day, and scheduled delivery windows
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-2 rounded-sm bg-primary-foreground/80" />
                  Insurance, COD, fragile handling, and priority service
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-2 rounded-sm bg-primary-foreground/80" />
                  API & dashboard for bulk orders and team workflows
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-lg"
                >
                  <Link to="/track">
                    Track Parcel
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </div>

            {/* Right: Quote form */}
            <Card className="bg-background text-foreground shadow-lg">
              <CardHeader>
                <CardTitle>Request a quick quote</CardTitle>
                <CardDescription>
                  Tell us a few details and we’ll get back with pricing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...quoteForm}>
                  <form
                    onSubmit={quoteForm.handleSubmit(onQuoteSubmit)}
                    className="grid gap-4"
                  >
                    <FormField
                      control={quoteForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={quoteForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jane@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={quoteForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parcel weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="decimal"
                              min={0}
                              step={0.1}
                              placeholder="2.5"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Get my quote"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      By submitting this form you agree to our terms and privacy
                      policy.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Slider */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Trusted by Leading Companies
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our platform is trusted by industry leaders and top e-commerce
              brands.
            </p>
          </div>
          <div className="relative">
            {/* Prev */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1 sm:pl-2">
              <Button
                variant="outline"
                size="icon"
                className="pointer-events-auto bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                onClick={() => scrollBrands("left")}
                aria-label="Scroll brands left"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            {/* Next */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2">
              <Button
                variant="outline"
                size="icon"
                className="pointer-events-auto bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                onClick={() => scrollBrands("right")}
                aria-label="Scroll brands right"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div
              ref={brandsRef}
              className="overflow-x-auto no-scrollbar scroll-smooth"
            >
              <div className="flex items-stretch gap-6 sm:gap-8 pr-2 snap-x snap-mandatory">
                {[
                  { l: "A", n: "Amazon" },
                  { l: "S", n: "Shopify" },
                  { l: "W", n: "WooCommerce" },
                  { l: "M", n: "Magento" },
                  { l: "E", n: "eBay" },
                  { l: "W", n: "Walmart" },
                  { l: "F", n: "FedEx" },
                  { l: "D", n: "DHL" },
                  { l: "U", n: "UPS" },
                  { l: "S", n: "Stripe" },
                  { l: "P", n: "PayPal" },
                  { l: "G", n: "Google" },
                  { l: "A", n: "Apple" },
                  { l: "M", n: "Microsoft" },
                ].map((b) => (
                  <div
                    key={b.n}
                    className="snap-start shrink-0 w-[160px] sm:w-[180px]"
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-white shadow mb-2 w-16 h-16 rounded-md grid place-items-center">
                        <span className="text-3xl font-bold text-muted-foreground">
                          {b.l}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-muted-foreground">
                        {b.n}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
