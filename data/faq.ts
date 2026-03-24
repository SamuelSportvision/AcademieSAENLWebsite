export interface FaqItem {
  question: string;
  answer: string;
  category: "General" | "Registration" | "Tax & Finances";
}

export const faqs: FaqItem[] = [
  // General
  {
    category: "General",
    question: "What is the Sports, Arts, Education Academy?",
    answer:
      "Sports, Arts, Education Academy (SAE Academy) is a Sports Studies program that started in New Brunswick that combines daily athletic or artistic training with a flexible academic schedule. We partner with established local sports organizations and schools to give student-athletes and artists the time, facilities, and coaching they need to develop at a high level.",
  },
  {
    category: "General",
    question: "Which schools are part of the program?",
    answer:
      "We currently work with 12 partner schools in the St. John's / Newfoundland area, including Holy Trinity Elementary, St. Francis of Assisi, Mary Queen of Peace, Paradise Intermediate, and more. See our full list on the [Schools page](/schools).",
  },
  {
    category: "General",
    question: "What sports and disciplines are available?",
    answer:
      "We currently offer programming in Hockey, Cheerleading, Volleyball, Baseball, Basketball, Boxing, Dance, and Soccer. Each discipline is supported by a partner organization and qualified coaches.",
  },
  // Registration
  {
    category: "Registration",
    question: "How do I register?",
    answer:
      "Registration is handled through TeamSnap. You can find the registration link on each individual sport page. Click 'Register Now' on the sport of your choice and complete the form online.",
  },
  {
    category: "Registration",
    question: "Can I register for more than one sport or discipline?",
    answer:
      "Please reach out to us directly at info@academiesae.com to discuss multi-discipline options. Scheduling and availability may vary.",
  },
  {
    category: "Registration",
    question: "Who should I contact for general inquiries?",
    answer:
      "For any questions about the program, registration, or eligibility, please email us at info@academiesae.com. We aim to respond within 1–2 business days.",
  },
  // Tax & Finances
  {
    category: "Tax & Finances",
    question: "Is there a provincial tax credit for registering in the program?",
    answer:
      "A refund‑eligible provincial tax credit for fees paid to register for programs or memberships that involve significant physical activity.\n\nMaximum amount: Up to $2,000 per family per year\n\nEligible programs: Registered sports and recreation activities that include significant physical activity (e.g., soccer, swimming, martial arts, etc.). It's generally not designed specifically for academic or general after‑school care, but some after‑school physical programs may qualify if they meet the activity requirement.",
  },
  {
    category: "Tax & Finances",
    question: "Can I claim program fees as a child-care expense on my federal taxes?",
    answer:
      "On the federal income tax return, eligible child‑care expenses (including before/after‑school care) can be deducted to reduce taxable income. This is not a provincial tax credit but impacts total tax payable.\n\nFees paid for licensed child care, after‑school care, day camps, etc., which were necessary for an individual (or spouse) to earn income, study, or run a business.\n\nThe deduction flows through to reduce federal tax owed, and can indirectly reduce provincial tax payable too.",
  },
  {
    category: "Tax & Finances",
    question: "Can I get a receipt for tax purposes?",
    answer:
      "Yes. If you require a receipt for tax purposes, please contact us at info@academiesae.com with your name and registration details and we will provide the documentation you need.",
  },
];
