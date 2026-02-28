'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    whileHover={{ scale: 1.15, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className='fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 minecraft-button flex items-center justify-center text-2xl md:text-3xl'
                    style={{
                        backgroundColor: 'var(--mc-gold)',
                        color: 'var(--mc-dark)',
                        width: '56px',
                        height: '56px',
                        borderRadius: '0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
                    }}
                    aria-label='Scroll to top'
                    title='Scroll to top'
                >
                    <motion.span
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        ⬆️
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}