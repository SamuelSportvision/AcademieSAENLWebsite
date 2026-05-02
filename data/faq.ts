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
      "Sports, Arts, Education Academy (SAE Academy) is an Elite After-School Development Program that combines structured weekly development in sport or art with qualified coaching. We partner with established local sports organizations to give athletes and artists the time, facilities, and coaching they need to develop at a high level.",
  },
  {
    category: "General",
    question: "What's included in the $62.50/day program fee?",
    answer:
      "The daily fee covers a complete, end-to-end after-school solution — far more than just a practice. Each day includes:\n\n• School pickup at the end of the school day\n• Safe, supervised transportation to the training facility\n• 1.5 hours of structured, sport-specific instruction\n• Elite coaching from qualified partner organizations\n• Access to premium training facilities\n• A seamless 3:00–5:00 PM solution for working families\n\nYou're investing in your athlete's development and your family's weekday routine at the same time.",
  },
  {
    category: "General",
    question: "What sports and disciplines are available?",
    answer:
      "We currently offer programming in Hockey, Cheerleading, Volleyball, Baseball, Boxing, Dance, and Soccer. Each discipline is supported by a partner organization and qualified coaches.",
  },
  {
    category: "General",
    question: "What happens if the 20-student minimum is not met — will I get my deposit back?",
    answer:
      "Yes. If the minimum requirement of 20 students is not met, all program deposits paid at registration will be fully refunded.",
  },
  {
    category: "General",
    question: "Where can I drop my athlete's hockey bag?",
    answer:
      "Hockey bags can be dropped off in the morning at the arena in an assigned dressing room.",
  },
  {
    category: "General",
    question: "Can I withdraw my child from the program?",
    answer:
      "Participation in the SAE Academy program is a full-year commitment. Should you choose to withdraw before the end of the program year, cancellation fees will apply.",
  },
  // Registration
  {
    category: "Registration",
    question: "How do I join the mailing list?",
    answer:
      "You can join our mailing list from any sport page or from the navigation bar — click 'Join Our Mailing List' and complete the short form. You'll be among the first to hear about program updates and availability.",
  },
  {
    category: "Registration",
    question: "Can I register for more than one sport or discipline?",
    answer:
      "At SAE Academy, we strongly believe in the power of multi-sport athletes, and registering for more than one sport is permitted.",
  },
  {
    category: "Registration",
    question: "Who should I contact for general inquiries?",
    answer:
      "For any questions about the program, registration, or eligibility, please email us at info@saeacademynl.com. We aim to respond within 1–2 business days.",
  },
  // Tax & Finances
  {
    category: "Tax & Finances",
    question: "Why is SAE Academy priced at $62.50/day?",
    answer:
      "The $62.50 daily rate reflects the true cost of delivering an Elite After-School Development Program — not just a practice. Here's where the value goes:\n\n• Transportation is the single largest cost. We operate safe, supervised transit from your child's school to the training facility every program day.\n• School pickup is included. Your child is collected directly from their participating school at the end of the school day.\n• 1.5 hours of structured, sport-specific instruction is included — not free play or supervised time.\n• Top coaches and premium facilities are included. We partner with established sports organizations and train at the same venues used by leading local programs.\n• It's a flexible add-on, not full-time childcare. Parents pay only for the days their child is enrolled — there's no full-day daycare overhead built into the price.\n• Eligible tax incentives may reduce the total cost. Many families qualify for the NL Physical Activity Tax Credit (up to $2,000/family/year) and federal child-care expense deductions, lowering the real out-of-pocket cost significantly.\n\nWhen you compare to the cost of separate transportation, private coaching, and facility access, the daily rate delivers all of it in one seamless 3:00–5:00 PM solution.",
  },
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
      "Yes. If you require a receipt for tax purposes, please contact us at info@saeacademynl.com with your name and registration details and we will provide the documentation you need.",
  },
];
