"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { textArray } from "./data";
import { DesktopGrid, DesktopGridLess } from "./DesktopGrid";
import {
  LaptopBreakPoint,
  TabletBreakPoint,
  MobileBreakPoint,
} from "@/constant";
import AppButton from "../ui/AppButton";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {}

const HeroSection = ({}: HeroSectionProps) => {
  const swapTitleRef = useRef<HTMLSpanElement | null>(null);
  const pageSubtitleRef = useRef<HTMLDivElement | null>(null);
  const pageButtonRef = useRef<HTMLDivElement | null>(null);
  const heroPhotoRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const vSlideRef = useRef<gsap.core.Timeline | null>(null);

  // GSAP animations
  useGSAP(() => {
    let mediaQuery = gsap.matchMedia();

    // Animations for elements
    gsap.to(swapTitleRef.current, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      delay: 1,
    });
    gsap.to(listRef.current, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      delay: 1.5,
    });
    gsap.to(pageSubtitleRef.current, {
      opacity: 1,
      visibility: "visible",
      delay: 1,
    });
    gsap.to(pageButtonRef.current, {
      opacity: 1,
      visibility: "visible",
      delay: 1,
    });
    gsap.fromTo(
      ".grid-svg-path",
      {
        strokeDashoffset: "-610.244px",
        strokeDasharray: "0px, 999999px",
      },
      {
        strokeDashoffset: "0px",
        strokeDasharray: "1200px 0px",
        duration: 2,
      },
    );
    gsap.to(".IndexHero-logo", {
      opacity: 1,
      visibility: "visible",
      stagger: 0.1,
    });

    // Media query based animations
    mediaQuery.add(
      {
        isDesktop: `(min-width: ${LaptopBreakPoint}px)`,
        isLaptop: `(max-width: ${LaptopBreakPoint - 1}px) and (min-width: ${TabletBreakPoint + 1}px)`,
        isTablet: `(max-width: ${TabletBreakPoint}px) and (min-width: ${MobileBreakPoint + 1}px)`,
        isMobile: `(max-width: ${MobileBreakPoint}px)`,
      },
      (context) => {
        const conditions = (context.conditions ?? {}) as {
          isDesktop?: boolean;
          isLaptop?: boolean;
          isTablet?: boolean;
          isMobile?: boolean;
        };
        const isDesktop = Boolean(conditions.isDesktop);
        const isLaptop = Boolean(conditions.isLaptop);
        const isTablet = Boolean(conditions.isTablet);
        gsap.fromTo(
          heroPhotoRef.current,
          {
            transform: "translate3d(0px, 0px, 0px) rotate(0deg)",
          },
          {
            transform: "translate3d(100px, -300px, 0px) rotate(15deg)",
            duration: 1,
            scrollTrigger: {
              trigger: heroPhotoRef.current,
              start: isDesktop
                ? "top, 25%"
                : isLaptop
                  ? "top, 32%"
                  : isTablet
                    ? "top, 30%"
                    : "top, 20%",
              scrub: 1,
            },
          },
        );
      },
    );
    gsap.fromTo(
      ".grid-svg-path",
      {
        strokeDashoffset: "0px",
        strokeDasharray: "1200px 0px",
      },
      {
        strokeDashoffset: "-610.244px",
        // -245.393
        strokeDasharray: "0px, 999999px",
        duration: 1,
        scrollTrigger: {
          trigger: ".grid-svg-path",
          start: "top, 11.7%",
          scrub: 1,
        },
      },
    );
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const fallbackLineHeight = 65;
    const moveDuration = 0.65;
    const holdDuration = 1.5;

    if (vSlideRef.current) {
      vSlideRef.current.kill();
      vSlideRef.current = null;
    }

    Array.from(list.children).forEach((node) => {
      if (node instanceof HTMLElement && node.dataset.loop === "clone") {
        node.remove();
      }
    });

    const originals = Array.from(list.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    const count = originals.length;
    if (count <= 1) return;
    const lineHeight =
      originals[0].getBoundingClientRect().height || fallbackLineHeight;

    // Keep one extra first item at the end so the loop boundary is invisible.
    const firstClone = originals[0].cloneNode(true) as HTMLElement;
    firstClone.dataset.loop = "clone";
    list.appendChild(firstClone);

    gsap.set(list, { y: 0, transition: "none" });
    const timeline = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < count; i += 1) {
      const targetY = -Math.round((i + 1) * lineHeight);
      timeline.to(
        list,
        {
          y: targetY,
          duration: moveDuration,
          ease: "power2.inOut",
        },
        `+=${holdDuration}`,
      );
    }

    vSlideRef.current = timeline;

    return () => {
      if (vSlideRef.current) {
        vSlideRef.current.kill();
        vSlideRef.current = null;
      }

      Array.from(list.children).forEach((node) => {
        if (node instanceof HTMLElement && node.dataset.loop === "clone") {
          node.remove();
        }
      });
    };
  }, []);

  return (
    <section className="relative bg-[#f5f5f7] overflow-hidden">
      <div className="mx-auto pt-32.5 2xl:w-270">
        <div className="flex justify-between">
          <div className="flex-none 2xl:basis-135 2xl:max-w-135 z-1000">
            {/* Title and swapping text */}
            <h1
              className="text-[50px] tracking-[-0.62px] font-medium leading-15.25 2xl:mt-5 mb-0 p-0 border-0 align-baseline"
              id="page-title"
            >
              <span id="swap-title" ref={swapTitleRef}>
                The next era of
              </span>
              <span
                id="swap-container"
                className="relative inline-block overflow-hidden text-[#20A472] h-16.25"
              >
                <div id="swap-text" ref={listRef}>
                  {textArray?.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        slidesRef.current[index] = el;
                      }}
                      style={{ height: 65 }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </span>
            </h1>

            {/* Subtitle */}
            <div
              id="page-subtitle"
              ref={pageSubtitleRef}
              className="mt-3.5 text-lg text-[#4d4476] leading-7.5 tracking-normal transition-all duration-300 delay-200 transform-gpu xl:w-125"
            >
              Integrate end to end credit and payment solutions into your
              business processes using our modern card issuing platform.
            </div>

            {/* Buttons */}
            <div
              id="page-button"
              ref={pageButtonRef}
              className="flex flex-col lgxl:flex-row justify-stretch items-stretch gap-6 lgxl:gap-8 mt-10 transform-gpu transition-all duration-300 delay-200"
            >
              <AppButton href="/contact-us" variant="filled">
                Contact us
              </AppButton>
              <AppButton href="/platform/credit" variant="outlined">
                Learn more
              </AppButton>
            </div>
          </div>
          <div>sequence wrapper</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
