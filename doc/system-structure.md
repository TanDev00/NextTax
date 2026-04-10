# Astro Project Structure (WordPress Headless CMS)

## 📁 Root structure

```txt
src/
│
├── pages/       # Routing (quan trọng nhất)
├── components/  # UI components tái sử dụng
├── layouts/     # Layout tổng
├── services/    # Tầng gọi API CMS
├── lib/         # Helper functions
├── styles/      # Global styles
├── content/     # (optional) Markdown fallback
└── types/       # TypeScript types
```

---

## 📄 pages/ (Routing)

```txt
pages/
├── index.astro            # Trang chủ
├── about.astro            # Giới thiệu
├── services/
│   ├── index.astro        # Danh sách dịch vụ
│   └── [slug].astro       # Chi tiết dịch vụ (dynamic route)
├── blog/
│   ├── index.astro        # Danh sách bài viết
│   └── [slug].astro       # Chi tiết bài viết (dynamic route)
└── contact.astro          # Liên hệ
```

## 🧩 components/ (UI tái sử dụng)

```txt
components/
├── layout/
│   ├── Header.astro
│   ├── Footer.astro
│   └── BaseLayout.astro
│
├── home/
│   ├── Hero.astro
│   ├── Services.astro
│   ├── AboutPreview.astro
│   └── CTA.astro
│
├── blog/
│   ├── BlogCard.astro
│   └── BlogList.astro
│
└── ui/
    ├── Button.astro
    ├── Card.astro
    └── Badge.astro
```

## 🏗 layouts/

```txt
layouts/
└── MainLayout.astro       # Layout tổng cho toàn site
```

## 🔌 services/ (API layer - WordPress)

```txt
services/
└── wordpress.ts          # fetch data từ WordPress GraphQL / REST
```

## 🧠 lib/ (Helper functions)

```txt
lib/
├── seo.ts                # generate SEO meta
├── format.ts             # format date, text
└── constants.ts          # config constants
```

## 🎨 styles/

```txt
styles/
└── global.css           # CSS global / Tailwind entry
```

## 📝 content/ (optional)

```txt
content/
# dùng nếu fallback Markdown thay cho CMS
```

## 🧾 types/

```txt
types/
└── wordpress.ts         # TypeScript types cho data CMS
```

## 🚀 Ghi chú kiến trúc
- **Frontend**: Astro (SSG/SSR nhẹ).
- **CMS**: WordPress (Headless).
- **API Layer**: Tập trung tại `services/wordpress.ts`.
- **UI Organization**: Chia theo domain (home, blog, ui).
- **SEO**: Tối ưu hóa thông qua file route và `lib/seo.ts`.
