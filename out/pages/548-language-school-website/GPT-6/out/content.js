export const content =
{
    brand: "Cedar & Verb",
    location: "Portland, Oregon",
    languages: ["Spanish", "French", "Italian"],
    levels: ["A1", "A2", "B1", "B2"],
    price: "$240",
    nav: [["Courses", "courses"], ["Placement quiz", "quiz"], ["Schedule", "schedule"], ["Teachers", "teachers"], ["FAQ", "faq"]],
    hero:
    {
        eyebrow: "IN PERSON IN PORTLAND, OREGON · LIVE ONLINE",
        title: ["Speak beyond", "the classroom."],
        body: "Practical Spanish, French, and Italian classes for adults learning for travel, work, and connection, with small groups, clear levels, and teachers who make time to talk.",
        primary: "Take the placement quiz",
        secondary: "Browse courses",
        facts: ["8-week courses", "Max 8 learners", "90-minute classes"],
        note: ["Not sure of your level?", "Answer 10 questions", "Find your class"],
        image: "images/hero-classroom.webp",
        alt: "Adult learners talking around a sunlit classroom table",
        annotation: "A little practice. A world of possibility."
    },
    coursesHeading: "Start where you are.",
    coursesIntro: "Choose a language, then filter by level. Not sure? The placement quiz will point you here.",
    courses:
    [
        { id: "spanish-a1", language: "Spanish", level: "A1", title: "Spanish from Hello", days: "Tue / Thu", time: "18:00", teacher: "Amara Bennett", description: "Introduce yourself, find your way around town, and order something you love.", themes: ["Greetings and introductions", "Directions around the neighborhood", "Ordering food and drinks"] },
        { id: "spanish-a2", language: "Spanish", level: "A2", title: "Spanish in Motion", days: "Mon / Wed", time: "19:00", teacher: "Amara Bennett", description: "Share a recent experience, make plans, and keep everyday conversations moving.", themes: ["Telling a simple past story", "Making weekend plans", "Everyday questions and follow-ups"] },
        { id: "spanish-b1", language: "Spanish", level: "B1", title: "Spanish at the Table", days: "Sat", time: "10:00", teacher: "Amara Bennett", description: "Express an opinion, tell a fuller story, and connect over real conversation.", themes: ["Opinions and reasons", "Narrating a personal experience", "Supportive small-group discussion"] },
        { id: "french-a1", language: "French", level: "A1", title: "French First Steps", days: "Tue / Thu", time: "19:30", teacher: "Jonas Berg", description: "Get comfortable with sounds, introductions, and useful phrases for your day.", themes: ["Sound and pronunciation patterns", "Introducing yourself", "Shopping and neighborhood errands"] },
        { id: "french-b1", language: "French", level: "B1", title: "French Conversation Club", days: "Sat", time: "11:30", teacher: "Jonas Berg", description: "Discuss a short radio story, exchange viewpoints, and practice natural replies.", themes: ["Understanding a short radio excerpt", "Comparing viewpoints", "Keeping a conversation going"] },
        { id: "italian-a1", language: "Italian", level: "A1", title: "Italian Day by Day", days: "Mon / Wed", time: "18:00", teacher: "Priya Nair", description: "Meet new people, navigate a journey, and talk about your everyday rituals.", themes: ["First meetings", "Travel and transport", "Daily routines and simple questions"] }
    ],
    quiz:
    {
        heading: "Ten questions to your best-fit class.",
        intro: "Choose a language and answer ten short questions. Your result is a course recommendation, not a certificate.",
        englishNote: "This English-only demo checks concepts used in learning each language, rather than testing comprehension of the language itself. Your teacher should confirm the recommendation.",
        choose: "Which language would you like to learn?",
        placeholder: "Choose a language",
        start: "Start my quiz",
        back: "Back",
        next: "Continue",
        finish: "See my result",
        counter: (n) => `Question ${n} of 10`,
        result: (level) => `Your recommended level: ${level}`,
        matching: "See matching courses",
        retake: "Retake quiz",
        enroll: "Enroll at this level",
        saved: "Your latest result is saved only in this browser.",
        notSaved: "Local storage is unavailable. This result has not been saved.",
        restore: "Your latest result",
        score: (n) => `${n} of 10 correct`,
        explanations:
        {
            A1: "Start with everyday phrases and the foundations of conversation.",
            A2: "Build on the basics to describe experiences and make simple plans.",
            B1: "Practice connected stories, opinions, and more independent conversations.",
            B2: "Explore nuanced expression and advanced structures with a teacher."
        },
        railLabels: ["First words", "Everyday exchanges", "Connected conversation", "Nuanced expression"],
        noCourse: (language, level) => `There is no ${language} ${level} group currently listed. You can request a teacher's advice through the enrollment form.`
    },
    banks:
    {
        Spanish:
        [
            ["In Spanish, which greeting would you use before noon?", ["Good morning", "Good night", "Thank you", "See you later"], 0],
            ["When introducing yourself in Spanish, which subject does the verb need to match?", ["I", "You", "They", "You all"], 0],
            ["Which item belongs in a Spanish reading lesson?", ["A book", "A table", "A street", "A clock"], 0],
            ["For 'We live in a small house', which person and number does the Spanish verb need?", ["First-person plural", "Third-person plural", "First-person singular", "Second-person singular"], 0],
            ["For 'Yesterday I had coffee with Ana', which Spanish tense best presents a completed event?", ["Preterite", "Present", "Future", "Present imperative"], 0],
            ["In 'What time does the class begin?', which subject determines the Spanish verb form?", ["The class", "I", "You", "The students"], 0],
            ["For a likely plan after 'If I have time this weekend', which tense can Spanish use for the main clause?", ["Future indicative", "Conditional", "Imperfect subjunctive", "A past participle alone"], 0],
            ["After the Spanish equivalent of 'I would like', which form expresses 'to reserve'?", ["Infinitive", "First-person present", "Second-person present", "Past participle alone"], 0],
            ["A movie started before we arrived. Which Spanish tense expresses that earlier action?", ["Pluperfect", "Present perfect", "Future", "Present"], 0],
            ["For an unreal present condition meaning 'If I had more free time', which Spanish form belongs in the if-clause?", ["Imperfect subjunctive", "Present indicative", "Future indicative", "Present imperative"], 0]
        ],
        French:
        [
            ["Which greeting is appropriate at the start of a daytime French class?", ["Good morning", "Good night", "Goodbye", "Thank you"], 0],
            ["When saying 'I am a learner' in French, which subject must the verb agree with?", ["I", "They", "We", "You all"], 0],
            ["Which activity helps build French reading vocabulary?", ["Reading a book", "Checking a clock", "Crossing a street", "Moving a chair"], 0],
            ["In French, a verb with a subject meaning 'we' generally needs which form?", ["First-person plural", "First-person singular", "Third-person singular", "Second-person singular"], 0],
            ["Which French tense commonly tells a completed event such as 'I visited the market yesterday'?", ["Compound past", "Present", "Simple future", "Present imperative"], 0],
            ["Which French tense typically describes an ongoing background situation in a past story?", ["Imperfect", "Simple future", "Present imperative", "Future perfect"], 0],
            ["For a likely future condition in French, which tense follows 'if'?", ["Present indicative", "Simple future", "Present conditional", "Past conditional"], 0],
            ["Which French mood makes a request such as 'I would like a table' more polite?", ["Conditional", "Imperative", "Past historic", "Future perfect"], 0],
            ["Which French tense says a train had already left before you arrived?", ["Pluperfect", "Present", "Simple future", "Present imperative"], 0],
            ["After the French equivalent of 'It is necessary that', which mood is normally required?", ["Subjunctive", "Conditional", "Imperative", "Indicative future"], 0]
        ],
        Italian:
        [
            ["Which greeting fits the start of a morning Italian class?", ["Good morning", "Good night", "Goodbye", "Excuse me"], 0],
            ["When introducing yourself in Italian with 'I am', which person does the verb use?", ["First-person singular", "Third-person plural", "Second-person plural", "First-person plural"], 0],
            ["Which item is most useful for practicing Italian reading?", ["A book", "A key", "A street", "A plate"], 0],
            ["In Italian, which verb form agrees with a subject meaning 'we'?", ["First-person plural", "Second-person singular", "Third-person singular", "First-person singular"], 0],
            ["Which Italian tense commonly expresses a completed recent event like 'I ate yesterday'?", ["Compound past", "Present", "Future", "Imperative"], 0],
            ["Which Italian tense is useful for habitual activities in a past story?", ["Imperfect", "Simple future", "Future perfect", "Present imperative"], 0],
            ["Which Italian tense can express 'We will visit our cousins next weekend'?", ["Simple future", "Pluperfect", "Past conditional", "Present subjunctive"], 0],
            ["Which Italian mood can make 'I would like to reserve a table' polite?", ["Conditional", "Imperative", "Past historic", "Pluperfect"], 0],
            ["Which Italian tense expresses that a film had started before you arrived?", ["Pluperfect", "Present", "Future", "Present imperative"], 0],
            ["In an unreal present condition meaning 'If I had time, I would travel', which Italian form is used in the if-clause?", ["Imperfect subjunctive", "Present indicative", "Simple future", "Present imperative"], 0]
        ]
    },
    method:
    {
        heading: "Learn it. Use it. Make it yours.",
        image: "images/conversation-table.webp",
        alt: "Learners practicing conversation around a wooden table",
        caption: "A typical class: fewer lectures, more useful exchanges.",
        steps: [["Warm up", "Start with useful phrases from a real situation."], ["Guided practice", "Build accuracy through short pair exercises and clear feedback."], ["Real conversation", "Put the lesson together in unscripted, supportive exchanges."]]
    },
    schedule:
    {
        heading: "A week that works with your week.",
        intro: "Recurring times, small groups, and no registration fee.",
        formats: ["In person", "Live online"],
        headers: ["Course", "Level", "Days", "Time", "Format", "Price"],
        timezone: "All recurring times are Portland local time (America/Los_Angeles, Pacific Time).",
        priceTitle: "Good company.\nClear prices.",
        priceEyebrow: "NO SURPRISES",
        prices: [["Eight-week group course", "$240"], ["Four-week conversation club", "$96"], ["One private 60-minute lesson", "$58"]],
        note: "All prices are in USD. Course materials are included.",
        enroll: "Enroll in a group course"
    },
    teachersHeading: "Teachers who make room for your voice.",
    teachersNote: "Meet our fictional demo teachers. These portraits and profiles do not represent real staff.",
    teachers:
    [
        { name: "Amara Bennett", subtitle: "Spanish · A1–B2", bio: "Uses neighborhood stories, food vocabulary, and short role-plays to get beginners speaking.", image: "images/teacher-amara.webp", alt: "Amara Bennett, a fictional Spanish teacher, in a sunlit classroom" },
        { name: "Jonas Berg", subtitle: "French · A1–B1", bio: "Breaks pronunciation into practical patterns and brings short radio excerpts into conversation lessons.", image: "images/teacher-jonas.webp", alt: "Jonas Berg, a fictional French teacher, beside a classroom bookshelf" },
        { name: "Priya Nair", subtitle: "Italian · A1–B2", bio: "Builds classes around travel scenarios, everyday rituals, and thoughtful error review.", image: "images/teacher-priya.webp", alt: "Priya Nair, a fictional Italian teacher, seated in a language studio" }
    ],
    voices:
    {
        heading: "What practice feels like.",
        note: "Invented student voices for this demo.",
        quotes: [["The class gives me just enough structure, then lets me try the conversation myself.", "Nora, Spanish A2"], ["I finally understand what to practice between lessons instead of collecting random phrases.", "Theo, French A1"], ["Making mistakes feels normal here, and that makes speaking much easier.", "Mina, Italian A1"]]
    },
    enrollment:
    {
        heading: "Your next conversation starts here.",
        intro: "Tell us what you want to learn and when you can join. The demo checks your details and saves the request only in this browser.",
        image: "images/school-studio.webp",
        alt: "A welcoming language school studio with green chairs and warm wood",
        labels: { name: "Full name", email: "Email", language: "Language", level: "Level", schedule: "Preferred schedule", format: "Format", message: "What would you like to say in your new language?" },
        choose: "Please choose",
        advisory: "Ask a teacher about an unlisted group",
        optional: "Optional",
        submit: "Request my place",
        success: (name) => `Thanks, ${name}.`,
        successBody: "Your request is saved for this demo. No information has been sent.",
        edit: "Edit request",
        reset: "Start another request",
        storageError: "Your browser could not save this request. No information has been sent. Enable local storage and try again.",
        draftError: "Local storage is unavailable. Your draft is not being saved.",
        errors: { name: "Enter your full name.", email: "Enter a valid email address.", language: "Choose a language.", level: "Choose a level.", schedule: "Choose a preferred schedule.", format: "Choose a format." },
        preselected: (title) => `Selected: ${title}. Please complete your details.`,
        unlisted: (language, level) => `${language} · ${level}: a teacher will help with an unlisted group.`,
        visitTitle: "Come say hello.",
        address: "418 Alder Mews, Portland, Oregon",
        email: "hello@cedar-and-verb.example",
        phone: "(503) 555-0148",
        hours: "Mon–Thu 10:00–20:00, Fri 10:00–17:00, Sat 09:00–15:00",
        fictional: "Fictional school and contact details. Please do not send personal information."
    },
    faqHeading: "Before your first hello.",
    faqs:
    [
        ["Do I need any experience?", "No. A1 assumes no prior study, and the quiz helps place everyone else."],
        ["How accurate is the placement quiz?", "It recommends a starting level from ten answers; a teacher can adjust it after a short conversation. In this English-only adaptation, questions assess learning concepts rather than direct language proficiency."],
        ["Can I switch levels?", "Yes. Speak with your teacher after the first class and the school will suggest a better-fit group."],
        ["What should I bring?", "A notebook and something to write with; all course materials are included."],
        ["Are online classes live?", "Yes. Online groups meet with a teacher at the listed recurring time and are not prerecorded."],
        ["What is the refund policy?", "A full refund is available up to seven days before the first class; after that, the school offers course credit. This is an illustrative policy for the fictional school, not a real offer."]
    ],
    footer:
    {
        statement: "Practical language classes in Portland, Oregon and online.",
        credit: "Template by VibeFather",
        creditLink: "https://vibefather.ai/t/language-school-website"
    },
    ui:
    {
        enroll: "Enroll now",
        menu: "Menu",
        close: "Close",
        skip: "Skip to content",
        languageFilter: "Filter by language",
        levelFilter: "Filter by level",
        all: "All levels",
        details: "View details",
        hide: "Hide details",
        enrollCourse: "Enroll",
        materials: "Materials included: lesson sheets, listening activities, and a take-home practice guide.",
        duration: "8 weeks · 90 minutes · Max 8",
        priceTerm: " / 8 weeks",
        results: (n) => `${n} ${n === 1 ? "course" : "courses"} to explore`,
        emptyHeading: "A different starting point.",
        empty: "There is no group at this level right now. Clear the level filter to explore this language, or ask a teacher through the enrollment form.",
        clear: "Clear filters",
        courseThemes: "What you will practice",
        number: (n) => String(n + 1).padStart(2, "0"),
        scroll: "Explore your next conversation",
        sectionEyebrows: ["YOUR NEXT CHAPTER", "A SMALL FIRST STEP", "THE CEDAR & VERB WAY", "MAKE ROOM FOR PRACTICE", "REAL PEOPLE. ROOM TO TALK.", "IN THEIR WORDS", "LET'S BEGIN", "A FEW GOOD QUESTIONS"]
    }
};
