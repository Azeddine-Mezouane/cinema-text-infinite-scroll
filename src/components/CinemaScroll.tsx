"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface MovieCredit {
  id: number;
  category: string;
  name: string;
}

const CINEMA_ITEMS: MovieCredit[] = [
  { id: 1, category: "Christopher Nolan", name: "Interstellar" },
  { id: 2, category: "David Fincher", name: "Se7en" },
  { id: 3, category: "Denis Villeneuve", name: "Blade Runner 2049" },
  { id: 4, category: "Hayao Miyazaki", name: "Spirited Away" },
  { id: 5, category: "Stanley Kubrick", name: "2001" },
  { id: 6, category: "Andrei Tarkovsky", name: "Stalker" },
  { id: 7, category: "Bong Joon-ho", name: "Parasite" },
  { id: 8, category: "Terrence Malick", name: "The Tree of Life" },
  { id: 9, category: "Spike Jonze", name: "Her" },
  { id: 10, category: "Nicolas Winding", name: "Drive" },
];

export default function CinemaScroll() {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const menuElement = menuRef.current;
    if (!menuElement) return;

    const items = itemsRef.current.filter(Boolean);
    if (items.length === 0) return;

    let menuItemHeight =
      items[0].getBoundingClientRect().height ;
    let totalMenuHeight = items.length * menuItemHeight;

    let currentScrollPosition = 0;
    let lastScrollY = 0;
    let smoothScrollY = 0;
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let animationFrameId: number;

    const interpolate = (start: number, end: number, factor: number) =>
      start * (1 - factor) + end * factor;

    const adjustMenuItemsPosition = (scroll: number) => {
      gsap.set(items, {
        y: (index) => index * menuItemHeight + scroll,
        modifiers: {
          y: (y: string | number) => {
            const wrappedY = gsap.utils.wrap(
              -menuItemHeight,
              totalMenuHeight - menuItemHeight,
              parseFloat(String(y))
            );
            return `${wrappedY}px`;
          },
        },
      });
    };

    // Initial positioning
    adjustMenuItemsPosition(0);

    const onWheelScroll = (event: WheelEvent) => {
      event.preventDefault();
      currentScrollPosition -= event.deltaY;
    };

    // Mouse events
    const onMouseDown = (event: MouseEvent) => {
      startY = event.clientY;
      isDragging = true;
      menuElement.classList.add("cursor-grabbing");
      menuElement.classList.remove("cursor-grab");
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      currentY = event.clientY;
      currentScrollPosition += (currentY - startY) * 3;
      startY = currentY;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      menuElement.classList.remove("cursor-grabbing");
      menuElement.classList.add("cursor-grab");
    };

    // Touch events
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      startY = event.touches[0].clientY;
      isDragging = true;
      menuElement.classList.add("cursor-grabbing");
      menuElement.classList.remove("cursor-grab");
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isDragging || event.touches.length === 0) return;
      if (event.cancelable) event.preventDefault();
      currentY = event.touches[0].clientY;
      currentScrollPosition += (currentY - startY) * 3;
      startY = currentY;
    };

    const onTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      menuElement.classList.remove("cursor-grabbing");
      menuElement.classList.add("cursor-grab");
    };

    const updateDimensions = () => {
      if (!items[0]) return;
      menuItemHeight =
        items[0].getBoundingClientRect().height || items[0].clientHeight;
      totalMenuHeight = items.length * menuItemHeight;
      adjustMenuItemsPosition(smoothScrollY);
    };

    const animate = () => {
      smoothScrollY = interpolate(smoothScrollY, currentScrollPosition, 0.1);
      adjustMenuItemsPosition(smoothScrollY);

      const scrollSpeed = smoothScrollY - lastScrollY;
      lastScrollY = smoothScrollY;

      gsap.to(items, {
        scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.0075,
        rotate: scrollSpeed * 0.2,
        duration: 0.1,
        ease: "power1.out",
        overwrite: "auto",
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Re-calculate after fonts render
    if (document.fonts) {
      document.fonts.ready.then(updateDimensions);
    }

    // Wheel listener
    menuElement.addEventListener("wheel", onWheelScroll, { passive: false });

    // Mouse listeners
    menuElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch listeners
    menuElement.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    // Window resize
    window.addEventListener("resize", updateDimensions);

    return () => {
      cancelAnimationFrame(animationFrameId);
      menuElement.removeEventListener("wheel", onWheelScroll);
      menuElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      menuElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("resize", updateDimensions);
      gsap.killTweensOf(items);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative w-screen  h-screen overflow-hidden bg-black text-white cursor-grab select-none touch-none"
    >
      {/* Background with vignette */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <Image
          src="/bg.jpg"
          alt="Cinema background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 z-10 [background:radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_50%,rgba(0,0,1)_100%)]" />
      </div>

      {/* Infinite Scroll Menu List */}
      <ul className="relative w-full h-full list-none p-0 m-0 z-20 pointer-events-none">
        {CINEMA_ITEMS.map((item, index) => (
          <li
            key={item.id}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="absolute top-0 left-0 w-full h-20 md:h-40 py-12 md:py-16 px-4 md:px-12 flex gap-4 md:gap-8 items-end will-change-transform pointer-events-auto"
          >
            <div className="flex-2 flex justify-end items-end text-right pr-2">
              <p className="font-director text-[clamp(1rem,2vw,100px)] uppercase tracking-wider text-neutral-300 font-normal leading-none">
                {item.category}
              </p>
            </div>
            <div className="flex-4 flex items-end text-left">
              <p className="font-title text-[clamp(1.8rem,6vw,100px)] leading-[0.9] text-white tracking-tight font-normal">
                {item.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
