'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleUp';
    threshold?: number;
    delay?: number;
    duration?: number;
    className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    animation = 'fadeIn',
    threshold = 0.1,
    delay = 0,
    duration = 600,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Add delay before showing
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                }
            },
            {
                threshold,
                rootMargin: '0px',
            }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [threshold, delay]);

    // Animation configurations
    const animationConfig = {
        fadeIn: {
            initial: 'opacity-0',
            animate: 'opacity-100',
            transform: '',
        },
        slideUp: {
            initial: 'opacity-0',
            animate: 'opacity-100',
            transform: isVisible ? 'translate-y-0' : 'translate-y-8',
        },
        slideLeft: {
            initial: 'opacity-0',
            animate: 'opacity-100',
            transform: isVisible ? 'translate-x-0' : 'translate-x-8',
        },
        slideRight: {
            initial: 'opacity-0',
            animate: 'opacity-100',
            transform: isVisible ? 'translate-x-0' : '-translate-x-8',
        },
        scaleUp: {
            initial: 'opacity-0',
            animate: 'opacity-100',
            transform: isVisible ? 'scale-100' : 'scale-95',
        },
    };

    const config = animationConfig[animation];

    return (
        <div
            ref={elementRef}
            className={`
        transition-all ease-out
        ${isVisible ? config.animate : config.initial}
        ${config.transform}
        ${className}
      `}
            style={{
                transitionDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
