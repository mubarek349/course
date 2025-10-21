"use client";
import Link from "next/link";
import { Facebook, Mail, Phone, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Darulkubra</h3>
            <p className="text-slate-400 dark:text-slate-300 text-sm">
              Empowering students worldwide to learn and understand the Holy
              Quran.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#features"
                  className="hover:text-sky-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#courses"
                  className="hover:text-sky-400 transition-colors"
                >
                  Curriculum
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="hover:text-sky-400 transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-sky-400 transition-colors">
                  Enroll Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Social Media</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://www.facebook.com/share/1ErhYdzUn3/?mibextid=wwXIfr" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </Link>
              </li>
              <li>
                <Link href="https://www.tiktok.com/@darulkubraofficial?_t=ZM-90jD1IIkdoZ&_r=1" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <span className="text-sm">TikTok</span>
                </Link>
              </li>
              <li>
                <Link href="t.me/darulkubraa" className="hover:text-sky-400 transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Telegram</span>
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-400" />
                <a
                  href="mailto:info@darulkubra.com"
                  className="hover:text-sky-400 transition-colors"
                >
                  info@darulkubra.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-sky-400" />
                <a
                  href="tel:+251933807447"
                  className="hover:text-sky-400 transition-colors"
                >
                  +251 982 570 254
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-slate-700 pt-8 text-center text-sm text-slate-400 dark:text-slate-300">
          <p>
            © 2025 Darulkubra. All rights reserved. Made with ❤️ for the Muslim
            Ummah.
          </p>
        </div>
      </div>
    </footer>
  );
}
