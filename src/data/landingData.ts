import {
    Users,
    TrendingUp,
    Zap,
    Award,
    FileText,
    Share2,
    Smartphone,
    Receipt,
    BarChart3,
    Download,
    Wallet,
    Lock,
    GraduationCap,
    Church,
    Building2,
    Calendar,
    Heart,
    CheckCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * TypeScript interfaces for landing page data structures
 */

export interface Stat {
    icon: LucideIcon;
    value: string;
    label: string;
    color: string;
}

export interface Step {
    icon: LucideIcon;
    title: string;
    description: string;
}

export interface Feature {
    icon: LucideIcon;
    text: string;
}

export interface UseCase {
    icon: LucideIcon;
    title: string;
    color: string;
}

export interface Testimonial {
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

export interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    ctaText: string;
    ctaVariant?: "default" | "outline";
}

/**
 * Stats data for metrics section
 */
export const stats: Stat[] = [
    {
        icon: Users,
        value: "10,000+",
        label: "Active Users",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: TrendingUp,
        value: "₵50M+",
        label: "Processed",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: Zap,
        value: "99.9%",
        label: "Uptime",
        color: "from-orange-500 to-red-500"
    },
    {
        icon: Award,
        value: "4.9/5",
        label: "Rating",
        color: "from-purple-500 to-pink-500"
    }
];

/**
 * How It Works steps
 */
export const howItWorksSteps: Step[] = [
    {
        icon: FileText,
        title: "Create a payment form",
        description: "Customize fields, upload logo & signature."
    },
    {
        icon: Share2,
        title: "Share your payment link",
        description: "Send via WhatsApp, email, SMS or embed on your site."
    },
    {
        icon: Zap,
        title: "Get paid instantly",
        description: "Automatic receipt generation and customization + real-time dashboard."
    }
];

/**
 * Key features list
 */
export const features: Feature[] = [
    { icon: FileText, text: "Customizable payment forms" },
    { icon: Smartphone, text: "Mobile Money + bank/card payments" },
    { icon: Receipt, text: "Auto-generated and customizable receipts" },
    { icon: BarChart3, text: "Real-time transaction dashboard" },
    { icon: Download, text: "Bulk reports & exports" },
    { icon: Wallet, text: "Wallet + withdrawals" },
    { icon: Users, text: "Multiple branches/teams" },
    { icon: Lock, text: "Secure & compliant" }
];

/**
 * Use cases for different organizations
 */
export const useCases: UseCase[] = [
    { icon: GraduationCap, title: "Schools", color: "from-blue-500 to-cyan-500" },
    { icon: Church, title: "Churches", color: "from-purple-500 to-pink-500" },
    { icon: Users, title: "Associations", color: "from-green-500 to-emerald-500" },
    { icon: Users, title: "Groups & Clubs", color: "from-orange-500 to-red-500" },
    { icon: Building2, title: "SMEs", color: "from-indigo-500 to-blue-500" },
    { icon: Calendar, title: "Event organizers", color: "from-pink-500 to-rose-500" },
    { icon: Heart, title: "Nonprofits", color: "from-red-500 to-pink-500" }
];

/**
 * Customer testimonials
 */
export const testimonials: Testimonial[] = [
    {
        name: "Sarah Mensah",
        role: "School Administrator",
        content: "ZiroKash has made collecting school fees so much easier. Parents can pay anytime, anywhere!",
        rating: 5,
        avatar: "SM"
    },
    {
        name: "Pastor John",
        role: "Church Leader",
        content: "Our tithes and offerings collection has increased by 40% since using ZiroKash. Highly recommended!",
        rating: 5,
        avatar: "PJ"
    },
    {
        name: "Ama Asante",
        role: "Event Organizer",
        content: "The payment forms are beautiful and easy to customize. Our event registration is now seamless.",
        rating: 5,
        avatar: "AA"
    },
    {
        name: "Kwame Osei",
        role: "SME Owner",
        content: "Real-time dashboard and instant notifications help me track all payments. Game changer!",
        rating: 5,
        avatar: "KO"
    }
];

/**
 * Pricing plans
 */
export const pricingPlans: PricingPlan[] = [
    {
        name: "Free Activation",
        price: "₵0",
        description: "Get started today",
        features: [
            "Unlimited payment forms",
            "AI Form Generator ✨",
            "20+ Premium Templates",
            "Real-time dashboard",
            "Email support"
        ],
        ctaText: "Get Started Free",
        ctaVariant: "outline"
    },
    {
        name: "Pay as You Earn",
        price: "2.5%",
        description: "Transaction fee",
        features: [
            "Everything in Free",
            "Mobile Money & Bank payments",
            "Instant wallet settlements",
            "Automated receipts",
            "Priority WhatsApp support"
        ],
        isPopular: true,
        ctaText: "Activate ZiroKash",
        ctaVariant: "default"
    }
];

/**
 * Trust badges for hero section
 */
export const trustBadges = [
    { icon: CheckCircle, text: "No setup fees" },
    { icon: CheckCircle, text: "Cancel anytime" },
    { icon: CheckCircle, text: "24/7 support" }
];

/**
 * Animation configuration constants
 */
export const ANIMATION_CONFIG = {
    TESTIMONIAL_INTERVAL: 5000, // 5 seconds
    PARTICLE_COUNT: 20,
    STATS_THRESHOLD: 0.3
} as const;
