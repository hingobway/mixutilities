import { Atkinson_Hyperlegible } from 'next/font/google';

const font = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-primary',
  display: 'swap',
});

const Layout = ({ children }) => {
  return (
    <>
      <main className={`${font.variable} font-sans`}>
        <div className="h-full">{children}</div>
      </main>
    </>
  );
};

export default Layout;
