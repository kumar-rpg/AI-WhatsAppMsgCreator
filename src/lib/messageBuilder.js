export const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"];
export const ALL_STAGES = [...STAGES, "Rejected"];

const TIMELINE = {
  Applied: "You can expect an update on your initial review within 3–5 working days.",
  Screening: "You can expect a screening outcome within 3–5 working days.",
  Interview: "You can expect an interview outcome within 5–7 working days.",
  Offer: "Please note this offer requires a response within 2–3 working days.",
  Hired: "Onboarding details, including your first-day schedule, will be sent within 2 working days.",
  Rejected: "This decision is final for this application.",
};

const OPENING = {
  Applied: (pos, track) =>
    `Thank you for applying for the ${pos} ${track} position with us. We've received your application and it is now with our recruitment team for initial review.`,
  Screening: (pos, track) =>
    `Your application for the ${pos} ${track} position has progressed to the Screening stage. Our team is currently reviewing your candidacy in detail.`,
  Interview: (pos, track) =>
    `You've progressed to the Interview stage for the ${pos} ${track} position. Thank you for your time so far in the process.`,
  Offer: (pos, track) =>
    `Congratulations — you've reached the Offer stage for the ${pos} ${track} position.`,
  Hired: (pos, track) =>
    `Welcome aboard! You've been confirmed for the ${pos} ${track} position.`,
  Rejected: (pos, track) =>
    `Thank you for taking the time to apply for the ${pos} ${track} position, and for the effort you put into the process. After careful consideration, we will not be proceeding with your application on this occasion.`,
};

const CONTACT =
  "If you have any questions, feel free to reply directly to this WhatsApp number, or email us at hr@cortexrobotics.my.";

export function buildMessage({ name, position, track, stage }) {
  const safeName = (name || "there").trim();
  const safePosition = (position || "the role").trim();

  const greeting = `Hi ${safeName},`;
  const opening = OPENING[stage](safePosition, track);
  const timeline =
    stage === "Rejected"
      ? "We encourage you to apply again for future opportunities that match your experience."
      : `You're currently at the ${stage} stage. ${TIMELINE[stage]}`;
  const signOff = `${CONTACT}\n\nWarm Regards,\n\nHuman Resources Dept\nCORTEX ROBOTICS`;

  return `${greeting}\n\n${opening}\n\n${timeline}\n\n${signOff}`;
}
