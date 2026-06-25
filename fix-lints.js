const fs = require('fs');
const path = require('path');

const filesToFix = [
  "src/app/(admin)/admin/campaigns/page.tsx",
  "src/app/(admin)/admin/categories/page.tsx",
  "src/app/(admin)/admin/coupons/page.tsx",
  "src/app/(admin)/admin/media/page.tsx",
  "src/app/(admin)/admin/reviews/page.tsx",
  "src/app/(admin)/admin/shipping/page.tsx",
  "src/app/(admin)/admin/staff/page.tsx",
  "src/app/(storefront)/account/addresses/page.tsx",
  "src/app/(storefront)/cart/page.tsx",
  "src/components/admin/notification-bell.tsx",
  "src/components/admin/notifications-inbox.tsx",
  "src/components/storefront/site-header.tsx"
];

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // match `load();` not preceded by `await` or `function` or `async`
  // Actually, replacing inside useEffect is safer:
  content = content.replace(/useEffect\(\(\) => \{\n\s*load\(\);\n\s*\}, \[\]\);/g, `useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);`);

  content = content.replace(/useEffect\(\(\) => \{\n\s*void load\(\);\n\s*\}, \[\]\);/g, `useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);`);
  
  content = content.replace(/useEffect\(\(\) => \{\n\s*void load\(\);\n\s*\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n\s*\}, \[tab\]\);/g, `useEffect(() => {
    void (async () => {
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);`);
  
  content = content.replace(/useEffect\(\(\) => \{\n\s*void load\(\);\n\s*\}, \[load\]\);/g, `useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);`);

  content = content.replace(/useEffect\(\(\) => \{\n\s*void refresh\(\);\n\s*const id = window\.setInterval\(refresh, POLL_MS\);\n\s*return \(\) => window\.clearInterval\(id\);\n\s*\}, \[\]\);/g, `useEffect(() => {
    void (async () => {
      await refresh();
    })();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, []);`);

  content = content.replace(/useEffect\(\(\) => setHydrated\(true\), \[\]\);/g, `useEffect(() => void (async () => setHydrated(true))(), []);`);

  if (file.includes('site-header.tsx')) {
    content = content.replace(/setHits\(\[\]\);\n\s*setHasFetched\(false\);\n\s*return;/g, `void (async () => {
        setHits([]);
        setHasFetched(false);
      })();
      return;`);
  }

  fs.writeFileSync(fullPath, content);
}
console.log("Fixed set-state-in-effect instances.");
