import Link from 'next/link';
// Import your dedicated logo component
import SarathiLogo from '@/components/sarathi-logo'; 

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm sm:px-8">
      
      {/* 🚀 Increased height to h-12 on mobile and h-16 on larger screens for better visibility */}
      <SarathiLogo href="/" imageClassName="h-12 w-auto sm:h-16" />

      <nav className="flex items-center gap-6">
        <Link href="/" className="text-sm font-medium text-[#0A2351] hover:text-[#F57D14] transition-colors">
          Home
        </Link>
        <Link href="/about" className="text-sm font-medium text-[#0A2351] hover:text-[#F57D14] transition-colors">
          About
        </Link>
      </nav>
    </header>
  );
}
