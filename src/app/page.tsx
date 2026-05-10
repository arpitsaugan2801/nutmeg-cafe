"use client";

import HeroScrollVideo from "@/components/HeroScrollVideo";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, Star, Coffee, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { submitReservation } from "@/actions/sendEmail";
const menuItems = [
  {
    name: "Wood-Fired Pizza",
    desc: "Authentic thin crust baked in our traditional wood-fired oven with fresh, premium toppings.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Honey Chilli Potatoes",
    desc: "Crispy fried potatoes tossed in our signature sweet and spicy honey chilli glaze.",
    image: "https://www.sharmispassions.com/wp-content/uploads/2015/04/chilli-potato-recipe3.jpg" // <-- Replaced the concert with crispy potatoes!
  },
  {
    name: "Signature Hot Chocolate",
    desc: "Rich, thick, and velvety smooth Belgian hot chocolate, perfect for a cozy afternoon.",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=800&auto=format&fit=crop"
  }
];

const reviewsData = [
  { text: "Ganesh is the sweetest boy here! Love the vibes.", author: "Priyanka S." },
  { text: "The art session was super fun and productive, the food was amazing.", author: "Shruti L." },
  { text: "Roma handled the management really well. Highly recommend!", author: "Anushka B." },
  { text: "Incredible hospitality by Adhiraj. Top notch service.", author: "Advika G." }
];

