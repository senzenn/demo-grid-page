import { OrbitingCircles } from "@/components/ui/orbiting-circle";
import Image from "next/image";

// Stablecoin Icons - Using actual cryptocurrency SVG files
const USDCIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded-full overflow-hidden`}>
    <Image
      src="/Cryptocurrency/usdc.svg"
      alt="USDC"
      width={60}
      height={60}
      className="rounded-full"
    />
  </div>
);

const USDTIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded-full overflow-hidden`}>
    <Image
      src="/Cryptocurrency/usdt.svg"
      alt="USDT"
      width={60}
      height={60}
      className="rounded-full"
    />
  </div>
);

const BTCIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded-full overflow-hidden`}>
    <Image
      src="/Cryptocurrency/btc.svg"
      alt="Bitcoin"
      width={60}
      height={60}
      className="rounded-full"
    />
  </div>
);

const ETHIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded-full overflow-hidden`}>
    <Image
      src="/Cryptocurrency/eth.svg"
      alt="Ethereum"
      width={60}
      height={60}
      className="rounded-full"
    />
  </div>
);

const SOLIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded-full overflow-hidden`}>
    <Image
      src="/solanaLogoMark.svg"
      alt="Solana"
      width={60}
      height={52}
      className="object-contain"
      style={{ aspectRatio: '101/88' }}
    />
  </div>
);

const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center rounded-full overflow-hidden bg-background`}>
    <Image
      src="/logo.svg"
      alt="Logo"
      width={60}
      height={60}
      className="rounded-full object-contain"
    />
  </div>
);

export function SecondBentoAnimation() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-background to-transparent z-20"></div>
      <div className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-gradient-to-b from-background to-transparent z-20"></div>

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 size-20 md:size-24 bg-secondary p-3 rounded-full z-30 md:bottom-0 md:top-auto">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center translate-y-0 md:translate-y-32">
          <OrbitingCircles
            index={0}
            iconSize={60}
            radius={100}
            reverse
            speed={1}
          >
            <USDCIcon className="size-[60px]" />
            <USDTIcon className="size-[60px]" />
            <BTCIcon className="size-[60px]" />
          </OrbitingCircles>

          <OrbitingCircles index={1} iconSize={60} speed={0.5}>
            <ETHIcon className="size-[60px]" />
            <SOLIcon className="size-[60px]" />
            <BTCIcon className="size-[60px]" />
          </OrbitingCircles>

          <OrbitingCircles
            index={2}
            iconSize={60}
            radius={230}
            reverse
            speed={0.5}
          >
            <ETHIcon className="size-[60px]" />
            <LogoIcon className="size-[60px]" />
            <USDCIcon className="size-[60px]" />
          </OrbitingCircles>
        </div>
      </div>
    </div>
  );
}
