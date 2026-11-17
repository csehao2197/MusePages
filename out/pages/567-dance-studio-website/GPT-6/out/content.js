export const studio =
{
    brand: "Offbeat Dance Assembly",
    city: "Austin, Texas",
    audience: "dancers ages 7 and up, from complete beginners to experienced movers",
    recital: "2027-06-12T19:00:00-05:00",
    eventLine: "Saturday, June 12 · 7:00 PM CDT",
    address: "18 Cadence Alley",
    phone: "(512) 555-0148",
    tel: "tel:+15125550148",
    brandSlug: "offbeat-dance-assembly",
    email: "hello@offbeatdanceassembly.com",
    prefix: "OD",
    credit: "https://vibefather.ai/t/dance-studio-website",
    hours: ["Mon–Fri · 15:00–21:30", "Saturday · 09:00–17:00", "Sunday · 12:00–17:00", "Sunday desk only · no regular classes"],
    disclaimer: "Fictional studio · Sample timetable · Reservations stay on this device."
};

export const images =
{
    hero: { src: "./images/hero-dance.webp", alt: "A fictional adult dance ensemble moving across a dark studio under coral and lilac light" },
    contemporary: { src: "./images/class-contemporary.webp", alt: "Two fictional contemporary dancers practicing a wide floorwork phrase" },
    recital: { src: "./images/recital-stage.webp", alt: "Fictional dancers seen from behind during a recital rehearsal" }
};

export const programs =
[
    {
        slug: "hip-hop", name: "Hip-Hop", words: "GROOVE / FOUNDATIONS / FREESTYLE",
        description: "Footwork, bounce, isolations and short combinations taught one eight-count at a time. Youth groups learn the same foundations without the late finish.",
        bars: [42, 68, 52]
    },
    {
        slug: "contemporary", name: "Contemporary", words: "FLOORWORK / BREATH / PHRASES",
        description: "A clear technical warm-up moves into traveling phrases and floorwork. Beginners get smaller ranges and a slower count; experienced dancers get more complexity, not more speed for its own sake.",
        bars: [58, 36, 72]
    },
    {
        slug: "jazz", name: "Jazz", words: "RHYTHM / LINES / PERFORMANCE",
        description: "Sharp accents, turns and expansive combinations with room for character. Recital choreography stays optional and every class works as a standalone session.",
        bars: [76, 46, 60]
    }
];

