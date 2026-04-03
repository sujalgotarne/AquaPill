const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Strip 'use client'
  content = content.replace(/^(?:'|")use client(?:'|");?\s*/m, '');

  // next/link
  content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, "import { Link } from 'react-router-dom'");
  content = content.replace(/<Link([^>]*)href=/g, "<Link$1to=");

  // next/image (naive approach: just swap to img, remove fill)
  content = content.replace(/import\s+Image\s+from\s+['"]next\/image['"];?\s*/g, "");
  content = content.replace(/<Image/g, "<img");
  content = content.replace(/\s+fill=?{?[^}\s]*}?/g, ""); // remove fill, fill={true}, fill={false}
  content = content.replace(/priority(?:\s|=)/g, " ");

  // next/navigation
  content = content.replace(/import\s+\{\s*notFound\s*\}\s*from\s+['"]next\/navigation['"]/g, "import { Navigate } from 'react-router-dom';\nconst notFound = () => <Navigate to='/not-found' />");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed', filePath);
}

const files = [
  "components/sections/how-it-works.tsx",
  "components/sections/hero.tsx",
  "components/sections/cta.tsx",
  "components/navbar.tsx",
  "components/footer.tsx",
  "components/cart/cart-item.tsx",
  "components/cart/cart-content.tsx",
  "components/cart/cart-summary.tsx",
  "components/product/image-gallery.tsx",
  "src/pages/AboutPage.tsx",
  "src/pages/CartPage.tsx",
  "src/pages/CheckoutPage.tsx",
  "src/pages/ProductPage.tsx",
  "src/pages/ShopPage.tsx"
];

files.forEach(f => processFile(path.join(__dirname, f)));
