import React from 'react';
import { FooterSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';

export const Footer: React.FC<any> = (rawProps) => {
  const parseResult = FooterSchema.safeParse(rawProps);
  
  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Footer Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];

  return (
    <footer className={`w-full py-10 ${bgClass} border-t`}>
      <div className="container px-4 md:px-6 mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
           <div className="flex flex-col space-y-3">
             <span className="font-bold text-xl">{props.title}</span>
             <span className="text-sm opacity-70">{props.copyright}</span>
           </div>
           <div></div>
           <div className="flex flex-col space-y-3 md:items-end">
             <span className="font-semibold mb-2">Links</span>
             {props.footerLinks && Object.entries(props.footerLinks).map(([key, label]) => (
               <a key={key} href={`/${key}`} className="text-sm hover:underline opacity-80 hover:opacity-100">
                 {label}
               </a>
             ))}
           </div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
