import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

export const HomeFooter = () => {
  return (
    <footer className="bg-neutral-100 text-center text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left mt-10">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold">Malt</h2>
            <p className="mt-2 text-sm">
              Your favorite meals, delivered fast & fresh.
            </p>
          </div>

          {/* Explore Section */}
          <div className="ml-6">
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="hover:text-red-800">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-800">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-800">
                  How to Order?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-800">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-lg  font-semibold">Contact</h3>
            <p className="mt-2 text-sm">
              <Email className="mr-2" fontSize="small" /> support@malt.com
            </p>
            <p className="text-sm">
              <Phone className="mr-2" fontSize="small" /> +977 - 980654321
            </p>
            <p className="text-sm">
              <LocationOn className="mr-2" fontSize="small" /> 123 Food Street,
              Pokhara
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-3 justify-center md:justify-start">
              <a href="#" className="text-gray-700 hover:text-red-800">
                <Facebook fontSize="medium" />
              </a>
              <a href="#" className="text-gray-700 hover:text-red-800">
                <Twitter fontSize="medium" />
              </a>
              <a href="#" className="text-gray-700 hover:text-red-800">
                <Instagram fontSize="medium" />
              </a>
              <a href="#" className="text-gray-700 hover:text-red-800">
                <LinkedIn fontSize="medium" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-6 pt-4 text-sm text-center">
          &copy; 2025 Malt. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
