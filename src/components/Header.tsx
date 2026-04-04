import React from 'react';
import { HeaderSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';
import { Button } from './Button';

export const Header: React.FC<any> = (rawProps) => {
  const parseResult = HeaderSchema.safeParse(rawProps);
  
  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Header Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-opacity-60 ${bgClass}`}>
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="font-bold text-xl tracking-tight">
            {props.title}
          </a>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {props.links?.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noopener noreferrer" : undefined}
              className="text-sm font-medium transition-colors opacity-70 hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
          {props.button && (
            <Button {...props.button} />
          )}
        </nav>
        <div className="md:hidden flex items-center">
          <button className="p-2 opacity-70 hover:opacity-100">Menu</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
