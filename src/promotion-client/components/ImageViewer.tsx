import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui Button

export const ImageViewer = ({ account, currentPage, numPages, goToPrevPage, goToNextPage }) => {
  // Page transition variants
  const pageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    in: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    out: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className='w-full md:w-full md:h-[80vh] flex flex-col items-center justify-center'>
      {/* Animated Image Viewer */}
      {account?.landing?.card.content && (
        <AnimatePresence mode='wait' custom={currentPage}>
          <motion.div
            key={currentPage}
            custom={currentPage}
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            className='flex justify-center items-center w-full h-full'
          >
            <img
              src={account?.landing?.card.content[currentPage - 1]}
              alt={`Page ${currentPage}`}
              className='w-auto h-auto max-w-full md:w-screen md:h-screen max-h-full object-contain shadow-lg'
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation */}
      <div className='flex justify-center space-x-4 bg-black/50 p-4 backdrop-blur-sm mt-4'>
        <Button onClick={goToPrevPage} disabled={currentPage === 1} className='bg-[#3a3b40] hover:bg-[#4a4b50] text-white px-4 py-2'>
          Anterior
        </Button>
        <span className='text-white flex items-center'>
          {currentPage} / {numPages}
        </span>
        <Button onClick={goToNextPage} disabled={currentPage === numPages} className='bg-[#3a3b40] hover:bg-[#4a4b50] text-white px-4 py-2'>
          Siguiente
        </Button>
      </div>
    </div>
  );
};
