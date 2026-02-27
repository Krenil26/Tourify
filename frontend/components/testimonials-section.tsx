"use client"

import { Star, Quote, Leaf } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Eco-Traveler",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=80",
    content:
      "Tourify's AI found me the most serene forest cabins. It's like the app knows exactly where my soul needs to rest.",
    rating: 5,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    name: "Marcus Johnson",
    role: "Mountain Guide",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&q=80",
    content:
      "The trail recommendations are spot on. I've discovered pristine lakes that aren't even on most tourist maps.",
    rating: 5,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    name: "Emma Wilson",
    role: "Soul Seeker",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&q=80",
    content:
      "Planning a nature retreat used to be stressful. Now it's a breath of fresh air. This is travel as it should be.",
    rating: 5,
    gradient: "from-teal-400 to-emerald-600",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background via-emerald-500/5 to-background overflow-hidden">

      {/* Background Ornament */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="nature-leaf w-96 h-96 absolute -top-20 -left-20 rotate-45 text-emerald-500" />
        <div className="nature-leaf w-96 h-96 absolute -bottom-20 -right-20 -rotate-12 text-teal-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-600">Traveler Log</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Voice of the <span className="text-nature-gradient">Earth Explorers</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Join a community dedicated to mindful exploration and deep connection with our planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-panel rounded-[2.5rem] p-8 relative shadow-xl card-hover group transition-all duration-500 hover:-translate-y-2 border-emerald-500/5"
            >
              <div
                className={`absolute top-8 right-8 w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonial.gradient} opacity-10 flex items-center justify-center group-hover:opacity-20 transition-opacity`}
              >
                <Quote className="w-6 h-6 text-foreground" />
              </div>

              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>

              <p className="text-foreground/80 mb-8 leading-relaxed font-medium italic">"{testimonial.content}"</p>

              <div className="flex items-center gap-4">
                <div className={`p-0.5 rounded-full bg-gradient-to-br ${testimonial.gradient}`}>
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-4 border-background"
                  />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">{testimonial.name}</div>
                  <div
                    className={`text-sm bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent font-bold uppercase tracking-wider`}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
