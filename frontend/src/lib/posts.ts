export interface Section {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Post {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  webinarSlug?: string;
  webinarTitle?: string;
  sections: Section[];
}

export const POSTS: Record<string, Post> = {
  'what-is-whole-life-insurance': {
    title: 'What Is Whole Life Insurance? (And Why It\'s Different From What You\'ve Heard)',
    excerpt: 'Most people think they understand whole life — until they learn what it actually does. Here\'s the plain-English version.',
    date: 'May 12, 2026',
    readTime: '5 min read',
    category: 'Life Insurance Basics',
    webinarSlug: 'whole-life-101',
    webinarTitle: 'Whole Life 101',
    sections: [
      {
        heading: 'Permanent vs. Temporary Coverage',
        paragraphs: [
          'When most people buy life insurance, they buy a term policy — coverage that lasts 10, 20, or 30 years and then disappears. Term insurance is affordable and serves a purpose, but it has one critical flaw: it ends. Whole life insurance does not.',
          'A whole life policy covers you from the day you buy it until the day you die — whether that\'s in 3 years or 53 years. The premium you pay in year one is the same premium you pay in year thirty. Nothing changes, nothing expires, and the coverage never needs to be renewed.',
          'That permanence matters most when you get older. The people who regret term insurance are almost always the ones who outlive it and then try to buy coverage again at 65, 70, or older — when premiums are dramatically higher or qualification becomes difficult.',
        ],
      },
      {
        heading: 'The Part Nobody Explains: Cash Value',
        paragraphs: [
          'Every whole life policy builds cash value — a savings component that grows inside your policy over time. A portion of every premium you pay goes into this account. It grows at a guaranteed rate, is not subject to market volatility, and belongs to you.',
          'You can borrow against your cash value tax-free during your lifetime. Many people use this for emergencies, education costs, or to supplement retirement income. It\'s not a get-rich-quick account, but it is a stable, guaranteed asset that grows quietly in the background of a good whole life policy.',
          'This is one of the biggest differences people miss when comparing whole life to term. Term insurance has zero cash value — when it ends, it\'s gone. Whole life builds an asset.',
        ],
      },
      {
        heading: 'Who Whole Life Is Right For',
        paragraphs: [
          'Whole life is a strong fit for anyone who wants permanent coverage, a fixed premium they can plan around, and a policy that builds value over time. It\'s especially valuable for families with long-term dependents, business owners, people who want to leave a legacy, and anyone who has seen a family member scramble for coverage late in life.',
          'It is also the foundation most financial professionals recommend building on first — before adding term layers on top for extra short-term coverage during high-need years like raising children or carrying a mortgage.',
          'The question isn\'t whether whole life makes sense. The question is what face amount, what premium, and what combination of coverage matches your situation. That\'s where a licensed agent becomes essential.',
        ],
      },
    ],
  },

  'is-your-income-protected': {
    title: 'Is Your Family\'s Income Protected If Something Happens to You?',
    excerpt: 'Your paycheck stops. The mortgage doesn\'t. Here\'s what income and mortgage protection insurance actually does — and why most families are one accident away from a crisis.',
    date: 'May 10, 2026',
    readTime: '6 min read',
    category: 'Income Protection',
    webinarSlug: 'income-mortgage-protection',
    webinarTitle: 'Income & Mortgage Protection',
    sections: [
      {
        heading: 'The Problem Nobody Plans For',
        paragraphs: [
          'Most people assume the worst-case scenario is death. But statistically, working-age Americans are far more likely to experience a serious illness or injury that takes them out of work for months — or permanently — than they are to die during their prime earning years.',
          'When income stops, fixed expenses don\'t pause with it. The mortgage payment arrives on the same day every month. Car payments, utilities, groceries, and childcare costs don\'t negotiate. A family that was financially stable can find themselves in crisis within 90 days of a lost income.',
          'Income and mortgage protection insurance exists specifically to close this gap. It\'s not a complicated product — it pays a benefit to your family when you can\'t.',
        ],
      },
      {
        heading: 'How Mortgage Protection Works',
        paragraphs: [
          'A decreasing term policy (also called mortgage protection) is tied to the remaining balance on your mortgage. The death benefit decreases over time, roughly matching the pace at which you pay down your loan. Because the risk to the insurance company decreases over time, these policies are often significantly less expensive than a standard level term.',
          'The result is that if you die with 18 years left on your mortgage, your family receives a benefit large enough to pay off what\'s left. They keep the house. They don\'t have to sell it, relocate, or take on a second job to cover a payment that\'s now impossible without your income.',
        ],
      },
      {
        heading: 'Stacking Term on Top of a Whole Life Base',
        paragraphs: [
          'One strategy that licensed agents commonly recommend is using a whole life policy as a permanent foundation — to ensure there is always some coverage in place — and then layering a term policy on top during the years you carry a mortgage and have young children at home.',
          'This way, your family has maximum coverage during the highest-risk years, and when the mortgage is paid off and the children are grown, the term expires cleanly while your whole life continues to protect you permanently.',
          'The math on what this combination costs — and which term lengths make the most sense for your specific mortgage and family situation — is something worth working through with a licensed agent who knows the products.',
        ],
      },
    ],
  },

  'how-much-life-insurance-do-you-need': {
    title: 'How Much Life Insurance Do You Actually Need?',
    excerpt: 'The answer isn\'t a random multiple of your salary. Here\'s a practical framework for calculating what your family would actually need — and the mistakes most people make.',
    date: 'May 8, 2026',
    readTime: '5 min read',
    category: 'Planning',
    webinarSlug: 'whole-life-101',
    webinarTitle: 'Whole Life 101',
    sections: [
      {
        heading: 'Why "10x Your Salary" Is Usually Wrong',
        paragraphs: [
          'The most commonly repeated rule of thumb is to buy 10 times your annual income in life insurance. It\'s a starting point, but it\'s far too blunt for most families. A 30-year-old with a newborn, a 30-year mortgage, and a spouse who doesn\'t work has completely different needs than a 30-year-old who rents, has no children, and a working spouse with her own income.',
          'Coverage needs are personal. They depend on your actual debts, your family\'s actual monthly expenses, how long your dependents will need support, and whether there are other assets in play. A rule of thumb skips all of that.',
        ],
      },
      {
        heading: 'The DIME Framework',
        paragraphs: [
          'A more practical approach many agents use is DIME: Debt, Income, Mortgage, and Education. Add up everything in those four categories and you have a reasonable starting estimate of the coverage your family would need to maintain their current quality of life if you weren\'t there.',
          'Debt includes everything except the mortgage — car loans, credit cards, personal loans, student debt. Income means the number of years your family would need support multiplied by your annual take-home pay. Mortgage is your remaining balance. Education is an estimate of what it would cost to put your children through school.',
          'Total those four numbers and you have a baseline. Many people are surprised by how high it is — and how far short their current coverage falls.',
        ],
        bullets: [
          'Debt: all outstanding loans outside the mortgage',
          'Income: take-home pay × years of support needed',
          'Mortgage: remaining balance on your home loan',
          'Education: estimated future schooling costs per child',
        ],
      },
      {
        heading: 'The Coverage Gap Most People Don\'t See',
        paragraphs: [
          'The most common mistake is relying entirely on employer-provided group life insurance. These policies typically offer 1–2x your annual salary and disappear the moment you leave the job — through layoff, resignation, retirement, or disability. You cannot count on coverage that you cannot keep.',
          'A personal policy you own stays with you regardless of employment status. It\'s portable, permanent (if it\'s a whole life policy), and its premium is locked at whatever your health allows when you first buy it. Every year you wait, that number goes up.',
          'Calculating the right coverage amount is best done with a licensed agent who can run actual illustrations with real products and real rates based on your age, health, and family situation.',
        ],
      },
    ],
  },

  'life-insurance-pre-existing-conditions': {
    title: 'Pre-Existing Conditions and Life Insurance: What You Need to Know',
    excerpt: 'Having a health history doesn\'t automatically disqualify you from life insurance. But understanding how underwriting works — and being honest — makes all the difference.',
    date: 'May 6, 2026',
    readTime: '6 min read',
    category: 'Underwriting',
    webinarSlug: 'underwriting-eligibility',
    webinarTitle: 'Underwriting & Eligibility 101',
    sections: [
      {
        heading: 'What Underwriting Actually Looks At',
        paragraphs: [
          'When you apply for life insurance, the insurance company evaluates your risk profile — the statistical likelihood that they will pay a claim in the near term. This process is called underwriting, and it considers several categories of information: your age and the coverage amount you\'re requesting, your build (height and weight), tobacco use, health history, current medications, and driving record.',
          'None of these factors automatically disqualifies you. They are weighed together to determine which rate class you fall into — and therefore what your premium will be. Two people with the same diagnosis can receive very different outcomes depending on how well-managed the condition is, how long ago it was diagnosed, and what other factors are in play.',
        ],
      },
      {
        heading: 'The Contestability Period — and Why Honesty Is Non-Negotiable',
        paragraphs: [
          'Every life insurance policy includes a contestability period — typically the first two years. During this window, if a claim is filed, the insurance company has the right to review the original application and verify that everything you disclosed was accurate.',
          'If they find a material misrepresentation — something you omitted or misstated that would have changed the underwriting decision — they can deny the claim. That means your family gets nothing. The people most harmed by dishonesty on a life insurance application are almost always the beneficiaries, not the applicant.',
          'The right approach is to be fully transparent, work with a licensed agent who understands how different conditions are underwritten, and let the process work honestly. Most applicants who worry about their health history are surprised to find out they qualify for something.',
        ],
      },
      {
        heading: 'When Standard Underwriting Isn\'t the Right Path',
        paragraphs: [
          'For applicants with more complex health histories, some insurance products offer simplified underwriting — a shorter application with fewer questions and no oral specimen requirement. These products typically have smaller face amounts and slightly higher rates, but they exist specifically to serve people who might not qualify through the standard process.',
          'Knowing which application to use — standard or simplified — and which products to consider based on your specific situation is exactly what a licensed agent is trained to help with. The goal is to get you covered at the best rate your situation allows, not to guess which process applies to you.',
        ],
      },
    ],
  },

  'life-insurance-riders-that-matter': {
    title: 'The Life Insurance Rider Nobody Told You About (That\'s Free on Every Policy)',
    excerpt: 'Most people know about the death benefit. Few know about the rider that pays you 50% of your coverage while you\'re still alive. Here\'s what riders actually do — and which ones matter most.',
    date: 'May 4, 2026',
    readTime: '5 min read',
    category: 'Policy Features',
    webinarSlug: 'riders-that-matter',
    webinarTitle: 'Riders That Matter',
    sections: [
      {
        heading: 'The Free Rider Most People Never Use',
        paragraphs: [
          'The Terminal Illness Rider is included at no additional cost on every life insurance policy offered through American Income Life. If you are diagnosed with a terminal illness and given 12 months or fewer to live, this rider allows you to accelerate up to 50% of your death benefit and receive it as a living benefit — cash you can use while you\'re still alive.',
          'Most people don\'t know this exists. They assume life insurance only pays when you die. But this rider means that a $50,000 policy could pay your family $25,000 today — to cover medical expenses, hospice care, travel to see loved ones, or simply to ensure you\'re not spending your final months worrying about bills.',
          'It costs nothing extra. It\'s on every policy. And the vast majority of policyholders never know it\'s there.',
        ],
      },
      {
        heading: 'The Riders That Are Worth Adding',
        paragraphs: [
          'Beyond the free terminal illness rider, there are several optional riders that can significantly enhance your policy\'s value depending on your situation. The Accidental Death rider pays an additional benefit — often equal to your full face amount — if death results from an accident. The Waiver of Premium rider keeps your policy active without requiring payments if you become totally disabled.',
          'The Guaranteed Insurability rider is one of the most powerful options for younger policyholders. It gives you the right to purchase additional coverage at specific future dates — without a new medical exam. If you develop a health condition between now and age 40, this rider means you can still increase your coverage as your family grows.',
        ],
      },
      {
        heading: 'Riders for Your Children and Spouse',
        paragraphs: [
          'The Children\'s Term Rider covers all of your children under one flat monthly rate — typically a few dollars — until they reach adulthood. The Spouse Rider provides a defined benefit amount on your spouse\'s life within your own policy, which is often more cost-effective than a separate policy.',
          'Which riders make sense for your family depends on your age, health, budget, and coverage goals. Some are valuable for almost everyone. Others are specific to certain situations. Understanding which ones belong on your policy is part of the conversation that happens during a consultation — not something to figure out from a website.',
        ],
      },
    ],
  },

  'final-expense-insurance-explained': {
    title: 'Final Expense Insurance: Why It\'s Never Too Late to Plan',
    excerpt: 'The average funeral costs nearly $10,000 — before the headstone, cemetery plot, and outstanding medical bills. Here\'s what seniors and their families need to know.',
    date: 'May 2, 2026',
    readTime: '6 min read',
    category: 'Senior Protection',
    webinarSlug: 'final-expense-senior-protection',
    webinarTitle: 'Final Expense & Senior Protection',
    sections: [
      {
        heading: 'The Cost Most Families Aren\'t Prepared For',
        paragraphs: [
          'According to the National Funeral Directors Association, the median cost of a funeral with burial in the United States is approximately $7,848. Add the cemetery plot, headstone, obituary, flowers, and reception, and many families are looking at $10,000 to $15,000 or more — often due within days of a loved one\'s passing.',
          'This cost lands on whoever is closest to the deceased. Adult children, spouses, and siblings regularly find themselves covering these expenses out of pocket, drawing from retirement savings, or in some cases, going into debt. A small final expense policy eliminates that burden entirely.',
          'The coverage doesn\'t need to be large. A $10,000 to $25,000 whole life policy is often sufficient to handle end-of-life costs, leave a small legacy, or cover any remaining debts. And because it\'s whole life, it never expires.',
        ],
      },
      {
        heading: 'Two Paths for Senior Coverage',
        paragraphs: [
          'For seniors who are in reasonably good health, a standard whole life policy through American Income Life\'s senior product line is available for applicants through age 80. This involves a more thorough application and typically results in lower premiums than simplified underwriting options.',
          'For seniors with more complex health histories — multiple conditions, certain medications, or a history of serious illness — the Senior Graded Whole Life option provides coverage with a simplified application and no oral specimen requirement. The trade-off is a graded benefit structure during the first four years: the policy pays 25%, then 50%, then 75%, then 100% of the face amount in years one through four respectively. After year four, the full benefit is in force for life.',
        ],
      },
      {
        heading: 'Having the Conversation With Your Family',
        paragraphs: [
          'One of the most uncomfortable parts of final expense planning isn\'t the policy — it\'s the conversation. Many adult children want to bring up the topic but don\'t know how to start. Many seniors know they need coverage but don\'t want to burden their families by bringing it up.',
          'The best framing is simple: this isn\'t about dying. It\'s about making sure the people who love you aren\'t left scrambling during the hardest week of their lives. A small monthly premium today removes an enormous emotional and financial weight from the people who matter most to you.',
          'The specific premiums and which product fits a specific applicant depend on age, health, and desired coverage amount — all things a licensed agent can walk through in a single conversation.',
        ],
      },
    ],
  },

  'free-membership-benefits': {
    title: 'Free Benefits You May Already Qualify For — Without Buying a Policy',
    excerpt: 'There\'s a membership tier most families walk right past. Prescription discounts, a legal Will kit, and accidental death coverage — at no cost to start.',
    date: 'April 30, 2026',
    readTime: '4 min read',
    category: 'Membership',
    webinarSlug: 'free-membership-benefits',
    webinarTitle: 'Free Membership Benefits',
    sections: [
      {
        heading: 'What\'s Included at No Cost',
        paragraphs: [
          'American Income Life offers a free membership tier that provides real, tangible benefits without requiring you to purchase a policy. Most families who learn about it wish they\'d known sooner.',
          'The free membership includes a prescription discount card that can reduce the cost of medications at participating pharmacies. It includes a Family Guide — a comprehensive organizer designed to hold all the documents, account information, and instructions your family would need to manage your affairs. And it includes a legally-guided Will kit, so you can create a valid, customized will without the cost of an attorney.',
        ],
        bullets: [
          'Prescription discount card for reduced medication costs',
          'Family Guide to organize important documents and accounts',
          'Legally-guided Will kit — create your will at no cost',
          'Accidental Death & Dismemberment coverage (up to a defined benefit amount)',
        ],
      },
      {
        heading: 'The AD&D Coverage Most People Don\'t Expect',
        paragraphs: [
          'Perhaps the most surprising free benefit is the Accidental Death & Dismemberment coverage. This is a real insurance benefit — a death benefit paid to your family if you die as the result of a covered accident, included at no cost as part of the free membership.',
          'It\'s not a substitute for a full life insurance policy. AD&D only covers accidental death and specific injuries, not illness or natural causes. But as a free benefit, it provides a meaningful layer of protection that most people simply don\'t have.',
        ],
      },
      {
        heading: 'Why It Exists and What Comes Next',
        paragraphs: [
          'The free membership is designed to introduce families to American Income Life and the value of having a licensed agent in their corner. It\'s not a bait-and-switch — the benefits are real and you are not required to purchase anything additional.',
          'That said, the free tier is a starting point, not a complete plan. Most families who review their full situation find gaps that the free membership alone doesn\'t fill. The question is what those gaps are and what it would cost to close them — which is worth a single conversation with a licensed agent.',
        ],
      },
    ],
  },

  'life-insurance-for-kids': {
    title: 'Why Getting Life Insurance for Your Child Today Could Be One of the Best Financial Decisions You Ever Make',
    excerpt: 'It\'s not about what happens if they die. It\'s about locking in their insurability before a health condition takes the decision out of their hands.',
    date: 'April 28, 2026',
    readTime: '5 min read',
    category: 'Family Planning',
    webinarSlug: 'kids-coverage-future-insurability',
    webinarTitle: 'Kids\' Coverage & Future Insurability',
    sections: [
      {
        heading: 'The Conversation Most Parents Avoid',
        paragraphs: [
          'Nobody wants to think about buying life insurance for a healthy child. The objection is almost always the same: "My kid is fine. Why would I need this?" And they\'re right — statistically, children are very unlikely to die young. But that\'s not why most parents buy this coverage.',
          'The reason is insurability — the ability to qualify for life insurance in the first place. Health conditions develop. Diabetes, autoimmune disorders, mental health diagnoses, heart conditions — these things happen, often in childhood or early adulthood, and they can permanently affect or eliminate a person\'s ability to qualify for standard life insurance.',
          'A child who is insured today is insured for life, regardless of what health history develops between now and age 70.',
        ],
      },
      {
        heading: 'The Guaranteed Insurability Option',
        paragraphs: [
          'The most powerful feature available on children\'s policies is the Guaranteed Insurability Option (GIO). This rider gives the policyholder — which becomes the child when they reach adulthood — the right to purchase additional whole life coverage at specific future ages (25, 28, 31, 34, 37, and 40) without a new medical exam and without proof of insurability.',
          'If your child develops Type 1 diabetes at 16, they can still buy additional coverage at 25, 28, and beyond. The health history that would otherwise make them uninsurable or dramatically increase their premiums becomes irrelevant. They exercise their option and get coverage at standard rates.',
          'That protection cannot be purchased after the fact. It has to be put in place before the health event occurs.',
        ],
      },
      {
        heading: 'The Cash Value That Grows With Them',
        paragraphs: [
          'A whole life policy placed on a child begins building cash value immediately. Over the course of 20, 30, or 40 years, that cash value can become a significant asset — available to them for education, a down payment, a business, or retirement supplementation.',
          'The premiums are also locked at a child\'s age — which means they are the lowest premiums that will ever be available to that person. The math on how much coverage costs when started at age 2 versus age 32 is stark.',
          'The specific products available, the premium amounts at different face values, and how the GIO works in practice are all worth understanding before making a decision. A single conversation with a licensed agent covers all of it.',
        ],
      },
    ],
  },

  'term-vs-whole-life-insurance': {
    title: 'Term vs. Whole Life Insurance: A Plain-English Comparison',
    excerpt: 'Both have a purpose. Neither is universally right. Here\'s how to think through which type of coverage — or which combination — makes sense for where your family is right now.',
    date: 'April 26, 2026',
    readTime: '5 min read',
    category: 'Life Insurance Basics',
    webinarSlug: 'whole-life-101',
    webinarTitle: 'Whole Life 101',
    sections: [
      {
        heading: 'Term Insurance: Maximum Coverage, Minimum Cost — For Now',
        paragraphs: [
          'Term insurance is straightforward. You pay a fixed premium for a defined period — 10, 20, or 30 years — and if you die during that period, your family receives the death benefit. If you outlive the term, the coverage ends and the premiums you paid are simply gone.',
          'The major advantage is cost. A healthy 30-year-old can buy a significant death benefit for a relatively small monthly premium on a term policy. For families with young children, a new mortgage, and tight budgets, term insurance is often the most affordable way to put meaningful coverage in place quickly.',
          'The disadvantage is impermanence. When the term ends, you either go without coverage or buy a new policy at your current age — which means higher premiums based on how old you are then, and potentially worse rates if your health has changed.',
        ],
      },
      {
        heading: 'Whole Life: Permanent Coverage That Builds Value',
        paragraphs: [
          'Whole life insurance never expires. The premium is fixed for life. The death benefit is guaranteed. And unlike term, it builds cash value — a growing asset inside the policy that you can borrow against tax-free during your lifetime.',
          'The main objection to whole life is cost. For the same monthly premium, a term policy will typically provide a higher initial death benefit than a whole life policy. Critics of whole life use this comparison to argue that term is always better.',
          'What that comparison misses: term has no cash value, no permanence, and no guaranteed renewability after it expires. Whole life does. They are not the same product serving the same purpose.',
        ],
      },
      {
        heading: 'The Strategy That Combines Both',
        paragraphs: [
          'Many licensed agents recommend starting with a whole life base for permanent protection — something that will always be in force regardless of age or health changes — and layering a term policy on top during the high-need years when you have a mortgage, young children, or significant income to protect.',
          'As the term expires and your major obligations reduce, the whole life continues. You\'ve covered both the temporary and the permanent need without overpaying for either.',
          'Determining the right split — how much whole life, which term length, what face amounts — depends entirely on your family\'s specific situation. That\'s the conversation worth having with a licensed agent.',
        ],
      },
    ],
  },

  '5-questions-before-buying-life-insurance': {
    title: '5 Questions to Ask Before You Buy Any Life Insurance Policy',
    excerpt: 'Most people sign a life insurance application without asking the questions that determine whether the policy will actually protect their family when it matters. Here\'s what to ask first.',
    date: 'April 24, 2026',
    readTime: '5 min read',
    category: 'Buyer\'s Guide',
    sections: [
      {
        paragraphs: [
          'Shopping for life insurance is confusing. The products look similar on the surface, but the details — the riders, the contestability period, the underwriting process, the company behind the policy — determine whether your family is actually protected or just covered on paper.',
          'Before you sign anything, these are the five questions worth asking out loud.',
        ],
      },
      {
        heading: '1. Is my premium fixed, or can it change?',
        paragraphs: [
          'Many policies — particularly term policies and certain universal life products — have premiums that can increase after an initial period, or that depend on market performance. A premium that looks affordable at 35 may become unaffordable at 55.',
          'Whole life policies through American Income Life feature level premiums — the amount you pay when you first buy the policy is the amount you pay for life. There are no surprises, no rate reviews, and no renewals.',
        ],
      },
      {
        heading: '2. What happens if I become disabled and can\'t pay premiums?',
        paragraphs: [
          'If you lose your income due to disability and can\'t make your premium payments, most policies will simply lapse — the coverage disappears. The Waiver of Premium rider prevents this. If you become totally disabled, the rider keeps your policy active and your premiums waived until you recover or reach a specified age.',
          'Not every policy includes this automatically. Ask whether it\'s included and what the definition of "totally disabled" is under the terms of the policy.',
        ],
      },
      {
        heading: '3. Does this policy build any cash value?',
        paragraphs: [
          'Term insurance builds no cash value. When it expires, you have nothing to show for the years of premiums you paid. Whole life builds cash value that you own, can borrow against, and can use during your lifetime.',
          'Neither answer is automatically right or wrong — but you should know what you\'re buying before you buy it.',
        ],
      },
      {
        heading: '4. What riders are included, and what do they cost?',
        paragraphs: [
          'Ask specifically about the Terminal Illness Rider — whether it\'s included, what percentage of the death benefit it accelerates, and under what conditions. Ask about Accidental Death, Waiver of Premium, and Guaranteed Insurability options and their costs.',
          'A good agent will walk through all of the available riders and help you decide which ones belong on your policy based on your specific situation.',
        ],
      },
      {
        heading: '5. What is the contestability period and what does it mean for me?',
        paragraphs: [
          'The contestability period is typically the first two years of a policy. During this window, if you die and a claim is filed, the insurance company can review your application for misrepresentations. If they find something material that was omitted or misstated, they can deny the claim.',
          'This is why complete honesty on the application is essential. A denied claim doesn\'t hurt you — you\'re gone. It devastates the family you were trying to protect. Work with a licensed agent who will ask the right questions and help you disclose everything accurately the first time.',
        ],
      },
    ],
  },
};

export const POST_SLUGS = Object.keys(POSTS);