export default function Home() {
  // 1. Ref for the scroll animation
  const heroRef = useRef<HTMLElement>(null);

  // 2. Scroll progress math
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // 3. State for booking and carousels
  const [selectedDate, setSelectedDate] = useState(""); 
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  const [artIndex, setArtIndex] = useState(0);

  // 4. Time Slot Logic: Filters out past times if "Today" is selected
  const getTimeSlots = () => {
    const allSlots = [
      { label: "11:00 AM", value: "11:00 AM", hour: 11 },
      { label: "01:00 PM", value: "1:00 PM", hour: 13 },
      { label: "03:00 PM", value: "3:00 PM", hour: 15 },
      { label: "05:00 PM", value: "5:00 PM", hour: 17 },
      { label: "07:00 PM", value: "7:00 PM", hour: 19 },
      { label: "09:00 PM", value: "9:00 PM", hour: 21 },
    ];

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    if (selectedDate === todayString) {
      const currentHour = today.getHours();
      // Only show slots that haven't started yet
      return allSlots.filter(slot => slot.hour > currentHour);
    }
    return allSlots;
  };

  const availableSlots = getTimeSlots();

  // 5. Carousel Images & Handlers
  const artImages = [
    "https://images.squarespace-cdn.com/content/v1/64ff1596bf78f9494792a3d3/1706623500082-5BWDZ4DJGZUO9G3CF7IL/y1ROqIcJHWc.jpg?format=500w",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop"
  ];

  const nextArt = () => setArtIndex((prev) => (prev + 1) % artImages.length);
  const prevArt = () => setArtIndex((prev) => (prev - 1 + artImages.length) % artImages.length);
  const nextMenu = () => setMenuIndex((prev) => (prev + 1) % menuItems.length);
  const prevMenu = () => setMenuIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);

  // 6. Form Submission Handler
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitReservation(formData);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      alert("Failed to send booking. Check the console.");
    }
  };

  // --- BRAIN ENDS HERE ---

  return (
      <main className="min-h-screen w-full bg-[var(--color-coffee)] text-[#FFFDD0]">
      
      {/* 1. HERO SECTION (STICKY SCROLL) */}
      <section ref={heroRef} className="relative h-[300vh] w-full bg-[var(--color-coffee)]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          <div className="absolute inset-0 z-0 bg-black">
            <HeroScrollVideo progress={scrollYProgress} />
          </div>

          <header className="absolute top-0 left-0 right-0 z-20 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#FFFDD0] drop-shadow-md">
              <Coffee size={32} />
              <span className="uppercase tracking-widest">NUTMEG café</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium text-[#FFFDD0]/90 drop-shadow-md">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#workshops" className="hover:text-white transition-colors">Art Workshops</a>
              <a href="#menu" className="hover:text-white transition-colors">Menu</a>
            </nav>
          </header>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
            <div className="max-w-4xl mx-auto flex flex-col items-center pointer-events-auto mt-20">
              <h1
                className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-[#FFFDD0] mb-8 text-center"
                style={{ textShadow: "0px 10px 30px rgba(0,0,0,0.9)" }}
              >
                The Best Art & Pottery Cafe.
              </h1>
              <button onClick={() => setIsBookingOpen(true)} className="bg-[var(--color-emerald-accent)] hover:bg-[var(--color-emerald-hover)] text-white font-medium py-4 px-10 rounded-full shadow-2xl transition-all hover:-translate-y-1 text-lg border border-white/20 mt-6">
                Book a Session
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Art Workshops Section */}
      <section id="workshops" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Side: The Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold">Creative Escapes</h2>
          <p className="text-lg text-[var(--color-cream)]/80 leading-relaxed">
            Dive into the world of Blue Pottery and Canvas Painting. Widely recognized as the best creative escape for couples in Vaishali Nagar, our guided sessions let you create masterpieces while sipping our signature blends.
          </p>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="inline-block bg-[var(--color-emerald-accent)] hover:bg-[var(--color-emerald-hover)] text-white font-medium py-3 px-8 rounded-full transition-all"
          >
            Book a Workshop
          </button>
        </motion.div>

        {/* Right Side: The Image Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full relative group"
        >
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FFFDD0]/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={`art-${artIndex}`}
                src={artImages[artIndex]}
                alt="Art Workshop Experience"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Left/Right Navigation Buttons */}
            <button
              onClick={prevArt}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-[var(--color-emerald-accent)] p-3 rounded-full backdrop-blur-md transition-all text-white shadow-lg opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextArt}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-[var(--color-emerald-accent)] p-3 rounded-full backdrop-blur-md transition-all text-white shadow-lg opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Cafe Menu Section (Carousel) */}
      <section id="menu" className="relative z-10 py-24 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center border-t border-[var(--color-cream)]/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold">A Culinary Delight</h2>
          <p className="text-lg text-[var(--color-cream)]/80 leading-relaxed mt-4">
            Explore our carefully crafted fan favorites that keep our guests coming back for more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-cream)]/10 bg-[var(--color-espresso)]"
        >
          <div className="relative w-full aspect-video bg-black/20">
            <AnimatePresence mode="wait">
              <motion.img
                key={`img-${menuIndex}`}
                /* 👇 The Fallback: If menuIndex breaks, show index 0! */
                src={menuItems[menuIndex]?.image || menuItems[0].image}
                alt={menuItems[menuIndex]?.name || menuItems[0].name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <button onClick={prevMenu} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-[var(--color-emerald-accent)] p-3 rounded-full backdrop-blur-md transition-all text-white shadow-lg"><ChevronLeft size={28} /></button>
            <button onClick={nextMenu} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-[var(--color-emerald-accent)] p-3 rounded-full backdrop-blur-md transition-all text-white shadow-lg"><ChevronRight size={28} /></button>
          </div>

          <div className="p-8 md:p-10 text-center relative z-20 bg-[var(--color-espresso)] min-h-[180px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${menuIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-heading text-3xl font-bold mb-4">{menuItems[menuIndex].name}</h3>
                <p className="text-lg text-[var(--color-cream)]/80 max-w-2xl mx-auto">{menuItems[menuIndex].desc}</p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto">
              {menuItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMenuIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === menuIndex ? 'bg-[var(--color-emerald-accent)]' : 'bg-[var(--color-cream)]/20'}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Reviews Section / Footer Marquee */}
      <footer id="reviews" className="relative z-10 w-full bg-[var(--color-espresso)] py-16 border-t border-[var(--color-cream)]/10">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center">
          <h3 className="font-heading text-3xl font-bold text-[var(--color-cream)]">What Our Guests Say</h3>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-espresso)] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-espresso)] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-8 px-4 animate-[marquee_40s_linear_infinite] whitespace-nowrap items-center w-max">
            {reviewsData.map((review, i) => <ReviewCard key={i} text={review.text} author={review.author} />)}
            {reviewsData.map((review, i) => <ReviewCard key={i + 4} text={review.text} author={review.author} />)}
            {reviewsData.map((review, i) => <ReviewCard key={i + 8} text={review.text} author={review.author} />)}
          </div>
        </div>
      </footer>

      {/* Footer */}
      <footer className="w-full py-12 mt-20 border-t border-[var(--color-cream)]/20 bg-[var(--color-coffee)] text-[var(--color-cream)] relative z-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight">
              <Coffee size={28} />
              <span className="uppercase tracking-widest">NUTMEG café</span>
            </div>
            <p className="text-[var(--color-cream)]/80 text-sm max-w-xs">
              The premier art and cafe experience in Jaipur.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-lg">Visit Us</h4>
            <div className="text-[var(--color-cream)]/80 text-sm space-y-2">
              <p>Gandhi Path West, Vaishali Nagar, Jaipur</p>
              <p>Open Daily: 11:00 AM - 11:00 PM</p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-lg">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[#FFFDD0] hover:text-[var(--color-emerald-accent)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" className="text-[#FFFDD0] hover:text-[var(--color-emerald-accent)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="text-[#FFFDD0] hover:text-[var(--color-emerald-accent)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--color-cream)]/10 text-center text-[var(--color-cream)]/60 text-sm">
          © 2024 Nutmeg Cafe & Restaurant. All rights reserved.
        </div>
      </footer>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsBookingOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[var(--color-coffee)] text-[var(--color-cream)] p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-[var(--color-cream)]/20"
            >
              <button
                onClick={() => { setIsBookingOpen(false); setIsSubmitted(false); }}
                className="absolute top-6 right-6 text-[var(--color-cream)]/50 hover:text-[var(--color-cream)] transition-colors"
              >
                <X size={24} />
              </button>

              {!isSubmitted ? (
                <>
                  <h2 className="font-heading text-3xl font-bold mb-2">Reserve a Session</h2>
                  <form className="space-y-5 font-sans mt-6" onSubmit={handleBookingSubmit}>
  {/* Full Name */}
  <div>
    <label className="block text-sm font-medium mb-1.5 text-[var(--color-cream)]/90">Full Name</label>
    <input type="text" name="name" required placeholder="Jane Doe" className="w-full bg-[var(--color-espresso)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-emerald-accent)] transition-colors" />
  </div>

  {/* Phone Number */}
  <div>
    <label className="block text-sm font-medium mb-1.5 text-[var(--color-cream)]/90">Phone Number</label>
    <input type="tel" name="phone" required placeholder="+91 98765 43210" className="w-full bg-[var(--color-espresso)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-emerald-accent)] transition-colors" />
  </div>

  {/* Date & Time Grid */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1.5 text-[var(--color-cream)]/90">Date</label>
      <input 
        type="date" 
        name="date" 
        required 
        onChange={(e) => setSelectedDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="w-full bg-[var(--color-espresso)]/50 border border-[#FFFDD0]/20 rounded-xl px-4 py-3 text-[#FFFDD0] [color-scheme:dark]" 
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1.5 text-[#FFFDD0]/90">Time Slot</label>
      <select name="time" required className="w-full bg-[var(--color-espresso)]/50 border border-[#FFFDD0]/20 rounded-xl px-4 py-3 text-[#FFFDD0]">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>{slot.label}</option>
          ))
        ) : (
          <option value="" disabled>No sessions left today</option>
        )}
      </select>
    </div>
  </div>

  {/* 👇 RESTORED: Session Type Dropdown */}
  <div>
    <label className="block text-sm font-medium mb-1.5 text-[var(--color-cream)]/90">Session Type</label>
    <select name="sessionType" required className="w-full bg-[var(--color-espresso)]/50 border border-[var(--color-cream)]/20 rounded-xl px-4 py-3 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-emerald-accent)] transition-colors">
      <option value="clay_pottery">Clay Pottery Session</option>
      <option value="art_session">Art / Painting Session</option>
      <option value="both">Both (Combo)</option>
    </select>
  </div>

  <button type="submit" className="w-full bg-[var(--color-emerald-accent)] hover:bg-emerald-600 text-white font-medium py-4 rounded-xl shadow-lg mt-4 transition-all">
    Submit Reservation
  </button>
</form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <CheckCircle size={72} className="text-[var(--color-emerald-accent)] mb-6" />
                  <h2 className="font-heading text-3xl font-bold mb-4">Booking Confirmed!</h2>
                  <button onClick={() => { setIsSubmitted(false); setIsBookingOpen(false); }} className="w-full bg-[var(--color-emerald-accent)] text-white font-medium py-4 rounded-xl mt-8">Done</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ReviewCard({ text, author }: { text: string; author: string }) {
  return (
    <div className="flex flex-col gap-2 bg-[var(--color-coffee)]/50 px-8 py-6 rounded-2xl shadow-sm border border-[var(--color-cream)]/10 shrink-0 min-w-[320px]">
      <div className="flex gap-1 shrink-0 mb-1">
        {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-[var(--color-emerald-accent)] text-[var(--color-emerald-accent)]" />)}
      </div>
      <p className="text-base font-medium text-[var(--color-cream)]/90 font-sans italic">"{text}"</p>
      <span className="text-sm font-bold text-[var(--color-cream)] mt-2">— {author}</span>
    </div>
  );
}
