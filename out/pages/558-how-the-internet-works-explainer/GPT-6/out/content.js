export const content =
{
    brand: "Northbeam Primers",
    topic: "How one web page reaches your laptop",
    domain: "kettleandcrumb.example",
    path: "/recipes/rye-sourdough",
    address: "https://kettleandcrumb.example/recipes/rye-sourdough",
    stages: ["Request", "DNS", "Route", "TCP", "TLS", "Response", "Render"],
    hero:
    {
        kicker: "A Northbeam Primers explainer",
        reading: "9-minute read / 7 scenes",
        deck: "You type an address, press Enter, and a recipe appears about a third of a second later. In between, your request asks for directions, crosses a string of machines, shakes hands twice and comes back sealed.",
        start: "Press Enter to start",
        glossary: "Jump to the glossary",
        note: "For the curious, not just the technical. Every address is made up; all timings are illustrative.",
        plate: "ONE REQUEST. A WHOLE JOURNEY.",
        source: "YOUR LAPTOP",
        target: "ORIGIN SERVER",
        foot: "Follow the signal. See what happens in between."
    },
    numbers:
    {
        dns: 24, server: 18, paint: 46, warmPaint: 30, packetCount: 12, bytes: 48213, ttl: 300,
        clientSeq: 4100, serverSeq: 9300, port: 443, clientPort: 52814,
        lossOrder: [7, 2, 10, 4], dnsSteps: [1, 9, 7, 6, 1]
    },
    routes:
    {
        city:
        {
            label: "Same city", oneWay: 12, hops: 4,
            nodes: ["Laptop", "Home router", "Your ISP", "Metro exchange", "Data center edge", "Origin server"],
            points: [[90,360],[140,330],[200,300],[260,330],[310,300],[350,270]],
            links: [1,3,3,3,2]
        },
        country:
        {
            label: "Same country", oneWay: 38, hops: 7,
            nodes: ["Laptop", "Home router", "Your ISP", "Regional hub", "Backbone A", "Backbone B", "Exchange point", "Data center edge", "Origin server"],
            points: [[90,360],[140,330],[200,300],[270,240],[350,190],[440,170],[500,210],[530,260],[555,300]],
            links: [1,3,4,7,8,7,5,3]
        },
        ocean:
        {
            label: "Across an ocean", oneWay: 96, hops: 10,
            nodes: ["Laptop", "Home router", "Your ISP", "Regional hub", "Backbone A", "Backbone B", "Coastal landing", "Far landing", "Backbone C", "Exchange point", "Data center edge", "Origin server"],
            points: [[90,360],[140,330],[200,300],[270,240],[350,190],[440,170],[545,150],[700,140],[770,180],[830,230],[860,290],[885,330]],
            links: [1,3,4,7,8,6,48,7,5,4,3]
        }
    },
    scenes:
    [
        {
            name: "The request", headline: "It starts as a line of text",
            beats:
            [
                "When you press Enter, the browser reads the address. https is how to talk, kettleandcrumb.example is who to talk to, and /recipes/rye-sourdough is what to ask for.",
                "A name is not a location yet. Machines use numeric addresses to deliver packets. Before connecting to this origin, the browser needs the number behind its name.",
                "The browser prepares an HTTP request, a few lines describing what it wants. In this example, it asks for the rye sourdough recipe."
            ],
            callout: "GET /recipes/rye-sourdough HTTP/1.1\nHost: kettleandcrumb.example\nAccept: text/html",
            figure: "An address, taken apart",
            control: "Explore the address"
        },
        {
            name: "DNS lookup", headline: "Asking for directions",
            beats:
            [
                "First the laptop checks its own memory. It has never visited this site, so it asks a resolver, a directory service usually run by your internet provider.",
                "The resolver follows referrals: root, top-level domain, then the site's authoritative nameserver. The final answer is 203.0.113.42. This entire chain is simulated; .example has no live delegation.",
                "The answer has a time to live. Here it is 300 seconds. A second lookup in this lesson uses the laptop's cache instead of repeating the chain."
            ],
            callout: "kettleandcrumb.example.  300  IN  A  203.0.113.42",
            figure: "A name becomes a number",
            control: "Try a fictional domain"
        },
        {
            name: "Across the network", headline: "Hop by hop, never the whole map",
            beats:
            [
                "A packet is a small envelope with a source, a destination and some data. It leaves the laptop, passes the home router and enters the provider's network.",
                "The selected route takes {hops} router hops and {oneWay} milliseconds one way. Move the server farther away to see how distance changes the whole journey.",
                "Each router chooses its next hop from a forwarding table, not a complete travel plan. Routes can change after a failure, though recovery is not always instant."
            ],
            callout: "destination        next hop\n203.0.113.0/24  →  198.51.100.9\n0.0.0.0/0      →  198.51.100.1",
            figure: "An abstract network, not geography",
            control: "Server distance"
        },
        {
            name: "TCP handshake", headline: "Three messages to agree to talk",
            beats:
            [
                "Packets can arrive late, twice, out of order or not at all. TCP builds a reliable byte stream on top of that. First, both ends agree on their starting numbers.",
                "The laptop sends SYN. The server replies SYN-ACK with its own number and an acknowledgment of the laptop's number plus one. The laptop answers ACK.",
                "The first two messages cost one full round trip: {rtt} milliseconds here. The final ACK can carry data; connection reuse avoids this setup on later requests."
            ],
            callout: "SYN      seq=4100\nSYN-ACK  seq=9300  ack=4101\nACK      seq=4101  ack=9301",
            figure: "Two endpoints. Three messages.",
            control: "Build the handshake"
        },
        {
            name: "TLS and the lock", headline: "Sealing the envelope",
            beats:
            [
                "Without TLS, people along the path could read the HTTP request. HTTPS adds an authenticated, encrypted channel before the recipe request is sent.",
                "The endpoints exchange key shares and derive shared secrets. A signed certificate authenticates the server's name. Real browsers check the chain, name and validity—not just one signature.",
                "The lock protects the connection, not the honesty of the recipe site. An observer can still see IP addresses and often the server name; the page path, headers and cookies are encrypted."
            ],
            callout: "Subject  kettleandcrumb.example\nIssuer   Demo Root Authority (invented)\nValid    90 days\nKeys     X25519 / ECDSA P-256",
            figure: "What someone on the same Wi-Fi sees",
            control: "Compare the connection"
        },
        {
            name: "The server answers", headline: "The answer comes back in pieces",
            beats:
            [
                "The origin decrypts the request, finds the recipe and builds a reply: a status line, headers and 48,213 bytes of HTML. Our example gives this work 18 milliseconds.",
                "The reply travels in pieces. TCP sequence numbers count bytes, not packet tiles. These twelve numbered tiles stand for chunks of the response, not twelve literal IP packets.",
                "Missing data is retransmitted. Raise the loss rate to create gaps, then watch the missing tiles arrive last. This deterministic lesson adds one round trip per lost tile; real TCP recovery is more complex."
            ],
            callout: "HTTP/1.1 200 OK\ncontent-type: text/html; charset=utf-8\ncontent-length: 48213\ncache-control: max-age=300",
            figure: "Twelve teaching tiles, one response",
            control: "Packet loss"
        },
        {
            name: "Back on your screen", headline: "From bytes to a page",
            beats:
            [
                "The browser parses HTML and starts building the page before every byte has arrived. Styles describe how that content should look.",
                "A stylesheet and a loaf drawing need fetching too, usually over the open connection. Their work is folded into this simplified paint budget, not modeled as separate network trips.",
                "The recipe is readable. Reload with a warm cache to reuse the address and connection. The warm comparison assumes the HTML is fetched, other assets are cached and no tiles are lost."
            ],
            callout: "HTML → DOM\nCSS → style & layout\nPaint → pixels on your screen",
            figure: "The journey becomes a recipe",
            control: "Compare a second visit"
        }
    ],
    ui:
    {
        roundTrip: "ROUND TRIP", ms: "ms", stage: "Stage", of: "of", scheme: "https", host: "kettleandcrumb.example", path: "recipes/rye-sourdough",
        addressParts: ["scheme", "host", "path"],
        addressCaptions: ["The protocol: speak HTTP, wrapped in encryption.", "The name of the machine to reach. It still needs a number.", "Which page to ask for once connected."],
        lookup: "Look up", domainLabel: "Domain name", presets: ["kettleandcrumb.example", "mail.kettleandcrumb.example", "weather.test"],
        invalid: "This demo only looks up made-up names ending in .example or .test (or reserved example domains).",
        cache: "From laptop cache", fresh: "Full simulated lookup", unknown: "IP address: unknown",
        dnsNodes: ["Your laptop", "Resolver (your ISP)", "Root server", ".example servers", "ns1.kettleandcrumb.example"],
        dnsDetail: ["192.0.2.10", "192.0.2.53", "Root referral", "TLD referral", "203.0.113.42"],
        dnsPhases: ["Laptop → resolver", "Root referral", "Top-level referral", "Authoritative answer", "Resolver → laptop"],
        handshakeButtons: ["Send SYN", "Send SYN-ACK", "Send ACK", "Start over"],
        handshakeCaptions: ["Choose Send SYN to begin.", "Laptop: here is my starting number.", "Server: here is my number, and yours plus one.", "Connection open. Both starting numbers acknowledged."],
        handshakeLabels: ["SYN · seq=4100", "SYN-ACK · seq=9300 · ack=4101", "ACK · seq=4101 · ack=9301"],
        endpoints: ["Your laptop", "Origin server"], time: "time ↓", open: "connection open",
        tlsOptions: ["HTTP", "HTTPS"], tlsCaptions: ["Readable by every machine on the path.", "Path, headers and cookies are scrambled. The destination remains visible."],
        tlsMessages: ["ClientHello + key share", "ServerHello + certificate + Finished", "Finished"],
        tlsVisible: "to 203.0.113.42:443 · name: kettleandcrumb.example",
        http: "GET /recipes/rye-sourdough HTTP/1.1\nHost: kettleandcrumb.example\nCookie: basket=2-loaves; session=7f3a91c2\nAccept: text/html",
        tlsNote: "Illustrative bytes, not real encryption. A lock is not a trust rating.",
        lossLabel: "Packet loss", packet: "PACKETS", lost: "LOST", resent: "RESENT", transfer: "Transfer", gap: "gap", resend: "resend", reassembled: "Response reassembled",
        warmButton: "Reload (warm cache)", coldButton: "First visit (cold)", warm: "Reload", cold: "First visit", faster: "faster",
        waterfall: ["DNS", "TCP", "TLS", "Request + wait", "Paint"],
        warmBadges: "DNS cached · connection reused",
        recipe: { brand: "Kettle & Crumb", title: "Rye Sourdough,\nSlow and Simple", kicker: "THE EVERYDAY LOAF", ingredients: ["500 g dark rye flour", "400 g water", "100 g active starter", "10 g salt"], button: "Save recipe" },
        recapKicker: "The whole picture", recapTitle: "The whole trip in four seconds.",
        recapDeck: "Same request, start to finish. A fast replay of the journey—not a measurement of your connection.",
        replay: "Replay the trip", replaying: "Following the signal…", recapDone: "Trip complete. The recipe is ready.",
        stats: ["ROUND TRIP", "HOPS EACH WAY", "HANDSHAKES", "TILES BACK"],
        glossaryKicker: "14 terms / a small field guide", glossaryTitle: "Words you picked up on the way.",
        glossaryScene: "Scene", back: "Back to top", next: "Next primer: How email finds its inbox · in progress",
        footer: "Short visual explainers about the machines we use every day.",
        credits: "Fictional editorial credits: words by Ines Okafor, diagrams by Tomás Reyes.",
        disclaimer: "A conceptual HTTP/1.1-over-TCP lesson, not a protocol analyzer. Modern connections can use HTTP/2 or HTTP/3, and stages often overlap. Timings are illustrative, not benchmarks. Documentation IPs only; no real DNS requests leave this page.",
        template: "Template by VibeFather", templateURL: "https://vibefather.ai/t/how-the-internet-works-explainer",
        skip: "Skip to the story", chapter: "THE JOURNEY / SEVEN STAGES", diagram: "Interactive diagram", hop: "hop", oneWay: "One way", hops: "hops", cable: "undersea cable"
    },
    glossary:
    [
        ["URL", "The full address you type: how to connect, which machine, which page.", 1],
        ["IP address", "A numeric network address, such as 203.0.113.42.", 2],
        ["DNS", "The directory system that turns names into IP addresses.", 2],
        ["Resolver", "The server that chases down a DNS answer and remembers it.", 2],
        ["TTL", "How long an answer may be reused before someone asks again.", 2],
        ["Packet", "A small envelope of data with source and destination addresses.", 3],
        ["Router", "A machine that forwards packets toward their destination.", 3],
        ["Hop", "One forwarding step in a packet's trip.", 3],
        ["Latency", "Time spent traveling and waiting; distance is one major factor.", 3],
        ["TCP", "Rules for an ordered byte stream, with acknowledgments and retransmission.", 4],
        ["Handshake", "A short exchange that sets up a connection before application data flows.", 4],
        ["TLS", "The layer that authenticates and encrypts the connection in HTTPS.", 5],
        ["Certificate", "A signed statement binding a public key to a site name.", 5],
        ["Round trip", "There and back: the time for a message and its reply.", 7]
    ]
};
