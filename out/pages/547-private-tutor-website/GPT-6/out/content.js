export const content = {
    "brand": "Mara Ellison Tutoring",
    "tutor": "Mara Ellison",
    "subjects": [
        "Mathematics",
        "Physics"
    ],
    "location": "Cambridge, Massachusetts",
    "timezone": "America/New_York",
    "rate": "$68",
    "navigation": [
        [
            "subjects",
            "Subjects"
        ],
        [
            "process",
            "How it works"
        ],
        [
            "progress",
            "Sample progress"
        ],
        [
            "pricing",
            "Pricing"
        ],
        [
            "availability",
            "Availability"
        ]
    ],
    "levels": {
        "Mathematics": [
            [
                "Foundations",
                "Grades 8–9",
                "Fractions, linear equations, and turning word problems into workable steps",
                [
                    "Fractions & proportions",
                    "Linear equations",
                    "Word-problem setup"
                ]
            ],
            [
                "Core high school",
                "Grades 9–11",
                "Algebra I and II, geometry, functions, and clear written reasoning",
                [
                    "Algebra I & II",
                    "Geometry & functions",
                    "Written reasoning"
                ]
            ],
            [
                "Advanced and exam prep",
                "Grades 11–12",
                "Precalculus, calculus readiness, and timed mixed-problem practice",
                [
                    "Precalculus",
                    "Calculus readiness",
                    "Timed mixed practice"
                ]
            ]
        ],
        "Physics": [
            [
                "Foundations",
                "Grades 8–9",
                "Measurement, graphs, and scientific reasoning",
                [
                    "Measurement",
                    "Reading graphs",
                    "Scientific reasoning"
                ]
            ],
            [
                "Core high school",
                "Grades 10–11",
                "Forces, energy, circuits, and diagram-first problem solving",
                [
                    "Forces & energy",
                    "Circuits",
                    "Diagram-first solving"
                ]
            ],
            [
                "Advanced and exam prep",
                "Grades 11–12",
                "Momentum, fields, and structured exam-style problems",
                [
                    "Momentum",
                    "Fields",
                    "Exam-style problems"
                ]
            ]
        ]
    },
    "steps": [
        [
            "Free intro",
            "A 20-minute conversation about current work, goals, and fit."
        ],
        [
            "Personal starting plan",
            "Mara Ellison identifies two priorities and agrees on a manageable weekly rhythm."
        ],
        [
            "Focused 60-minute session",
            "Work through one concept, guided examples, and increasingly independent practice."
        ],
        [
            "Short weekly recap",
            "Receive what clicked, what needs another look, and one concrete practice priority."
        ]
    ],
    "samples": [
        [
            "Algebra II",
            "8 weekly sessions",
            "Practice-set accuracy",
            "61%",
            "79%",
            61,
            79,
            "on equivalent mixed sets",
            "functions and multi-step setup",
            "timed practice without a worked example"
        ],
        [
            "Physics",
            "6 weekly sessions",
            "Five-problem check",
            "2",
            "4",
            40,
            80,
            "correct out of five",
            "drawing and labeling force diagrams before calculating",
            "mixed force and energy problems"
        ],
        [
            "Study routine",
            "4 weekly sessions",
            "Planned review blocks",
            "0",
            "3",
            0,
            75,
            "completed per week",
            "a short weekly plan and closed-book recall",
            "protect the routine during a busy assessment week"
        ]
    ],
    "packages": [
        [
            "Free intro",
            0,
            "20 minutes",
            "Talk through current work and goals, ask about fit, and decide whether to continue.",
            "Book free intro"
        ],
        [
            "Single session",
            1,
            "60 minutes",
            "One tailored lesson, a short session note, and three targeted practice prompts.",
            "Choose single session"
        ],
        [
            "Four-session plan",
            4,
            "Four weekly 60-minute lessons",
            "Includes everything in Single session plus a weekly recap and one agreed practice plan.",
            "Choose four sessions"
        ]
    ],
    "faqs": [
        [
            "What happens on the free intro call?",
            "We discuss current work, what feels difficult, and what a useful first month could look like. There is no sales script and no obligation to continue."
        ],
        [
            "Do sessions include homework?",
            "Only when it helps. The tutor suggests a short, specific practice task rather than an automatic worksheet pile."
        ],
        [
            "Can a parent join?",
            "A parent or caregiver is welcome for the first few minutes of an intro call and can receive the agreed weekly recap."
        ],
        [
            "What should we have ready?",
            "A recent assignment, practice test, or piece of work is useful, but not required for the intro."
        ],
        [
            "What is the rescheduling policy?",
            "Sessions can be moved without charge up to 24 hours before the agreed start time; later changes are discussed case by case."
        ],
        [
            "Are the student results real?",
            "No. The progress cards are illustrative samples for this demo, not verified claims or guarantees."
        ]
    ],
    "images": {
        "hero": [
            "images/hero-tutor.webp",
            "A fictional tutor preparing a lesson at a sunlit oak table"
        ],
        "session": [
            "images/session-progress.webp",
            "A fictional tutor and student working through a lesson at a wooden table"
        ],
        "portrait": [
            "images/tutor-portrait.webp",
            "Mara Ellison, a fictional private tutor, in a warm home studio"
        ],
        "studio": [
            "images/study-space.webp",
            "A quiet tutoring studio with an oak table and midnight-blue shelves"
        ]
    },
    "ui": {
        "chooseDate": "Choose an available date to see sample times.",
        "chooseTime": "Choose a time below.",
        "noTimes": "No future sample times on this date.",
        "chooseSlot": "Choose a sample date and time.",
        "saved": "Draft restored from this browser.",
        "storageUnavailable": "Browser storage is unavailable. You can explore the form, but a request cannot be saved.",
        "errorHeading": "Please check the highlighted fields.",
        "required": "This field is required.",
        "name": "Enter your name.",
        "email": "Enter a plausible email address.",
        "goals": "Tell us a little more (at least 20 characters).",
        "slotError": "Select a future sample intro-call time.",
        "change": "Change time",
        "duration": "20 minutes",
        "localTime": "Tutor local time · America/New_York",
        "notSent": "Nothing has been sent and no real appointment is booked.",
        "copy": "Copy request summary",
        "copied": "Request summary copied.",
        "fallback": "Copy the request summary below.",
        "edit": "Edit request",
        "reset": "Start over",
        "weekdays": [
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa"
        ]
    }
};
content.ui.success = (name) => `Thanks, ${name}. Your demo request is saved in this browser.`;
export function levelCards(subject)
{
    return content.levels[subject].map(([title, grade, best, topics], index) => `
        <article class="level-card">
            <span class="chip">${grade}</span>
            <h3>${title}</h3>
            <p><strong>Best for</strong><br>${best}.</p>
            <ul>${topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
            <button class="text-button" data-level="${index}">Ask about this level <span data-icon="ArrowUpRight"></span></button>
        </article>`).join("");
}
export function price(multiplier)
{
    const amount = Number(content.rate.replace(/[^\d.]/g, ""));
    const symbol = content.rate.replace(/[\d.\s]/g, "");
    return `${symbol}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount * multiplier)}`;
}
