// app/contact-us/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, Home, Sparkles, MessageCircle } from "lucide-react";

export default function ContactUsPage() {
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setErr("");

    const form = event.currentTarget;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      setErr("Please fill in all fields.");
      return;
    }
    // simple email check (kept lightweight)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }

    setSending(true);

    const subject = `Message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    // Use window.open to avoid history replacement
    const mailto = `mailto:freakin.pk28@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    const win = window.open(mailto, "_self"); // _self plays nicer on mobile
    if (!win) {
      // fallback if popups blocked
      window.location.href = mailto;
    }

    // Reset UI state after a brief delay (mailto opens mail client)
    setTimeout(() => setSending(false), 1200);
  };

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
      <div className="relative z-10 text-center py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-pink-500" size={40} />
            <h1 className="font-fredoka text-5xl md:text-6xl font-bold text-pink-600 text-shadow-pop">
              Freakin.pk
            </h1>
          </div>

          {/* Title */}
          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="font-quicksand text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about sizing, products, or orders? We'd love to help! Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="relative z-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Contact Info Cards */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-pink-100">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="text-pink-500" size={28} />
                  <h3 className="font-fredoka text-2xl font-bold text-gray-800">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Mail className="text-pink-600" size={22} />
                    </div>
                    <div>
                      <h4 className="font-quicksand font-bold text-gray-800 mb-1">Email Us</h4>
                      <a
                        href="mailto:freakin.pk28@gmail.com"
                        className="font-quicksand text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        freakin.pk28@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Phone className="text-purple-600" size={22} />
                    </div>
                    <div>
                      <h4 className="font-quicksand font-bold text-gray-800 mb-1">Call Us</h4>
                      <a
                        href="tel:+923001234567"
                        className="font-quicksand text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        +92 315 5583796
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MapPin className="text-blue-600" size={22} />
                    </div>
                    <div>
                      <h4 className="font-quicksand font-bold text-gray-800 mb-1">Visit Us</h4>
                      <p className="font-quicksand text-gray-600">
                        Freakin.pk<br />
                        Wah Cantt, Islamabad<br />
                        Pakistan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Hours Card */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="font-fredoka text-2xl font-bold mb-4">
                  Support Hours
                </h3>
                <div className="space-y-3 font-quicksand">
                  <div className="flex justify-between items-center">
                    <span>Monday - Friday</span>
                    <span className="font-bold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Saturday</span>
                    <span className="font-bold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sunday</span>
                    <span className="font-bold">Closed</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-white/90">
                  We aim to reply within 24 hours. For order issues, please include your order ID.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-10 border border-pink-100">
              <div className="text-center mb-8">
                <h3 className="font-fredoka text-3xl font-bold text-gray-800 mb-2">
                  Send a Message
                </h3>
                <p className="font-quicksand text-gray-600">
                  Fill out the form below and we'll get back to you soon
                </p>
              </div>

              {err ? (
                <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-quicksand text-red-700">
                  {err}
                </div>
              ) : null}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Honeypot (simple spam trap) */}
                <input
                  type="text"
                  name="company"
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                {/* Name Input */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    required
                    inputMode="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    id="contact-message"
                    rows="5"
                    required
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 font-quicksand text-center">
                  By contacting us, you agree to our{" "}
                  <a href="/privacy" className="text-pink-600 hover:text-pink-700 font-semibold">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
