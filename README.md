# Jewelry E-commerce Website

This is a full jewelry e-commerce project built with Next.js.

It includes:
- Homepage and category pages
- Product cards and product detail pages
- Cart system with add-to-cart flow
- Contact page with owner details
- Built-in AI chatbot for product suggestions

---

## 1) Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons

---

## 2) Project Structure

- `app/` -> all pages and UI components
- `app/components/` -> shared UI (navbar, footer, chatbot, cards)
- `app/api/chat/route.ts` -> chatbot API endpoint
- `backend/llm_handler.ts` -> chatbot logic and product filtering
- `lib/data.ts` -> all jewelry product data
- `lib/siteProfile.ts` -> personal/brand details and chatbot name

---

## 3) Your Editable Personal Details

All your details are in one file:

- `lib/siteProfile.ts`

Current fields:
- `ownerName`
- `brandName`
- `email`
- `phone`
- `location`
- `tagline`
- `CHATBOT_PROFILE.name`
- `CHATBOT_PROFILE.title`

If you want to change your name, store name, phone, or chatbot name, only edit this file.

---

## 4) How to Run the Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

Build for production:

```bash
npm run build
npm run start
```

---

## 5) Features (Simple Overview)

1. **Browse Products**
   - Category pages for Rings, Earrings, Necklaces, Bracelets, Sets.

2. **Product Details**
   - Individual page with product info, image, and price.

3. **Cart**
   - Add products from cards and chatbot suggestions.

4. **Contact Section**
   - Owner details and simple contact form UI.

5. **AI Chat Assistant**
   - Suggests products by user message and budget.
   - Can auto-add product to cart when buy intent is detected.

---

## 6) Chatbot: How It Is Built and How It Works

### Files used for chatbot

- UI widget: `app/components/AIChatbot.tsx`
- API route: `app/api/chat/route.ts`
- Logic engine: `backend/llm_handler.ts`
- Learning memory store: `backend/chat_learning.ts`
- Auto-generated learning data: `backend/chat_learning_store.json`
- Product data source: `lib/data.ts`

### Full working flow

1. User opens chat widget and types a message.
2. Frontend (`AIChatbot.tsx`) sends `POST` request to `/api/chat`.
3. API route (`route.ts`) reads `message` and `history` from request body.
4. API route calls `processAIInquiry(message, { history })` from `backend/llm_handler.ts`.
5. `llm_handler.ts` does:
   - Detects language (English + Urdu / Roman Urdu)
   - Detects buy intent words like `buy`, `add`, `order`, `khareed`, `karo`
   - Detects price intent words like `price`, `cost`, `qeemat`, `kitna`
   - Tries product-name matching from `PRODUCTS`
   - Filters by category (rings, earrings, necklaces, bracelets, sets)
   - Filters by budget if number is found
   - Uses recent chat context (last category/budget)
   - Uses learned keyword-category memory from previous chats
6. Learning engine (`chat_learning.ts`):
   - Saves useful keywords from user prompts
   - Maps keywords to matched categories
   - Reuses learned mapping in future prompts
7. Response returns:
   - assistant text (`content`)
   - optional `products` list
   - optional `action: ADD_TO_CART`
8. Frontend receives response:
   - Displays assistant message
   - Renders suggested product cards in chat
   - If action is `ADD_TO_CART`, it adds product directly to cart via `CartContext`

### Important note

This chatbot is a **hybrid local AI assistant**:
- Rule-based intent engine for stable and fast replies
- Context memory from recent chat history
- Continuous keyword learning from user conversations
- Bilingual replies in English and Urdu/Roman Urdu

---

## 7) Suggested Chatbot Names

You asked for name suggestions. You can use one of these:

- Zara
- Noor
- Aya
- Luna
- Meher
- Sia
- Elara

To apply a name, edit:

- `CHATBOT_PROFILE.name` in `lib/siteProfile.ts`

---

## 8) Quick Customization Guide

1. Change brand and owner details in `lib/siteProfile.ts`.
2. Change homepage content in `app/page.tsx`.
3. Change chatbot replies in `backend/llm_handler.ts`.
4. Add/remove products in `lib/data.ts`.

---

## 9) Deployment Guide

### Vercel Deployment (Recommended)

1. **Push to GitHub** (already done):
   ```bash
   git remote add origin https://github.com/waizhussain9955/jewelry-store.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js framework
   - Click "Deploy"

3. **Custom Domain** (optional):
   - After deployment, go to project settings
   - Add custom domain if needed

### Environment Variables (if needed)

Create `.env.local` file:
```env
NODE_ENV=production
```

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm run start

# Export static files (alternative deployment)
npm run build
```

---

## 10) Contact Information Setup

Your contact details are configured in `lib/siteProfile.ts`:

```typescript
socialMedia: {
  instagram: "https://www.instagram.com/waiz_hussain_/",
  facebook: "https://www.facebook.com/waiz.hussain.ansari.2025/",
  threads: "https://www.threads.com/@waiz_hussain_",
  github: "https://github.com/waizhussain9955",
  linkedin: "https://www.linkedin.com/in/waiz-hussain-6750392ba/",
},
whatsapp: "+92 327 2051549",
phone: "+92 327 2051549",
```

These links are automatically displayed in:
- Contact page (`/contact`)
- Footer section
- WhatsApp direct chat functionality

---

## 11) Notes

- If images are not loading, check image paths under `public/images/...`.
- If chatbot is not responding, make sure `/api/chat` route is running with app.
- If cart is not updating, verify `CartProvider` is wrapping the app in `app/layout.tsx`.
- For Vercel deployment, ensure all environment variables are set in Vercel dashboard.
- The project is optimized for Vercel with `vercel.json` configuration.
