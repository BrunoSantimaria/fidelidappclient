import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { FadeIn } from "@/landing/components/animations/FadeIn";
import { testimonials } from "@/data/testimonials";
import { useNavigateTo } from "@/hooks/useNavigateTo";

export const Testimonials = ({ refs }) => {
  return (
    <div className='py-24 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <FadeIn>
          <div className='text-center'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>Testimonios</h2>
            <p className='mt-2 text-4xl font-extrabold text-main sm:text-5xl'>Lo que dicen nuestros clientes</p>
            <p className='mt-4 text-xl text-gray-500 max-w-3xl mx-auto'>Descubre cómo Fidelidapp está transformando negocios en diferentes industrias</p>
          </div>
        </FadeIn>

        <div className='mt-20 grid gap-8 lg:grid-cols-3'>
          {testimonials.map((testimonial, index) => (
            <FadeIn key={index} delay={index * 0.2}>
              <motion.div className='bg-white rounded-2xl shadow-lg p-8 relative' whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                {/* Quote Icon */}
                <div className='absolute -top-10 right-10'>
                  <div className='bg-main rounded-full p-4'>
                    <Quote className='h-6 w-6 text-white' />
                  </div>
                </div>

                {/* Rating */}
                <div className='flex mb-6'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='h-5 w-5 text-yellow-400 fill-current' aria-hidden='true' />
                  ))}
                </div>

                {/* Testimonial Message */}
                <blockquote className='text-gray-700 mb-8'>"{testimonial.message}"</blockquote>

                {/* Author Info */}
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='relative h-14 w-14'>
                      <img src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} className='rounded-full object-cover' />
                    </div>
                  </div>
                  <div className='ml-4'>
                    <div className='text-lg font-medium text-gray-900'>{testimonial.name}</div>
                    <div className='text-base text-gray-600'>{testimonial.position}</div>
                    <div className='text-sm text-main'>{testimonial.industry}</div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>        
      </div>
    </div>
  );
};
