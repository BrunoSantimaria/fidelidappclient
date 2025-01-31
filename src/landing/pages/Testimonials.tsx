import { testimonials } from "@/data/testimonials";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";


export const Testimonials = () => {
  return (
    <section className='py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center'
        >
          <h2 className='text-[#5b7898] font-bold text-2xl md:text-4xl mb-2'>Lo que dicen nuestros clientes</h2>
          <p className='text-gray-600 max-w-2xl mx-auto mb-16'>
            Descubre cómo FidelidApp ha ayudado a diferentes negocios a crecer y mantener a sus clientes satisfechos
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className='bg-white rounded-xl shadow-lg p-6 h-full flex flex-col'>
                <div className='flex gap-4 mb-4'>
                  <img src={testimonial.avatar} alt={testimonial.name} className='w-12 h-12 rounded-full object-cover' />
                  <div>
                    <h3 className='text-[#5b7898] font-semibold'>{testimonial.name}</h3>
                    <p className='text-gray-600 text-sm'>{testimonial.position}</p>
                    <p className='text-gray-600 text-sm'>{testimonial.industry}</p>
                  </div>
                </div>

                <div className='relative flex-1'>
                  <Quote className='absolute -top-2 -left-2 w-6 h-6 text-[#5b7898] opacity-20' />
                  <p className='pt-4 text-gray-700 leading-relaxed relative'>{testimonial.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
