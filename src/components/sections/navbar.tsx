"use client";

import { Icons } from "@/components/icons";
import { NavMenu } from "@/components/nav-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import WalletButton from "../walletButton";

// Dynamic widths based on route
const getWidthConfig = (pathname: string) => {
  if (pathname?.startsWith('/dashboard')) {
    return {
      initial: "100%",
      scrolled: "100%"
    };
  }
  return {
    initial: "80rem",
    scrolled: "900px"
  };
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: { duration: 0.1 },
  },
};

const drawerMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  
  // Get dynamic width config based on current route
  const widthConfig = getWidthConfig(pathname);
  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      const sections = siteConfig.nav.links.map((item) =>
        item.href.substring(1),
      );

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setHasScrolled(latest > 10);
    });
    return unsubscribe;
  }, [scrollY]);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const handleOverlayClick = () => setIsDrawerOpen(false);

  return (
    <header
      className={cn(
        "sticky z-50 flex justify-center transition-all duration-300",
        isDashboard 
          ? "top-0 mx-0 w-full" 
          : hasScrolled 
            ? "top-6 mx-4 md:mx-0" 
            : "top-4 mx-0"
      )}
    >
      <motion.div
        initial={{ width: widthConfig.initial }}
        animate={{ width: hasScrolled ? widthConfig.scrolled : widthConfig.initial }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full"
      >
        <div
          className={cn(
            "mx-auto rounded-2xl transition-all duration-300",
            isDashboard
              ? "max-w-full px-4 border-b border-border bg-background"
              : hasScrolled
                ? "max-w-7xl px-3 border border-border backdrop-blur-lg bg-background/75 xl:px-0"
                : "max-w-7xl shadow-none px-7 xl:px-0",
          )}
        >
          <div className={cn(
            "flex items-center justify-between p-4",
            isDashboard ? "h-[64px] gap-6" : "h-[56px] gap-4"
          )}>
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Icons.logo className="size-7 md:size-10" />
              <p className="text-lg font-semibold text-primary whitespace-nowrap">Sky Pay</p>
            </Link>

            <NavMenu />

            {/* RIGHT SECTION */}
            <div className="flex flex-row items-center gap-2 md:gap-3 shrink-0">
              <div className="hidden md:flex items-center">
                <WalletButton/>
              </div>

              <ThemeToggle />

              <button
                className="md:hidden border border-border size-8 rounded-md cursor-pointer flex items-center justify-center"
                onClick={toggleDrawer}
              >
                {isDrawerOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              transition={{ duration: 0.2 }}
              onClick={handleOverlayClick}
            />

            <motion.div
              className="fixed inset-x-0 w-[95%] mx-auto bottom-3 bg-background border border-border p-4 rounded-xl shadow-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={drawerVariants}
            >
              {/* Mobile menu content */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <Icons.logo className="size-7 md:size-10" />
                    <p className="text-lg font-semibold text-primary">
                      SkyAgent
                    </p>
                  </Link>
                  <button
                    onClick={toggleDrawer}
                    className="border border-border rounded-md p-1 cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <motion.ul
                  className="flex flex-col text-sm mb-4 border border-border rounded-md"
                  variants={drawerMenuVariants}
                >
                  <AnimatePresence>
                    {siteConfig.nav.links.map((item) => (
                      <motion.li
                        key={item.id}
                        className="p-2.5 border-b border-border last:border-b-0"
                        variants={drawerMenuVariants}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(
                              item.href.substring(1),
                            );
                            element?.scrollIntoView({ behavior: "smooth" });
                            setIsDrawerOpen(false);
                          }}
                          className={`underline-offset-4 hover:text-primary/80 transition-colors ${
                            activeSection === item.href.substring(1)
                              ? "text-primary font-medium"
                              : "text-primary/60"
                          }`}
                        >
                          {item.name}
                        </a>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>

                {/* Mobile Wallet Button */}
                <div className="w-full">
                  <WalletButton/>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
