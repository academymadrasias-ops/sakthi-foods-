import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Store, ExternalLink } from 'lucide-react';

export default function ContactSection() {
  const mapEmbedUrl = `https://maps.google.com/maps?q=Kumbakonam,TamilNadu,India&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const gmapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=Sakthi+Foods+Kumbakonam+Tamil+Nadu`;

  return (
    <section id="contact-info" className="max-w-7xl mx-auto px-3 py-6 md:px-6 mb-8">
      <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-8 shadow-xs">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#c6f3ed] text-[#0f1111] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#87d8d2]">
              <Store className="w-3.5 h-3.5 text-[#007600]" />
              Visit Our Store
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f1111] tracking-tight font-['Inter']">
              Sakthi Foods Store Location &amp; Contact
            </h2>
            <p className="text-xs text-[#565959] mt-1">
              Located in the heart of traditional organic grain trade in Kumbakonam, Tamil Nadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:+919791795173"
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#0f1111]" />
              <span>Call +91 9791795173</span>
            </a>

            <a
              href="tel:+919443142252"
              className="bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#0f1111]" />
              <span>+91 9443142252</span>
            </a>

            <a
              href="https://wa.me/919791795173?text=Hello%20Sakthi%20Foods,%20I%20have%20an%20inquiry%20regarding%20your%20organic%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Content Grid: Contact Details & Embedded Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Details Column */}
          <div className="space-y-4">
            <div className="bg-[#f7f8f8] p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#c6f3ed] text-[#007600] rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#0f1111] uppercase tracking-wider">
                    Store Address
                  </h3>
                  <p className="text-xs font-bold text-[#0f1111] mt-1">
                    Sakthi Foods
                  </p>
                  <p className="text-xs text-[#565959] leading-relaxed mt-0.5">
                    Kumbakonam, Thanjavur District, Tamil Nadu - 612001, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                <div className="p-2 bg-[#e7f4e8] text-[#007600] rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#0f1111] uppercase tracking-wider">
                    Store Working Hours
                  </h3>
                  <p className="text-xs text-[#0f1111] font-medium mt-1">
                    Monday – Saturday: 8:00 AM – 9:00 PM
                  </p>
                  <p className="text-xs text-[#565959]">
                    Sunday: 9:00 AM – 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-[#0f1111]">Have Bulk / Wholesale Inquiries?</p>
                <p className="text-[11px] text-[#565959]">Contact us directly for bulk organic grain orders.</p>
              </div>
              <a
                href="tel:+919791795173"
                className="bg-[#ffd814] text-[#0f1111] border border-[#fcd200] font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-2xs"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* Embedded Google Maps Column */}
          <div className="bg-[#f7f8f8] rounded-xl overflow-hidden border border-gray-200 flex flex-col h-64 md:h-auto min-h-[250px] relative">
            <iframe
              title="Sakthi Foods Location Map"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="flex-1"
            ></iframe>

            <div className="p-2.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs font-bold">
              <span className="text-[#0f1111] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#007600]" /> Kumbakonam, Tamil Nadu
              </span>
              <a
                href={gmapsDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007600] hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
