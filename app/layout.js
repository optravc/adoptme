'use client';

import { Toolbar } from '@mui/material';
import './globals.css';
import DrawerAppBar from './src/components/Layout/Appbardesign';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DrawerAppBar />
        <Toolbar /> {/*  ดันเนื้อหาหลักให้ไม่ถูก AppBar บัง */}
        <main className="main-container" > 
          {children}
        </main>
      </body>
    </html>
  );
}