// app/about-us/page.jsx

"use client";

import Link from "next/link";
import { Sparkles, Home, Heart, ShoppingBag, Users, Leaf, Award, TrendingUp, Package } from "lucide-react";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Home Button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-pink-600 font-quicksand font-bold rounded-full border-2 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 shadow-lg backdrop-blur-sm">
          <Home size={18} />
          <span className="hidden sm:inline">Home</span>
        </button>
      </Link>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="text-pink-500" size={50} />
            <h1 className="font-fredoka text-6xl md:text-7xl font-bold text-pink-600 text-shadow-pop">
              Freakin.pk
            </h1>
          </div>

          {/* Tagline */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-pink-300 bg-white/80 backdrop-blur-sm px-5 py-2 mb-8 shadow-lg">
            <Award className="text-pink-500" size={20} />
            <span className="font-quicksand font-semibold text-gray-700">
              Since 2025 — Your Trusted Shopping Partner
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Shopping Made Simple, Fun & Affordable
          </h2>
          <p className="font-quicksand text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            We're passionate about bringing you the best products with exceptional service, amazing prices, and a shopping experience you'll love.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                <ShoppingBag size={20} />
                Start Shopping
              </button>
            </Link>
            <Link href="/categories">
              <button className="px-8 py-4 bg-white hover:bg-gray-50 text-pink-600 font-quicksand font-bold rounded-xl border-2 border-pink-300 hover:border-pink-400 transition-all duration-300 shadow-lg">
                Browse Categories
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Mission */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-10 border border-pink-100">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="text-pink-500" size={32} />
                <h3 className="font-fredoka text-3xl font-bold text-gray-800">
                  Our Mission
                </h3>
              </div>
              <p className="font-quicksand text-gray-700 leading-relaxed mb-6">
                At Freakin.pk, our mission is to make quality products accessible to everyone. We believe shopping should be easy, enjoyable, and affordable. That's why we carefully curate our collection, verify every product, and ensure you get the best value for your money.
              </p>

              <div className="space-y-3">
                <h4 className="font-quicksand font-bold text-gray-800 mb-3">What We Stand For:</h4>
                {[
                  "Quality products at fair prices",
                  "Honest product descriptions & reviews",
                  "Fast shipping & reliable service",
                  "Customer satisfaction first"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0"></div>
                    <span className="font-quicksand text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="font-fredoka text-3xl font-bold mb-6">Our Impact</h3>
                <p className="font-quicksand mb-6">
                  Here's how our amazing community has made a difference:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard value="50K+" label="Happy Customers" />
                  <StatCard value="100K+" label="Products Sold" />
                  <StatCard value="4.8★" label="Average Rating" />
                  <StatCard value="99%" label="Satisfaction Rate" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-pink-100 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-pink-600" size={24} />
                    </div>
                  </div>
                  <div className="font-fredoka text-xl font-bold text-gray-800 mb-1">Growing Fast</div>
                  <p className="font-quicksand text-sm text-gray-600">New products daily</p>
                </div>
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-pink-100 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="text-purple-600" size={24} />
                    </div>
                  </div>
                  <div className="font-fredoka text-xl font-bold text-gray-800 mb-1">Community</div>
                  <p className="font-quicksand text-sm text-gray-600">Join thousands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="font-fredoka text-4xl font-bold text-gray-800 mb-4">
              How Freakin.pk Works
            </h3>
            <p className="font-quicksand text-lg text-gray-600">
              Shopping with us is as easy as 1-2-3!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              number="1"
              title="Browse & Discover"
              description="Explore our carefully curated collection of amazing products across various categories."
              icon={<ShoppingBag size={28} />}
              color="pink"
            />
            <StepCard
              number="2"
              title="Safe & Secure Checkout"
              description="Add to cart and checkout securely. We protect your information and ensure safe transactions."
              icon={<Package size={28} />}
              color="purple"
            />
            <StepCard
              number="3"
              title="Fast Delivery"
              description="Track your order and receive it quickly. Not satisfied? Easy returns within 7 days."
              icon={<TrendingUp size={28} />}
              color="blue"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="font-fredoka text-4xl font-bold text-gray-800 mb-4">
              Our Values
            </h3>
            <p className="font-quicksand text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ValueCard
              title="Customer First"
              description="Your satisfaction is our top priority. We go above and beyond to ensure you have the best shopping experience."
            />
            <ValueCard
              title="Quality Assured"
              description="Every product is carefully selected and verified to meet our high standards of quality."
            />
            <ValueCard
              title="Transparent Pricing"
              description="No hidden fees, no surprises. What you see is what you pay—fair and simple."
            />
            <ValueCard
              title="Fast & Reliable"
              description="From browsing to delivery, we ensure a smooth and speedy experience every time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 border border-pink-100 text-center">
            <Sparkles className="text-pink-500 mx-auto mb-6" size={48} />
            <h3 className="font-fredoka text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ready to Start Shopping?
            </h3>
            <p className="font-quicksand text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who trust Freakin.pk for their shopping needs. Discover amazing products today!
            </p>
            <Link href="/">
              <button className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg">
                Explore Our Catalog
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Helper Components */

function StatCard({ value, label }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
      <div className="font-fredoka text-3xl font-bold mb-1">{value}</div>
      <div className="font-quicksand text-sm">{label}</div>
    </div>
  );
}

function StepCard({ number, title, description, icon, color }) {
  const colorClasses = {
    pink: "bg-pink-100 text-pink-600 border-pink-200",
    purple: "bg-purple-100 text-purple-600 border-purple-200",
    blue: "bg-blue-100 text-blue-600 border-blue-200"
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-pink-100">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="font-fredoka text-sm font-bold text-gray-400 mb-2">STEP {number}</div>
      <h4 className="font-fredoka text-2xl font-bold text-gray-800 mb-3">{title}</h4>
      <p className="font-quicksand text-gray-600">{description}</p>
    </div>
  );
}

function ValueCard({ title, description }) {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-pink-100">
      <h4 className="font-fredoka text-2xl font-bold text-gray-800 mb-3">{title}</h4>
      <p className="font-quicksand text-gray-600">{description}</p>
    </div>
  );
}
