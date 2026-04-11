# Astro Skill Blueprint (SEO + GEO + GSAP + Component Architecture)

## 🎯 Mục tiêu

Build một website Astro cho công ty kế toán với:

- Chuẩn SEO (meta, schema)
- Chuẩn GEO (Local SEO)
- Animation mượt với GSAP
- Component hóa rõ ràng, tái sử dụng cao
- Kết nối WordPress (Headless CMS)

---

## 🧠 1. Kiến trúc tổng thể

WordPress (CMS - Headless)
↓ GraphQL API
Astro (Frontend - SSG)
↓
Deploy (Vercel / VPS)

---

## 📁 2. Cấu trúc thư mục

```
src/
├── pages/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── ui/
│   └── animations/
├── layouts/
├── services/
├── lib/
├── styles/
└── types/
```

---

## 🧩 3. Quy tắc tách component

### Nguyên tắc:

- `ui/` → component nhỏ (Button, Card)
- `sections/` → block lớn (Hero, Services)
- `layout/` → header/footer
- `animations/` → logic GSAP

---

### Ví dụ:

```
components/
├── ui/
│   └── Button.astro
├── sections/
│   └── Hero.astro
├── layout/
│   └── Header.astro
└── animations/
    └── fadeIn.ts
```

---

## ⚡ 4. GSAP Animation

### Cài đặt:

```bash
npm install gsap
```

---

### Tạo animation reusable:

```ts
// src/components/animations/fadeIn.ts
import { gsap } from "gsap";

export function fadeIn(el: HTMLElement) {
  gsap.from(el, {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out",
  });
}
```

### Sử dụng trong Astro:

```astro
---
---

<div class="fade-item">Hello</div>

<script>
  import { fadeIn } from '../components/animations/fadeIn';

  document.querySelectorAll('.fade-item').forEach(el => {
    fadeIn(el);
  });
</script>
```

---

## 🎨 5. Quy tắc animation

**Nên dùng:**
- Fade in nhẹ
- Slide nhẹ
- Hover subtle

**Tránh:**
- Zoom mạnh
- Animation quá nhiều

---

## 🔍 6. SEO Setup

**Helper SEO:**
```ts
// src/lib/seo.ts
export function generateSEO({ title, description }) {
  return { title, description };
}
```

**Meta trong layout:**
```html
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
</head>
```

---

## 🌍 7. GEO (Local SEO)

**Schema JSON-LD:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "Công ty kế toán NextTax",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Hồ Chí Minh",
    "addressCountry": "VN"
  }
}
</script>
```

**Yêu cầu:**
- Trang contact rõ ràng
- Có địa chỉ, map
- Keyword địa phương

---

## 🔌 8. Kết nối WordPress

**API Layer:**
```ts
// src/services/wordpress.ts
export async function fetchAPI(query: string) {
  const res = await fetch('https://yourdomain.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  return res.json();
}
```

---

## 🧱 9. Ví dụ Page

```astro
---
import Layout from '../layouts/MainLayout.astro';
import Hero from '../components/sections/Hero.astro';
import Services from '../components/sections/Services.astro';
---

<Layout title="Trang chủ">
  <Hero />
  <Services />
</Layout>
```

---

## ⚡ 10. Performance Rules

- SSG (Astro default)
- Lazy load image
- Hạn chế JS
- GSAP chỉ load khi cần

---

## 💡 11. Best Practices

**Nên:**
- Component nhỏ, rõ
- Tách animation riêng
- SEO từ đầu

**Không nên:**
- Hardcode data
- Nhét logic vào UI
- Lạm dụng animation

---

## 🚀 12. Stack đề xuất

- Astro
- TailwindCSS
- GSAP
- WordPress (Headless)
- WPGraphQL
- Vercel
