import { PRODUCTS, Product } from "../lib/data";
import { getLearnedCategoryHint, learnCategoryFromMessage } from "./chat_learning";

export interface ChatResponse {
    role: "assistant";
    content: string;
    products?: Product[];
    action?: {
        type: "ADD_TO_CART";
        product: Product;
    };
}

interface ChatTurn {
    role: "user" | "assistant";
    content: string;
}

interface ChatOptions {
    history?: ChatTurn[];
}

function isUrduLike(text: string): boolean {
    const urduScript = /[\u0600-\u06FF]/.test(text);
    const romanUrduKeywords = /\b(aur|mujhe|chahiye|sasta|mehnga|budget|dikhao|wala|wali|hai|kar|karo|rings|earrings|necklace|bracelet)\b/i.test(text);
    return urduScript || romanUrduKeywords;
}

function detectCategory(text: string): Product["category"] | null {
    if (/\b(ring|rings|angoothi|ringe)\b/i.test(text)) return "Rings";
    if (/\b(earring|earrings|bali|jhumka|stud)\b/i.test(text)) return "Earrings";
    if (/\b(necklace|necklaces|har|chain|pendant)\b/i.test(text)) return "Necklaces";
    if (/\b(bracelet|bracelets|kangan|bangle)\b/i.test(text)) return "Bracelets";
    if (/\b(set|sets|bridal set|complete set)\b/i.test(text)) return "Sets";
    return null;
}

function extractBudget(text: string): number | null {
    const m = text.match(/\$?\s?(\d{2,6})/);
    return m ? parseInt(m[1], 10) : null;
}

function getLastUserContext(history: ChatTurn[] = []): { category?: Product["category"]; budget?: number } {
    const userMsgs = history.filter((h) => h.role === "user").map((h) => h.content).reverse();
    const out: { category?: Product["category"]; budget?: number } = {};
    for (const msg of userMsgs) {
        if (!out.category) {
            const cat = detectCategory(msg);
            if (cat) out.category = cat;
        }
        if (!out.budget) {
            const budget = extractBudget(msg);
            if (budget) out.budget = budget;
        }
        if (out.category && out.budget) break;
    }
    return out;
}

function buildReply(opts: { urdu: boolean; en: string; ur: string }): string {
    return opts.urdu ? opts.ur : opts.en;
}

