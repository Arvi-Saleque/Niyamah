const fs = require('fs');
const path = require('path');

const files = [
  "src/app/(admin)/admin/categories/page.tsx",
  "src/app/(admin)/admin/reviews/page.tsx",
  "src/app/(admin)/admin/shipping/page.tsx",
  "src/app/(admin)/admin/staff/page.tsx",
  "src/app/(storefront)/account/addresses/page.tsx",
  "src/components/admin/notification-bell.tsx",
  "src/components/admin/notifications-inbox.tsx",
];

for (const f of files) {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(/void load\(\);/g, 'void (async () => { await load(); })();');
    content = content.replace(/void refresh\(\);/g, 'void (async () => { await refresh(); })();');
    fs.writeFileSync(p, content);
  }
}
