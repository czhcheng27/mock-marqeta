"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { HeroLogo, textArray } from "./data";
import { DesktopGrid, DesktopGridLess } from "./DesktopGrid";
import { HomepageMobileGrid, MobileGrid } from "./MobileGrid";
import {
  LaptopBreakPoint,
  TabletBreakPoint,
  MobileBreakPoint,
} from "@/constant";
import AppButton from "../ui/AppButton";
import HeroPhoto from "@/public/imgs/hero-photo.png";
import Image from "next/image";

const topLottieSrc = "/lottie/top.lottie";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {}

const HeroSection = ({}: HeroSectionProps) => {
  const swapTitleRef = useRef<HTMLSpanElement | null>(null);
  const pageSubtitleRef = useRef<HTMLDivElement | null>(null);
  const pageButtonRef = useRef<HTMLDivElement | null>(null);
  const heroPhotoRef = useRef<HTMLImageElement | null>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const vSlideRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      void import("@dotlottie/player-component");
    }
  }, []);

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
                Contact Sales
              </AppButton>
              <AppButton href="/platform/credit" variant="outlined">
                Learn more
              </AppButton>
            </div>
          </div>
          {/* <div>sequence wrapper</div> */}
        </div>

        {/* Logos */}
        <div className="flex items-center justify-between mt-27 h-6.5 2xl:max-w-180 2xl:pb-40">
          {HeroLogo.map((logo, index) => {
            const { alt, src } = logo;
            return <Image key={index} src={src} alt={alt} />;
          })}
        </div>
      </div>

      {/* Hero photo and card animations */}
      <div className="absolute top-0 left-0 w-full h-150">
        <div className="relative h-full mx-auto my-0 pt-32.5 2xl:w-270">
          <div className="absolute top-0 right-0 z-999 w-full h-full">
            {/* Main hero photo */}
            <div
              className="absolute z-10
              w-1/2 xsm:w-1/3 md:w-2/5 lgb:w-[38%] xl:w-1/3 
              top-[19%] md:top-[25%] lgb:top-[30%] 
              left-[20%] xsm:left-[30%] md:left-[58%] lgb:left-[50%] xl:left-[53%] 2xl:left-[65%]"
            >
              <Image
                ref={heroPhotoRef}
                src={HeroPhoto}
                alt="Hero Photo"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Desktop view */}
            <div className="hero-desktop-asset-wrapper">
              <DesktopGridLess />
            </div>
            <div className="hero-desktop-asset-wrapper">
              <dotlottie-player
                src={topLottieSrc}
                autoPlay={true}
                style={{ height: "100%", width: "100%" }}
                background="transparent"
              />
            </div>
          </div>

          {/* SVG lines Grid */}
          <div className="hero-desktop-asset-wrapper" style={{ zIndex: 999 }}>
            <DesktopGrid />
          </div>
          {/* <div className="hero-desktop-asset-wrapper" style={{ zIndex: 99 }}>
            <MobileGrid />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
