// frontend/src/scripts/callScripts.ts

export type ScriptSectionId =
  | "INTRO"
  | "CONFIRM_INFO"
  | "FIND_WINDOW"
  | "DELIVERY_EXPLAIN"
  | "SCHEDULE_APPT"
  | "SEND_TEXT"
  | "SOLIDIFY";

export type ScriptType =
  | "GLOBE_INTRO"       // Final expense / new lead
  | "GLOBE_LAPSE"       // Lapsed policy quality control
  | "POS"               // Policy owner service / POS check-up
  | "D_CARD"            // D-Card / renewal benefits
  | "D_CARD_LAPSED"     // Lapsed D-Card / POS angle
  | "FINAL_EXPENSE"     // Final expense request
  | "CSK"               // Child Safe Kit
  | "BENEFICIARY_REF"   // Beneficiary referral
  | "LAPSED_POS"        // Lapsed POS
  | "RENEWAL_D_CARD"    // Short renewal version
  | "GENERIC_REVIEW";   // Generic “review/renew/update benefits”

export interface ScriptSection {
  id: ScriptSectionId;
  title: string;
  body: string;
}

export interface ScriptDefinition {
  type: ScriptType;
  label: string;
  sections: ScriptSection[];
}

// Scripts are paraphrased from your PDFs and wired with NLP patterns:
// - Frame as review / delivery, not a sales call
// - Shrink commitment (“about 10 minutes”)
// - Future pacing (“so your family never has to…”)
// - Open-ended scheduling (“What does your evening usually look like…?”)
// - Always moving toward booking the virtual presentation. [file:1][file:3]