export const instructors =
[
    {
        id: "maya", name: "Maya Rivera", style: "hip-hop", specialty: "Hip-Hop lead · 11 years teaching",
        bio: "Maya builds combinations from the groove outward. Her beginner classes are music-first, low-pressure and famous for ending with one more run than planned.",
        quote: "We learn the groove before the trick. Count it out, then make it yours.",
        src: "./images/teacher-maya.webp", alt: "Maya Rivera, a fictional hip-hop instructor, in the studio"
    },
    {
        id: "jules", name: "Jules Bennett", style: "jazz", specialty: "Jazz & performance · 9 years",
        bio: "Jules mixes clean technique with theater instincts. He breaks turns into foot, spot and landing, then helps each dancer add a little character.",
        quote: "Clean lines are useful. A little personality is required.",
        src: "./images/teacher-jules.webp", alt: "Jules Bennett, a fictional jazz instructor, in the studio"
    },
    {
        id: "elena", name: "Elena Park", style: "contemporary", specialty: "Contemporary & foundations · 14 years",
        bio: "Elena teaches floorwork without the mystery and progressions without the rush. Her first-class sessions include a full explanation of the room, the warm-up and what to wear.",
        quote: "Technique should give you more choices, not make you afraid to move.",
        src: "./images/teacher-elena.webp", alt: "Elena Park, a fictional contemporary instructor, in the studio"
    }
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const ages = { youth: "7–12", teen: "13–17", adult: "18+" };
export const levels = { "first-class": "First class", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const records =
[
    ["mon-1630",0,"16:30","hip-hop","Youth Hip-Hop Foundations","youth","first-class",45,"maya",8,14],
    ["mon-1730",0,"17:30","jazz","Teen Jazz Basics","teen","beginner",60,"jules",11,16],
    ["mon-1845",0,"18:45","contemporary","Adult Contemporary Foundations","adult","beginner",75,"elena",12,16],
    ["mon-2015",0,"20:15","hip-hop","Adult Hip-Hop Combinations","adult","intermediate",60,"maya",14,16],
    ["tue-1630",1,"16:30","contemporary","Youth Contemporary Start","youth","first-class",45,"elena",9,14],
    ["tue-1730",1,"17:30","hip-hop","Teen Hip-Hop Combinations","teen","intermediate",60,"maya",13,16],
    ["tue-1845",1,"18:45","jazz","Adult Jazz Basics","adult","beginner",60,"jules",10,16],
    ["tue-2000",1,"20:00","contemporary","Adult Contemporary Repertoire","adult","advanced",75,"elena",16,16],
    ["wed-1630",2,"16:30","jazz","Youth Jazz Basics","youth","beginner",45,"jules",8,14],
    ["wed-1730",2,"17:30","contemporary","Teen Contemporary Foundations","teen","beginner",60,"elena",12,16],
    ["wed-1845",2,"18:45","hip-hop","Adult First Hip-Hop","adult","first-class",60,"maya",9,16],
    ["wed-2000",2,"20:00","jazz","Adult Jazz Combinations","adult","intermediate",60,"jules",15,16],
    ["thu-1630",3,"16:30","hip-hop","Youth Hip-Hop Basics","youth","beginner",45,"maya",10,14],
    ["thu-1730",3,"17:30","contemporary","Teen Contemporary Phrases","teen","intermediate",60,"elena",14,16],
    ["thu-1845",3,"18:45","jazz","Adult First Jazz","adult","first-class",60,"jules",7,16],
    ["thu-2000",3,"20:00","hip-hop","Adult Hip-Hop Repertoire","adult","advanced",60,"maya",16,16],
    ["fri-1630",4,"16:30","contemporary","Youth Contemporary Basics","youth","beginner",45,"elena",11,14],
    ["fri-1730",4,"17:30","jazz","Teen Jazz Combinations","teen","intermediate",60,"jules",12,16],
    ["fri-1845",4,"18:45","hip-hop","Adult Hip-Hop Basics","adult","beginner",60,"maya",13,16],
    ["fri-2000",4,"20:00","contemporary","Adult Contemporary Combinations","adult","intermediate",75,"elena",9,16],
    ["sat-0930",5,"09:30","hip-hop","Youth First Hip-Hop","youth","first-class",45,"maya",6,14],
    ["sat-1030",5,"10:30","jazz","Teen Jazz Basics","teen","beginner",60,"jules",9,16],
    ["sat-1145",5,"11:45","contemporary","Adult First Contemporary","adult","first-class",75,"elena",8,16],
    ["sat-1315",5,"13:15","jazz","Adult Jazz Repertoire","adult","advanced",60,"jules",14,16]
];
export const sessions = records.map(([id,day,start,style,title,ageBand,level,duration,instructor,booked,capacity]) =>
    ({id,day,start,style,title,ageBand,level,duration,instructor,booked,capacity}));

export const passes =
[
    {
        id: "single", title: "Single class", price: 24, tag: "A LITTLE ROOM TO EXPLORE",
        description: "One 45–75 minute session, any style or level that fits.",
        features: ["One class reservation", "All props and practice space included", "No enrollment fee"],
        math: "$24 / CLASS"
    },
    {
        id: "eight", title: "Eight-class pass", price: 152, tag: "BEST FOR 1–2 CLASSES A WEEK",
        description: "Eight classes to use within three months, across any style.",
        features: ["$19 per class", "Share with one family member", "Unused classes expire after 3 months"],
        math: "$19 / CLASS · SAVE $40"
    },
    {
        id: "unlimited", title: "Monthly unlimited", price: 168, tag: "MAKE IT PART OF YOUR WEEK",
        description: "Every regular class, every week, with month-to-month billing handled at the studio.",
        features: ["Unlimited regular classes", "Two guest passes each month", "Pause once per year for up to 30 days"],
        math: "$5.25 / CLASS AT 8 VISITS A WEEK"
    }
];

export const faqs =
[
    ["I have never danced. Which class should I pick?", "Choose any session marked First class. The warm-up, basic vocabulary and combination are taught from zero. Beginner is also suitable if you are comfortable learning with people who have taken a few classes."],
    ["What should I wear?", "Clothes that let you bend and stretch, clean sneakers for Hip-Hop and Jazz, and socks or bare feet for Contemporary. Bring water. You do not need special dance shoes for a trial."],
    ["How do age groups work?", "Youth is 7–12, Teen is 13–17 and Adult is 18+. Use the age filter on the timetable; dancers stay with their age band even when the choreography is shared."],
    ["Does my child have to join the recital?", "No. Recital choreography is taught in regular classes, but performing is optional. Dancers who prefer not to perform still learn the complete combination."],
    ["What if a class is full?", "Full sessions are marked on the timetable. Call the desk to join the waitlist; the site does not pretend to hold a place that is unavailable."],
    ["Can I cancel or move my trial?", "Yes, up to six hours before class. Call (512) 555-0148 and the desk will move it. If you simply need a different session on this device, choose another class on the confirmation pass."]
];

export const copy =
{
    hero: { eyebrow: "Austin, Texas · Classes for ages 7+", lines: ["Find your", "beat.", "Own the room."], lead: "Offbeat Dance Assembly teaches Hip-Hop, Contemporary and Jazz to dancers ages 7 and up, from complete beginners to experienced movers. Small classes, clear levels and a first session that costs nothing but an hour." },
    programs: { eyebrow: "01 · Find your class", title: "Three ways in.", lead: "Start with the style that makes you turn the music up. Every program has a first-class session, and every instructor shows the steps before asking for polish." },
    instructors: { eyebrow: "02 · The people in the room", title: "Clear cues.\nGood music.", lead: "Three teachers, three different routes into dance. They correct the step, explain the why and learn every dancer’s name." },
    recital: { eyebrow: "03 · Save a seat", title: "In full\nmotion.", lead: "Three age bands. Twenty-four short pieces. One night where the practice room becomes a stage. Participating is optional; cheering is strongly encouraged.", details: "Doors 6:15 PM · 18 Cadence Alley · 120 seats", note: "Recital participation is optional and included in regular classes. Tickets are free for participating families; no online ticket sale." },
    passes: { eyebrow: "04 · Passes", title: "Start small.\nKeep moving.", lead: "Try one class first. If the room feels right, choose the pass that matches your actual week.", note: "Passes are purchased at the studio after your trial. Monthly plans need 30 days notice to cancel. Recital participation carries no costume fee." },
    trial: { eyebrow: "05 · Your first class", title: "Come as\nyou are.", lead: "Choose a First class or Beginner session. Your first visit starts with a clear plan, a small group and no card reader waiting by the door.", checklist: ["One free trial per dancer", "Comfortable clothes and water are enough", "Arrive 15 minutes early; under-18s bring a parent or guardian on the first visit"], disclosure: "Local demo booking only. Nothing is sent to a studio, no email is sent and no payment is taken." },
    faq: { eyebrow: "06 · Before you arrive", title: "Good questions.\nStraight answers." },
    timetable: { eyebrow: "The week · 24 classes · Ages 7+", title: "Pick a time.\nFind your people.", lead: "Filter by style, age and level. Open a class for the full picture, or reserve a free trial where you see the Coral pill." },
    nav: [["Programs","./index.html#programs"],["Timetable","./classes.html"],["Instructors","./index.html#instructors"],["Passes","./index.html#passes"]],
    ledger: [["24","weekly classes"],["3","dance styles"],["16","dancers max"],["$0","your first class"]],
    rail: ["Hip-Hop","Contemporary","Jazz","First class free","Ages 7+","All bodies welcome"],
    expect: ["15-minute guided warm-up", "Steps demonstrated at two speeds", "A short combination with options", "Water breaks whenever you need one"],
    experiences: ["Brand new", "A few classes", "Returning after a break"],
    consent: "I understand this reservation is saved on this device and I should show the confirmation at the front desk.",
    help: [
        ["Clock","Arrive 15 minutes early","The teacher will show you the room and where to put your things."],
        ["Users","Sixteen max, fourteen for youth","Capacity is fixed so everyone can see the instructor and cross the floor safely."],
        ["CalendarCheck","Need a different day?","Call (512) 555-0148 up to six hours before class and we will move your reservation."]
    ],
    bring: { "hip-hop": "Clean sneakers, comfortable clothes and water.", jazz: "Clean sneakers, comfortable clothes and water.", contemporary: "Socks or bare feet, layers for floorwork and water." },
    descriptions: { "first-class": "Learn the terminology, meet the room and follow a guided warm-up. Every step is demonstrated from zero.", beginner: "Build terminology and warm-up foundations at a steady count, then link the basics into a short phrase.", intermediate: "Learn a short combination with layered musical accents. Smaller and more expansive options keep the phrase adaptable.", advanced: "Work on a four-week optional recital phrase with detailed transitions. There is no requirement to perform." },
    labels: { name: "Dancer first name", guardian: "Parent or guardian name", email: "Email", session: "Choose your session", notes: "Anything we should know? (optional)", submit: "Reserve my free class", pending: "Saving on this device", reset: "Choose another class", print: "Print pass" },
    errors: { name: "Enter a first name with 2–40 characters.", guardian: "Enter a parent or guardian name (2–80 characters).", email: "Enter a valid email address.", session: "Choose an available First class or Beginner session.", experience: "Choose your experience.", notes: "Keep notes to 240 characters.", consent: "Please acknowledge that this is a device-only reservation." },
    confirmation: { label: "Free class reserved", title: "See you on the floor,", caption: "Saved on this device. Screenshot or print this pass and bring it to the desk. No payment has been taken and no email has been sent.", failed: "Pass created, but browser storage is unavailable. Print or screenshot now; this pass will not reload on a revisit.", reset: "Remove the saved pass from this device and choose another class? This does not cancel a reservation with the studio. Call the desk for changes." }
};
