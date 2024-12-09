'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Visual Builder', href: '/builder' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === link.href
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