export const SCRIPTS: ScriptDefinition[] = [
  //
  // 1) Globe Intro – new FE lead
  //
  {
    type: "GLOBE_INTRO",
    label: "Globe Intro – New Final Expense Lead",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with Globe Life. " +
          "I’m getting back to you about the life insurance request you sent in—it shows here you haven’t actually received your information yet. " +
          "I just want to make sure you get exactly what you asked for without it slipping through the cracks.",
      },
      {
        id: "CONFIRM_INFO",
        title: "Confirm Info",
        body:
          "Before I do anything else, let me make sure I’m looking at the right person. " +
          "What’s the best mailing address for you right now, and is this still your best email? " +
          "Who else is usually involved when you make decisions like this—do you have a spouse or partner that should see everything at the same time?",
      },
      {
        id: "FIND_WINDOW",
        title: "Find Window / Emotional Reason",
        body:
          "Most of the families I talk to either just went through a loss, or they simply don’t want to leave a mess for their kids or spouse. " +
          "What was it for you—what had you thinking it was time to get this handled? " +
          "Who were you picturing when you filled that form out and thought, ‘I don’t want them stuck with this’?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Quick Virtual Presentation",
        body:
          "The easiest way to take care of this—and the way that keeps it simple—is for me to hop on a quick virtual call with you and your spouse, " +
          "walk you through what you qualify for, and let you decide what makes sense. " +
          "I handle all the heavy lifting; you just see the options on the screen so nothing feels like a surprise.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Open-Ended Close",
        body:
          "I only need about 30 minutes to show you everything properly, and we’ll keep the first chunk to about 10 minutes just to make sure it fits your budget. " +
          "What does your normal evening look like after work this week—when are you usually home and settled, feet up, phone nearby?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link / Shrink Commitment",
        body:
          "Perfect—that actually lines up well with my schedule. " +
          "Here’s what I’ll do: I’ll send you a text with a link to our meeting so you don’t have to remember anything or write anything down. " +
          "When that text hits your phone, what do you see—does it show up under my name or as a short link?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify – Always Be Closing",
        body:
          "Great, that means you’ll see the reminders too so it’s impossible to forget. " +
          "Do me a favor so I can stay on time for everybody—hop on the call about five minutes early so if there are any tech issues, we fix them before your 30 minutes starts. " +
          "So we’re set for (day) at (time); when you picture that time of day, what’s usually going on at home so we can make sure nothing gets in the way?",
      },
    ],
  },

  //
  // 2) Globe Lapse – quality control
  //
  {
    type: "GLOBE_LAPSE",
    label: "Globe Lapse – Quality Control Call",
    sections: [
      {
        id: "INTRO",
        title: "Intro / Quality Control Frame",
        body:
          "Hi ______, this is (agent name) with American Income—your insurance company. " +
          "I’m calling from the quality control side, because our system shows your policy fell off and I want to make sure your family isn’t accidentally uncovered.",
      },
      {
        id: "FIND_WINDOW",
        title: "What Happened / Open-Ended",
        body:
          "Before we fix anything, help me understand what actually happened on your end. " +
          "When the payments stopped, was it more of a budget thing, a life event, or did it just slip past you and no one reached out? " +
          "What changed between when you first set this up and today?",
      },
      {
        id: "CONFIRM_INFO",
        title: "Confirm Policy Info",
        body:
          "Got it—that’s more common than you’d think, and it’s exactly why I’m calling before something serious happens. " +
          "Let me make sure we’re looking at the right file: what’s your best mailing address now, and is this still the right number if we ever need to reach your family?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Fix via Quick Review",
        body:
          "The good news is we can usually get this cleaned up pretty quickly, " +
          "but it has to be done the right way so your family doesn’t find out there was a gap at the worst possible time. " +
          "The fastest way is to jump on a short virtual review where I show you what you qualify for now and make sure it fits your budget better than last time.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Future Pace Protection",
        body:
          "We’re talking about maybe 20–30 minutes together so you can see everything, and I’ll keep the first 10 focused on fixing the gap. " +
          "Looking at the next day or two, when does your day usually slow down enough that you could sit for 30 minutes without rushing—more like early evening, or later once things calm down?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link / Remove Friction",
        body:
          "Perfect—that’s actually one of my better openings. " +
          "I’ll send over the virtual meeting link by text so you don’t have to dig through email or remember logins. " +
          "When you look at your phone, what’s the easiest way for you to join—laptop on the table, or just tap the link on your phone?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify – Keep Them Committed",
        body:
          "That’ll work great; I’ve done plenty of these while people are making dinner or sitting on the couch. " +
          "To respect your time and everyone else’s, do me a favor and hop on about five minutes before (time) so we can start right on time and be done on time. " +
          "So we’re locked in for (day) at (time); who else will be sitting with you so I can be sure I explain it in a way that makes sense for both of you?",
      },
    ],
  },

  //
  // 3) POS – existing policy holder check-up
  //
  {
    type: "POS",
    label: "POS – Policy Check-Up & Benefit Renewal",
    sections: [
      {
        id: "INTRO",
        title: "Intro / Existing Client Frame",
        body:
          "Hi ______, this is (agent name) with American Income—your life insurance company. " +
          "We sat down with you before when you first set your policy up, and it’s time for your policy check‑up and benefit renewal so everything stays current.",
      },
      {
        id: "CONFIRM_INFO",
        title: "Confirm Info",
        body:
          "A lot can change in a year, so before I do anything else, let’s make sure your file actually matches real life. " +
          "What’s your best mailing address now, what email do you actually check, and who usually looks over this kind of stuff with you—spouse, partner, adult child?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Review / Not a Sales Call",
        body:
          "This isn’t about starting from scratch or pushing you into something new. " +
          "My job is to walk you through the benefits you already have, see if anything’s outdated, " +
          "and show you any gaps so you can decide if you want to adjust anything. " +
          "It’s more like a yearly tune‑up than a sales pitch.",
      },
      {
        id: "FIND_WINDOW",
        title: "Find Time Window",
        body:
          "We can take care of the whole thing over a quick virtual call so you can see everything on screen together instead of trying to remember details later. " +
          "Thinking about your week, when do you usually have a little breathing room—early evening after work, or more like later at night once things settle down?",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Shrink Commitment",
        body:
          "The full review takes about 20–30 minutes, and I’ll keep the first 10 focused on making sure you’re not missing anything important. " +
          "Looking at (today/tomorrow), what’s a specific time where you know you could sit for 30 minutes without rushing?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great, that fits. I’ll text you the meeting link so you don’t have to go hunting for anything. " +
          "When that text comes through, what will help you remember—do you like to set a reminder on your phone, or just rely on the text notifications I send?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify – Future Pace",
        body:
          "Perfect. The whole point is to make sure your coverage still matches the way your life looks now, not how it looked the last time we talked. " +
          "Do me a favor and jump on five minutes early so we can respect your schedule and get you back to your evening on time. " +
          "So we’re set for (day) at (time); what usually happens right before that time so we can plan around it?",
      },
    ],
  },

  //
  // 4) D-Card – benefit / package renewal
  //
  {
    type: "D_CARD",
    label: "D-Card – New Package / Renewal Call",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with Globe Life. " +
          "We sat down with you before and set up a benefit package, and our system shows it’s time to renew and update that package for this year.",
      },
      {
        id: "CONFIRM_INFO",
        title: "Confirm Info",
        body:
          "Let’s make sure the benefits are attached to the right person. " +
          "What’s your best mailing address now, and what email do you actually use? " +
          "Is there anyone else, like a spouse or partner, who usually wants to be in the loop when we go over benefits?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Renewal / Review",
        body:
          "Back when we first set this up, we built the package based on the information you gave us then. " +
          "A few things need to be reviewed and renewed so there aren’t any gaps or surprises if something happens. " +
          "We’ll just walk through what you already have, update what changed, and you decide if anything needs tweaking.",
      },
      {
        id: "FIND_WINDOW",
        title: "Find Time Window",
        body:
          "We can do the whole thing over a quick virtual call so you can see the documents instead of me trying to explain them over the phone. " +
          "When you look at your evening schedule, what part of the day is usually calm enough for a 20–30 minute review?",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Open-Ended Close",
        body:
          "It only takes about 10 minutes to walk through the renewal basics and then a few extra minutes if you want to adjust anything. " +
          "For (today/tomorrow), what exact time would let you sit down, click a link, and focus for that short window?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great, that works. I’ll text you the link for the call as soon as we hang up so it’s sitting right on your phone. " +
          "When that message pops up, what’s the easiest device for you to use—your phone, or do you want to pull it up on a laptop or tablet?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify Commitment",
        body:
          "Perfect. I’ll also have the system send a reminder so you don’t have to keep it in your head all day. " +
          "Just do me a favor and hop on a couple of minutes early so we can start right at (time) and get you done quickly. " +
          "So we’re locked in for (day) at (time); what usually happens right after that time so I know how tight we are on your schedule?",
      },
    ],
  },

  //
  // 5) D-Card Lapsed / POS style
  //
  {
    type: "D_CARD_LAPSED",
    label: "D-Card – Lapsed / POS Style Call",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with American Income—your life insurance company. " +
          "I’m calling from the quality control side because it looks like some of the benefits we set up for you stopped, " +
          "and I want to make sure you’re not missing something you thought you still had.",
      },
      {
        id: "FIND_WINDOW",
        title: "What Happened",
        body:
          "Help me understand your side: when this dropped off, was it more that life got busy, the budget shifted, or something else changed? " +
          "What’s the main thing that made it feel okay to let it go at the time?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Quick Reinstatement Review",
        body:
          "The goal here isn’t to lecture you—it’s to make sure your family isn’t counting on something that quietly disappeared. " +
          "The fastest way to figure out what can be put back in place, and what actually makes sense now, is a short virtual review where we walk through it together.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Always Closing",
        body:
          "That review only takes about 20 minutes. Looking at the next day or two, " +
          "when would it be easiest for you to click a link and give me that short window—more like earlier evening, or later after everything else is done?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Perfect, I’ll reserve that spot for you. I’ll text the link for the call so all you have to do is tap it at that time. " +
          "What device do you usually prefer to use for stuff like this—your phone, tablet, or computer?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Great—that tells me exactly how to structure the call so it’s smooth on your end. " +
          "Do me a favor and hop on a couple of minutes early so we can make sure the link works and we don’t waste your 20 minutes. " +
          "So we’re set for (day) at (time); who else will be there with you so I can be sure I cover what they care about too?",
      },
    ],
  },

  //
  // 6) Final Expense – FE request
  //
  {
    type: "FINAL_EXPENSE",
    label: "Final Expense – FE Request",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with Globe Life. " +
          "I’m following up on your request for final expense coverage—those plans that make sure your family isn’t stuck with the cost when you pass away. " +
          "It shows you haven’t received the information yet, so I’m stepping in to fix that.",
      },
      {
        id: "CONFIRM_INFO",
        title: "Confirm Info",
        body:
          "Before I show you anything, let’s make sure I’ve got your details right. " +
          "What mailing address should those documents be tied to now, and what’s the best email for you? " +
          "Who were you thinking about protecting when you filled that out—kids, spouse, grandkids?",
      },
      {
        id: "FIND_WINDOW",
        title: "Reason / Emotional Tie-In",
        body:
          "Most people I talk to either went through a loss and saw how messy it was, or they just don’t want to put that on their family. " +
          "What was going on in your world that made you say, ‘Yeah, I should finally take care of this’?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Quick Presentation",
        body:
          "The easiest way to handle this is for us to jump on a short virtual presentation where I show you exactly what you qualify for at your age and health, " +
          "and you tell me what fits your budget. I’m not here to pressure you—just to put real numbers in front of you so you can decide.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Shrink Commitment",
        body:
          "We’ll need about 30 minutes together to do it properly, but the first 10 is really just confirming information and showing you the range. " +
          "Thinking about the next day or so, what’s a specific time when you’re usually home, settled, and can give me those 30 minutes?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great, that works on my end too. I’ll text you the link for the presentation as soon as we hang up. " +
          "When you see that text come through, what will help you remember—do you like to pin the message, set a reminder, or just rely on my text reminders?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Perfect. This way you’ll know exactly what’s in place and what your family can count on, instead of guessing. " +
          "Do me a favor and hop on five minutes early so we’re not wasting any of your time. " +
          "So we’re locked in for (day) at (time); what usually happens right after that time so I know how tight we need to be?",
      },
    ],
  },

  //
  // 7) CSK – Child Safe Kit
  //
  {
    type: "CSK",
    label: "CSK – Child Safe Kit Request",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name). I’m reaching out about the Child Safe Kits you requested. " +
          "Our system shows you haven’t actually received the walk‑through yet, and I want to make sure the kits don’t just sit in a drawer unused.",
      },
      {
        id: "CONFIRM_INFO",
        title: "Confirm Info & Kits",
        body:
          "First things first, let’s confirm I’ve got the right details. " +
          "What’s your current mailing address, and how many kids are you planning to use the kits for? " +
          "Is there a spouse or co‑parent who should be on the call too so you both know how to use them if something ever happens?",
      },
      {
        id: "FIND_WINDOW",
        title: "Reason / Emotional Tie-In",
        body:
          "Most parents request these because they heard a story that shook them, or they just want to be prepared and never need it. " +
          "What had you thinking, ‘We should probably have this just in case’?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Quick Walkthrough",
        body:
          "The kits only really help if you know exactly how to fill them out and what to do if they’re ever needed. " +
          "So my job is to do a quick virtual walk‑through with you so it’s crystal clear and off your mental to‑do list.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Always Closing",
        body:
          "That walk‑through takes about 15–20 minutes total. " +
          "When you think about your week, when is it easiest for you to sit down, click a link, and focus for that short window—more like early evening, or later once the kids are winding down?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great, that fits. I’ll send you the link by text as soon as we hang up so it’s right on your phone. " +
          "Will you most likely join from your phone, or do you like to hop on from a tablet or laptop at the table?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Perfect. That helps me picture how to keep it simple on your side. " +
          "Do me a favor and hop on a couple of minutes early so we can work through any ‘tech stuff’ before the kids start asking questions. " +
          "So we’re set for (day) at (time); what usually happens in your house right before that time?",
      },
    ],
  },

  //
  // 8) Beneficiary Referral – insured set this up
  //
  {
    type: "BENEFICIARY_REF",
    label: "Beneficiary Referral – Insured Set This Up",
    sections: [
      {
        id: "INTRO",
        title: "Intro / Leverage Insured",
        body:
          "Hi ______, this is (agent name) with American Income. " +
          "[Insured name] set some things up with us and listed you specifically as a beneficiary, " +
          "which means my job is to make sure you understand what they put in place for you and how it works.",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Purpose",
        body:
          "This isn’t about selling you something new. " +
          "It’s about walking you through what [insured name] set up so that if something happens to them, you know exactly what to do and what you’re entitled to. " +
          "We also offer some benefits on your side, but you’re always in control of what you use.",
      },
      {
        id: "FIND_WINDOW",
        title: "Find Time Window",
        body:
          "The clearest way to do this is a quick virtual call where I can show you everything on screen. " +
          "It takes about 10–20 minutes. When in the next day or two would it be easiest for you to sit down and review this once so you don’t have to wonder later?",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Either/Or Close",
        body:
          "Would tomorrow work better for you in the morning, or is evening usually calmer in your world? " +
          "Once we pick the time, I’ll lock that slot for you so we can just focus and be done.",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Perfect. I’ll send you the link for that time by text so it’s easy to join. " +
          "When you see that text from me, what will help you remember, given everything else you have going on?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Good—that tells me you’re serious about actually understanding what they set up for you. " +
          "Hop on a couple of minutes early so we can start on time and respect your schedule. " +
          "So we’re scheduled for (day) at (time); before we hang up, what questions do you already know you want answered when we meet?",
      },
    ],
  },

  //
  // 9) Lapsed POS – lapsed policy + POS
  //
  {
    type: "LAPSED_POS",
    label: "Lapsed POS – Policy Lapsed + POS Angle",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with American Income, your life insurance company. " +
          "I’m calling because it looks like your policy and some related benefits have lapsed, " +
          "and I want to make sure you’re not assuming you have something that isn’t there anymore.",
      },
      {
        id: "FIND_WINDOW",
        title: "What Changed",
        body:
          "Walk me through what changed on your end: when the policy dropped, was that a conscious decision, a budget issue, or did it just happen without you noticing right away? " +
          "What was the thought process at the time?",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Review / Rebuild",
        body:
          "A lot of people I talk to in your situation think they’re covered and then find out later they weren’t. " +
          "My role is to help you see exactly where you stand now and what your options are to fix it, " +
          "so you’re not left guessing. We do that in one short virtual review.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Always Closing",
        body:
          "Plan on about 20–30 minutes for us to walk through everything. " +
          "Looking at your schedule, when in the next day or two would it actually feel realistic to sit down and handle this once so you don’t have to think about it again?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great. I’ll text you the link for that time so it’s right in front of you when we’re ready. " +
          "Are you more likely to join from your phone while you’re at home, or do you prefer using a computer?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Perfect. That helps me set the call up in a way that’s smooth for you. " +
          "Do me a favor and hop on a few minutes early so we can start right at (time) and have you done on time. " +
          "So we’re set for (day) at (time); who else should be present so you’re not having to explain everything later?",
      },
    ],
  },

  //
  // 10) Renewal D-Card – short version
  //
  {
    type: "RENEWAL_D_CARD",
    label: "Renewal / D-Card – Short Version",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with Globe Life. " +
          "I’m calling because the benefit package we set up for you needs its yearly check‑up and renewal.",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Quick Check-Up",
        body:
          "This is just a quick review of benefits you already have to make sure nothing is missing, outdated, or conflicting with what you thought you had. " +
          "We’ll walk through it together, and you decide if any changes make sense.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Shrink Commitment",
        body:
          "It’s about a 10–15 minute review. " +
          "Looking at your evening, when would it be easiest for you to click a link and give it that short window so it’s off your plate for the year?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great. I’ll text the link for that time as soon as we hang up. " +
          "When that text shows up, what’s the best way for you to remember—do you like to set an alarm or just rely on the reminders I send?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Perfect. Do me a favor and hop on a couple of minutes early so we can start right at (time). " +
          "So we’re locked in for (day) at (time); what usually happens immediately after that so I can be mindful of your timing?",
      },
    ],
  },

  //
  // 11) Generic Review – flexible catch-all
  //
  {
    type: "GENERIC_REVIEW",
    label: "Generic Review – Flexible Script",
    sections: [
      {
        id: "INTRO",
        title: "Intro",
        body:
          "Hi ______, this is (agent name) with American Income. " +
          "I’m reaching out to review and update your benefit package so it actually matches where your life is today, not where it was the last time we talked.",
      },
      {
        id: "DELIVERY_EXPLAIN",
        title: "Explain Review / Not Sales",
        body:
          "This is more of a review call than a sales call. " +
          "My job is to show you what’s in place, point out any gaps, " +
          "and answer questions so you can decide what you want to keep exactly the same and what you might want to adjust.",
      },
      {
        id: "SCHEDULE_APPT",
        title: "Schedule – Always Closing",
        body:
          "The review itself is about 20 minutes. " +
          "Thinking about the next couple of days, when would it feel easiest to sit down, click a link, and just get this handled so you don’t have to keep thinking about it?",
      },
      {
        id: "SEND_TEXT",
        title: "Send Link",
        body:
          "Great. I’ll text you the meeting link so there’s nothing to print, save, or remember. " +
          "When that text arrives, what device will you most likely grab to join—your phone, tablet, or computer?",
      },
      {
        id: "SOLIDIFY",
        title: "Solidify",
        body:
          "Perfect. That gives me everything I need to make it smooth on your side. " +
          "Do me a favor and hop on about five minutes before (time) so we can start on time and finish on time. " +
          "So we’re set for (day) at (time); what’s the one thing you definitely want clarity on when we talk?",
      },
    ],
  },
];

// Updated outcomes with your extra statuses
export const OUTCOMES = [
  "Presentation accepted",
  "Insurance sold",
  "Insurance offer rejected",
  "Presentation rejected",
  "Not qualified",
  "No answer / voicemail",
  "hung up / call disconnected",
] as const;

export type CallOutcome = (typeof OUTCOMES)[number];