export const processAIInquiry = async (message: string, options: ChatOptions = {}): Promise<ChatResponse> => {
    const text = message.toLowerCase();
    const wantsUrdu = isUrduLike(message);
    let filtered = PRODUCTS;
    let response = "";

    const context = getLastUserContext(options.history);
    const followUpIntent = /\b(more|aur|or|show more|phir|next|mazeed|another)\b/i.test(text);

    // 1. Check for Buy/Order Intent
    const buyIntent = text.match(/\b(buy|order|add|get|khareed|kharido|add karo|cart)\b/);
    const priceIntent = text.match(/\b(price|cost|how much|value|kitna|qeemat|rate)\b/);

    // 2. Name Matching Logic (Fuzzy/Substring)
    const mentionedProduct = PRODUCTS.find(p =>
        text.includes(p.name.toLowerCase()) ||
        (p.name.toLowerCase().split(' ').some(word => word.length > 3 && text.includes(word)))
    );

    if (mentionedProduct) {
        if (buyIntent) {
            return {
                role: "assistant",
                content: buildReply({
                    urdu: wantsUrdu,
                    en: `Great choice. ${mentionedProduct.name} is added to your cart. You can say "show more" to continue or go to checkout.`,
                    ur: `Behtareen choice. ${mentionedProduct.name} aap ke cart mein add ho gaya hai. Aap "aur dikhao" keh sakte hain ya checkout kar sakte hain.`,
                }),
                products: [mentionedProduct],
                action: { type: "ADD_TO_CART", product: mentionedProduct }
            };
        }

        if (priceIntent) {
            return {
                role: "assistant",
                content: buildReply({
                    urdu: wantsUrdu,
                    en: `${mentionedProduct.name} costs $${mentionedProduct.price}. Category: ${mentionedProduct.category}. If you want, I can show similar options too.`,
                    ur: `${mentionedProduct.name} ki qeemat $${mentionedProduct.price} hai. Category: ${mentionedProduct.category}. Agar chahen to is jaisay aur options bhi dikha deta hoon.`,
                }),
                products: [mentionedProduct]
            };
        }
    }

    // 3. Category & Budget Filters (context aware + learning hint)
    const isBudgetSearch = extractBudget(text);
    const detectedCategory = detectCategory(text);
    const learnedCategory = await getLearnedCategoryHint(text);
    const activeCategory = detectedCategory || (followUpIntent ? context.category : null) || (learnedCategory as Product["category"] | null);
    const activeBudget = isBudgetSearch || (followUpIntent ? context.budget ?? null : null);

    if (activeBudget) {
        const budget = activeBudget;
        filtered = filtered.filter(p => p.price <= budget);
        response = buildReply({
            urdu: wantsUrdu,
            en: `Here are items within $${budget}: `,
            ur: `Yahan $${budget} budget ke andar products hain: `,
        });
    }

    if (activeCategory === "Earrings") {
        filtered = filtered.filter(p => p.category === "Earrings");
        response += buildReply({ urdu: wantsUrdu, en: "Showing earrings for you. ", ur: "Aap ke liye earrings show kar raha hoon. " });
    } else if (activeCategory === "Rings") {
        filtered = filtered.filter(p => p.category === "Rings");
        response += buildReply({ urdu: wantsUrdu, en: "Showing rings for you. ", ur: "Aap ke liye rings show kar raha hoon. " });
    } else if (activeCategory === "Necklaces") {
        filtered = filtered.filter(p => p.category === "Necklaces");
        response += buildReply({ urdu: wantsUrdu, en: "Showing necklaces for you. ", ur: "Aap ke liye necklaces show kar raha hoon. " });
    } else if (activeCategory === "Bracelets") {
        filtered = filtered.filter(p => p.category === "Bracelets");
        response += buildReply({ urdu: wantsUrdu, en: "Showing bracelets for you. ", ur: "Aap ke liye bracelets show kar raha hoon. " });
    } else if (activeCategory === "Sets") {
        filtered = filtered.filter(p => p.category === "Sets");
        response += buildReply({ urdu: wantsUrdu, en: "Showing matching jewelry sets for you. ", ur: "Aap ke liye matching jewelry sets show kar raha hoon. " });
    }

    // If we have a specific product match but no specific intent, prioritize it
    if (mentionedProduct && !response) {
        return {
            role: "assistant",
            content: buildReply({
                urdu: wantsUrdu,
                en: `${mentionedProduct.name} is available. I can share details, price, or add it to cart.`,
                ur: `${mentionedProduct.name} available hai. Main details, price, ya direct cart mein add kar sakta hoon.`,
            }),
            products: [mentionedProduct]
        };
    }

    // Default response for simple greetings
    if (!isBudgetSearch && !mentionedProduct && (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("assalam") || text.includes("salam"))) {
        return {
            role: "assistant",
            content: buildReply({
                urdu: wantsUrdu,
                en: "Hello! I can help you in English and Urdu. Tell me category, budget, or product name.",
                ur: "Assalam o Alaikum! Main English aur Urdu dono mein help kar sakta hoon. Category, budget, ya product name batayein.",
            })
        };
    }

    if (filtered.length === 0) {
        return {
            role: "assistant",
            content: buildReply({
                urdu: wantsUrdu,
                en: "I could not find an exact match. Try a category (rings, earrings, necklaces) or set a budget like 500.",
                ur: "Exact match nahi mila. Category batayein (rings, earrings, necklaces) ya budget dein, jaise 500.",
            })
        };
    }

    if (activeCategory) {
        await learnCategoryFromMessage(message, activeCategory);
    }

    return {
        role: "assistant",
        content: response || buildReply({
            urdu: wantsUrdu,
            en: "Here are my best matches for your request:",
            ur: "Aap ki request ke liye ye best matching products hain:",
        }),
        products: filtered.slice(0, 4)
    };
};
