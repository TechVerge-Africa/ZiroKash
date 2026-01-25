// Form Templates Library - Use-Case Focused
// Designed with real-world scenarios in mind

export interface FormTemplate {
    id: string;
    name: string;
    category: string;
    icon: string;
    description: string;
    whenToUse: string; // NEW: Helps users quickly identify if this is for them
    defaultTheme: string;
    receiptHeader: string;
    title: string;
    formDescription: string;
    isFeatured?: boolean;
    fields: Array<{
        type: "text" | "email" | "dropdown" | "amount";
        label: string;
        required: boolean;
        options?: string[];
        defaultValue?: string;
    }>;
}

export const TEMPLATE_CATEGORIES = [
    { id: "quick", name: "Quick & Simple", icon: "⚡" },
    { id: "education", name: "Schools & Education", icon: "🎓" },
    { id: "business", name: "Business & Stores", icon: "💼" },
    { id: "nonprofit", name: "Donations & Non-Profit", icon: "❤️" },
    { id: "events", name: "Events & Tickets", icon: "🎫" },
    { id: "other", name: "Other", icon: "✨" },
];

export const FORM_TEMPLATES: FormTemplate[] = [
    // === QUICK & SIMPLE (For novices and quick setup) ===
    {
        id: "simple-payment",
        name: "Simple Payment",
        category: "quick",
        icon: "⚡",
        description: "Just collect name, amount, and done",
        whenToUse: "Perfect for in-store QR codes, simple cash collections, or quick payments",
        defaultTheme: "#0056D2",
        receiptHeader: "PAYMENT RECEIPT",
        title: "Make a Payment",
        formDescription: "Quick and easy payment",
        isFeatured: true,
        fields: [
            { type: "text", label: "Your Name", required: true },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "simple-with-contact",
        name: "Simple + Contact",
        category: "quick",
        icon: "📱",
        description: "Name, phone, and amount",
        whenToUse: "When you need to follow up with customers (deliveries, callbacks)",
        defaultTheme: "#3B82F6",
        receiptHeader: "PAYMENT RECEIPT",
        title: "Payment Form",
        formDescription: "Please complete your payment",
        isFeatured: true,
        fields: [
            { type: "text", label: "Full Name", required: true },
            { type: "text", label: "Phone Number", required: true },
            { type: "amount", label: "Amount to Pay", required: true, defaultValue: "0" },
        ],
    },

    // === EDUCATION (Schools have many different fee types) ===
    {
        id: "school-fees-basic",
        name: "School Fees (Basic)",
        category: "education",
        icon: "🎓",
        description: "Simple school fees collection",
        whenToUse: "Basic school fees - just student name, ID, and amount",
        defaultTheme: "#0056D2",
        receiptHeader: "SCHOOL FEES RECEIPT",
        title: "School Fees Payment",
        formDescription: "Pay your school fees online",
        isFeatured: true,
        fields: [
            { type: "text", label: "Student Name", required: true },
            { type: "text", label: "Student ID / Admission Number", required: true },
            { type: "text", label: "Class / Grade", required: true },
            { type: "text", label: "Parent/Guardian Phone", required: true },
            { type: "dropdown", label: "Term", required: true, options: ["First Term", "Second Term", "Third Term"] },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "school-fees-detailed",
        name: "School Fees (Detailed)",
        category: "education",
        icon: "🎓",
        description: "Comprehensive school fees with email receipt",
        whenToUse: "When you need parent emails for receipts and detailed records",
        defaultTheme: "#0056D2",
        receiptHeader: "OFFICIAL SCHOOL FEES RECEIPT",
        title: "School Fees Payment",
        formDescription: "Complete school fees payment - receipt will be sent to parent email",
        fields: [
            { type: "text", label: "Student Full Name", required: true },
            { type: "text", label: "Student ID", required: true },
            { type: "text", label: "Class/Grade", required: true },
            { type: "text", label: "Parent/Guardian Name", required: true },
            { type: "email", label: "Parent Email", required: true },
            { type: "text", label: "Phone Number", required: true },
            { type: "dropdown", label: "Term/Semester", required: true, options: ["Term 1", "Term 2", "Term 3"] },
            { type: "dropdown", label: "Payment For", required: false, options: ["Full Fees", "Partial Payment", "Balance"] },
            { type: "amount", label: "Amount Paying", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "departmental-dues",
        name: "Departmental Dues",
        category: "education",
        icon: "🏛️",
        description: "For faculty/department contributions",
        whenToUse: "Department-specific fees (like Science dept, Arts faculty, etc.)",
        defaultTheme: "#7C3AED",
        receiptHeader: "DEPARTMENTAL DUES RECEIPT",
        title: "Departmental Dues Payment",
        formDescription: "Pay your departmental dues",
        fields: [
            { type: "text", label: "Student Name", required: true },
            { type: "text", label: "Student ID", required: true },
            { type: "dropdown", label: "Department/Faculty", required: true, options: ["Science", "Arts", "Engineering", "Business", "Other"] },
            { type: "text", label: "Level/Year", required: true },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "hostel-fees",
        name: "Hostel / Accommodation Fees",
        category: "education",
        icon: "🏘️",
        description: "Student hostel and accommodation payments",
        whenToUse: "For managing hostel fees and room allocations",
        defaultTheme: "#059669",
        receiptHeader: "HOSTEL FEES RECEIPT",
        title: "Hostel Fees Payment",
        formDescription: "Pay your hostel/accommodation fees",
        fields: [
            { type: "text", label: "Student Name", required: true },
            { type: "text", label: "Student ID", required: true },
            { type: "dropdown", label: "Hostel Name", required: true, options: ["Hostel A", "Hostel B", "Hostel C", "Off-Campus"] },
            { type: "text", label: "Room Number", required: false },
            { type: "dropdown", label: "Academic Session", required: true, options: ["2024/2025", "2025/2026"] },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "school-organization-dues",
        name: "School Organization Dues",
        category: "education",
        icon: "⛪",
        description: "For religious groups, clubs, associations",
        whenToUse: "Chapel dues, mosque contributions, student union, clubs",
        defaultTheme: "#8B5CF6",
        receiptHeader: "ORGANIZATION DUES RECEIPT",
        title: "Organization Dues Payment",
        formDescription: "Pay your organization/group membership dues",
        fields: [
            { type: "text", label: "Full Name", required: true },
            { type: "text", label: "Student ID", required: false },
            { type: "dropdown", label: "Organization", required: true, options: ["Student Union", "Chapel", "Mosque", "Sports Club", "Other"] },
            { type: "text", label: "Membership Type", required: false },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },

    // === BUSINESS (Different scenarios need different approaches) ===
    {
        id: "qr-code-payment",
        name: "QR Code Payment",
        category: "business",
        icon: "📱",
        description: "Ultra-simple for in-store QR payments",
        whenToUse: "Perfect for stores, supermarkets, quick service - customer scans and pays",
        defaultTheme: "#0F172A",
        receiptHeader: "PAYMENT RECEIPT",
        title: "Pay Now",
        formDescription: "Scan & Pay",
        isFeatured: true,
        fields: [
            { type: "text", label: "Your Name (Optional)", required: false },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "online-store-checkout",
        name: "Online Store Checkout",
        category: "business",
        icon: "🛒",
        description: "For online shops and deliveries",
        whenToUse: "E-commerce, online stores, delivery services - need customer details",
        defaultTheme: "#3B82F6",
        receiptHeader: "ORDER PAYMENT RECEIPT",
        title: "Complete Your Purchase",
        formDescription: "Enter delivery details and complete payment",
        fields: [
            { type: "text", label: "Full Name", required: true },
            { type: "email", label: "Email Address", required: true },
            { type: "text", label: "Phone Number", required: true },
            { type: "text", label: "Delivery Address", required: true },
            { type: "text", label: "Order Notes", required: false },
            { type: "amount", label: "Total Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "invoice-payment",
        name: "Invoice Payment",
        category: "business",
        icon: "📄",
        description: "For accepting invoice payments",
        whenToUse: "When customers pay invoices for services or products",
        defaultTheme: "#0F172A",
        receiptHeader: "PAYMENT RECEIPT",
        title: "Invoice Payment",
        formDescription: "Pay your invoice securely",
        fields: [
            { type: "text", label: "Company/Business Name", required: true },
            { type: "text", label: "Contact Person", required: true },
            { type: "email", label: "Email Address", required: true },
            { type: "text", label: "Invoice Number", required: true },
            { type: "amount", label: "Payment Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "service-booking",
        name: "Service Booking Payment",
        category: "business",
        icon: "🔧",
        description: "For service providers (salons, repairs, consultants)",
        whenToUse: "Book and pay for appointments, consultations, services",
        defaultTheme: "#6366F1",
        receiptHeader: "BOOKING PAYMENT RECEIPT",
        title: "Service Booking & Payment",
        formDescription: "Secure your appointment with payment",
        fields: [
            { type: "text", label: "Your Name", required: true },
            { type: "email", label: "Email", required: true },
            { type: "text", label: "Phone Number", required: true },
            { type: "dropdown", label: "Service Type", required: true, options: ["Consultation", "Basic Service", "Premium Service"] },
            { type: "text", label: "Preferred Date/Time", required: false },
            { type: "amount", label: "Booking Fee", required: true, defaultValue: "0" },
        ],
    },

    // === DONATIONS (Anonymous vs Regular) ===
    {
        id: "anonymous-donation",
        name: "Anonymous Donation",
        category: "nonprofit",
        icon: "🎁",
        description: "No personal details required",
        whenToUse: "For donors who want to give anonymously - just amount",
        defaultTheme: "#10B981",
        receiptHeader: "DONATION RECEIPT",
        title: "Make an Anonymous Donation",
        formDescription: "Your donation makes a difference",
        isFeatured: true,
        fields: [
            { type: "dropdown", label: "Donation Purpose (Optional)", required: false, options: ["General Fund", "Building Project", "Charity", "Other"] },
            { type: "amount", label: "Donation Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "named-donation",
        name: "Named Donation",
        category: "nonprofit",
        icon: "❤️",
        description: "With donor recognition and email receipt",
        whenToUse: "When donors want receipts and recognition for their giving",
        defaultTheme: "#10B981",
        receiptHeader: "DONATION ACKNOWLEDGMENT",
        title: "Make a Donation",
        formDescription: "Thank you for your generous support",
        isFeatured: true,
        fields: [
            { type: "text", label: "Donor Name", required: true },
            { type: "email", label: "Email Address", required: true },
            { type: "text", label: "Phone Number", required: false },
            { type: "dropdown", label: "Donation Category", required: false, options: ["General Fund", "Building Project", "Scholarship Fund", "Emergency Relief", "Other"] },
            { type: "text", label: "In Honor/Memory Of (Optional)", required: false },
            { type: "amount", label: "Donation Amount", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "church-offering",
        name: "Church/Mosque Offerings",
        category: "nonprofit",
        icon: "⛪",
        description: "For religious organization tithes and offerings",
        whenToUse: "Digital offerings, tithes, special collections",
        defaultTheme: "#8B5CF6",
        receiptHeader: "OFFERING RECEIPT",
        title: "Give Your Offering",
        formDescription: "Support your place of worship",
        fields: [
            { type: "text", label: "Your Name (Optional)", required: false },
            { type: "email", label: "Email for Receipt (Optional)", required: false },
            { type: "dropdown", label: "Offering Type", required: true, options: ["Tithe", "Offering", "Special Collection", "Building Fund", "Mission"] },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },

    // === EVENTS ===
    {
        id: "event-simple",
        name: "Event Ticket (Simple)",
        category: "events",
        icon: "🎫",
        description: "Quick event registration",
        whenToUse: "Small events, workshops, meetups - name and ticket",
        defaultTheme: "#7C3AED",
        receiptHeader: "EVENT TICKET",
        title: "Event Registration",
        formDescription: "Secure your spot",
        fields: [
            { type: "text", label: "Full Name", required: true },
            { type: "email", label: "Email", required: true },
            { type: "text", label: "Phone Number", required: true },
            { type: "dropdown", label: "Ticket Type", required: true, options: ["General Admission - ₵100", "VIP - ₵300"] },
            { type: "amount", label: "Total", required: true, defaultValue: "0" },
        ],
    },
    {
        id: "conference-registration",
        name: "Conference/Workshop",
        category: "events",
        icon: "🎓",
        description: "Professional events with details",
        whenToUse: "Conferences, training, professional workshops - need full details",
        defaultTheme: "#F59E0B",
        receiptHeader: "CONFERENCE REGISTRATION",
        title: "Conference Registration",
        formDescription: "Register for the conference",
        fields: [
            { type: "text", label: "Full Name", required: true },
            { type: "email", label: "Email", required: true },
            { type: "text", label: "Phone", required: true },
            { type: "text", label: "Organization/Company", required: false },
            { type: "dropdown", label: "Registration Type", required: true, options: ["Early Bird - ₵200", "Regular - ₵300", "Group (3+) - ₵250 each", "Student - ₵150"] },
            { type: "text", label: "Dietary Requirements", required: false },
            { type: "amount", label: "Amount", required: true, defaultValue: "0" },
        ],
    },

    // === OTHER ===
    {
        id: "custom",
        name: "Start from Scratch",
        category: "other",
        icon: "✨",
        description: "Build your own custom form",
        whenToUse: "When none of the templates fit your specific needs",
        defaultTheme: "#0056D2",
        receiptHeader: "OFFICIAL RECEIPT",
        title: "",
        formDescription: "",
        fields: [],
    },
];

// Helper functions
export const getTemplatesByCategory = (categoryId: string) => {
    return FORM_TEMPLATES.filter(t => t.category === categoryId);
};

export const getFeaturedTemplates = () => {
    return FORM_TEMPLATES.filter(t => t.isFeatured);
};

export const searchTemplates = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return FORM_TEMPLATES.filter(
        t =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description.toLowerCase().includes(lowerQuery) ||
            t.whenToUse.toLowerCase().includes(lowerQuery) ||
            t.category.toLowerCase().includes(lowerQuery)
    );
};
