"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fix hydration error by ensuring consistent rendering on the client and server
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    isClient && (
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Hotel <span className="text-indigo-600">Usha Vatika</span>
            </h1>
            {/* Hamburger Menu */}
            <button
              className="block md:hidden text-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
            {/* Navigation Links for Desktop */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-6">
                <li>
                  <a
                    href="#home"
                    className="text-gray-800 hover:text-indigo-600 transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#rooms"
                    className="text-gray-800 hover:text-indigo-600 transition"
                  >
                    Rooms
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-800 hover:text-indigo-600 transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-800 hover:text-indigo-600 transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-x-0 bottom-0 bg-white shadow-lg border-t border-gray-200 p-6 z-50">
            <nav>
              <ul className="flex flex-col items-center gap-4">
                <li>
                  <a
                    href="#home"
                    className="text-gray-800 hover:text-indigo-600 transition"
                    onClick={toggleMenu}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#rooms"
                    className="text-gray-800 hover:text-indigo-600 transition"
                    onClick={toggleMenu}
                  >
                    Rooms
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-800 hover:text-indigo-600 transition"
                    onClick={toggleMenu}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-800 hover:text-indigo-600 transition"
                    onClick={toggleMenu}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Hero Section */}
        <section
          id="home"
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-24 text-center"
        >
          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500">
              Hotel Usha Vatika
            </span>
          </h1>
          <p className="mt-4 text-lg">
            Discover luxury, comfort, and elegance in the heart of Lakhisarai,
            Bihar. Book your stay now!
          </p>
          <button className="mt-6 px-8 py-3 bg-white text-indigo-600 rounded-full shadow-lg font-semibold hover:bg-yellow-300 transition">
            Book Now
          </button>
        </section>

        {/* Featured Rooms Section */}
        <section id="rooms" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Featured Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Room 1 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Deluxe Room"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Deluxe Room
                  </h3>
                  <p className="text-gray-600">A spacious room with a king bed.</p>
                  <p className="mt-2 text-indigo-600 font-bold">₹1500/night</p>
                </div>
              </div>
              {/* Room 2 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Premium Room"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Premium Room
                  </h3>
                  <p className="text-gray-600">
                    Luxury with premium amenities.
                  </p>
                  <p className="mt-2 text-indigo-600 font-bold">₹2500/night</p>
                </div>
              </div>
              {/* Room 3 */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Suite Room"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Suite Room
                  </h3>
                  <p className="text-gray-600">Elegant and spacious suites.</p>
                  <p className="mt-2 text-indigo-600 font-bold">₹3500/night</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">About Us</h2>
            <p className="text-gray-600">
              Located in the serene surroundings of Lakhisarai, Hotel Usha Vatika
              offers the perfect blend of luxury and affordability.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h2>
            <p className="text-gray-600">
              Have questions? Reach out to us at{" "}
              <a
                href="mailto:contact@usha-vatika.com"
                className="text-indigo-600 underline"
              >
                contact@usha-vatika.com
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    )
  );
}
