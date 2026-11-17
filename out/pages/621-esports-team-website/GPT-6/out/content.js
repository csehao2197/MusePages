export const content =
{
    team:
    {
        brand: "Static Vale", code: "STV", discipline: "Tactical arena", city: "Rotterdam",
        season: "Meridian Open", email: "hello@static-vale.example",
        credit: "Template by VibeFather", creditUrl: "https://vibefather.ai/t/esports-team-website"
    },
    nav: ["Home", "Roster", "Matches", "Shop", "News"],
    routes: ["", "roster", "matches", "shop", "news"],
    hero:
    {
        eyebrow: "ROTTERDAM / TACTICAL ARENA", title: "STATIC VALE",
        outline: "NO QUIET ROUNDS.", copy: "Five players. One read. Patient setups, decisive finishes, and every round accounted for.",
        primary: "Meet the roster", secondary: "Match center",
        image: "./images/hero-arena.webp",
        alt: "Five fictional Static Vale players standing together in a dark arena tunnel."
    },
    metrics: [["12–4", "SERIES RECORD"], ["68%", "MAP WIN RATE"], ["1.18", "TEAM K/D"], ["14", "CLUTCH WINS"]],
    players:
    [
        {handle:"Kestrel",name:"Mara Voss",number:"01",role:"IGL",image:"kestrel",alt:"Kestrel, fictional Static Vale in-game leader, in a black team jersey.",stats:[["KAST","72%"],["K/D","1.08"],["Clutches","14"],["Trade rate","81%"]],bars:[72,68,70,81],bio:"Mara calls the early round slowly and the final twenty seconds fast. She tracks opponent utility with a handwritten three-color system.",recent:["Array / 1.18 rating","Causeway / 1.06 rating","Foundry / 1.24 rating"]},
        {handle:"Mako",name:"Jae Park",number:"14",role:"Entry",image:"mako",alt:"Mako, fictional Static Vale entry player, in a black team jersey and cap.",stats:[["Opening duels","58%"],["K/D","1.24"],["Damage / round","186"],["Trade rate","74%"]],bars:[58,84,86,74],bio:"Jae creates the first opening and calls his own timing. He reviews every lost entry before watching a single highlight.",recent:["Array / 1.46 rating","Causeway / 1.28 rating","Foundry / 1.52 rating"]},
        {handle:"Sable",name:"Luis Serrano",number:"07",role:"Flex",image:"sable",alt:"Sable, fictional Static Vale flex player, in a black team jersey.",stats:[["KAST","69%"],["K/D","1.16"],["Round impact","7.8"],["Trade rate","79%"]],bars:[69,76,78,79],bio:"Luis moves between second entry and late-round anchor. His calm mid-round calls keep the playbook flexible.",recent:["Array / 1.20 rating","Causeway / 1.08 rating","Foundry / 1.19 rating"]},
        {handle:"Tinker",name:"Amara Okafor",number:"22",role:"Support",image:"tinker",alt:"Tinker, fictional Static Vale support player, in a black team jersey.",stats:[["KAST","76%"],["K/D","0.96"],["Assist rate","31%"],["Trade rate","87%"]],bars:[76,56,62,87],bio:"Amara builds rounds around information and well-timed support. She also runs the team's replay tagging library.",recent:["Array / 1.04 rating","Causeway / 0.94 rating","Foundry / 1.12 rating"]},
        {handle:"Vexa",name:"Elias Nyström",number:"09",role:"Anchor",image:"vexa",alt:"Vexa, fictional Static Vale anchor, in a black team jersey.",stats:[["KAST","71%"],["K/D","1.11"],["Site holds","18"],["Trade rate","78%"]],bars:[71,71,90,78],bio:"Elias prefers patient holds and narrow crossfires. He leads the final ten-minute defensive walkthrough before every match.",recent:["Array / 1.09 rating","Causeway / 1.02 rating","Foundry / 1.16 rating"]}
    ],
    roles: ["All", "IGL", "Entry", "Flex", "Support", "Anchor"],
    matches:
    [
        {opponent:"Iron Union",code:"IRU",stage:"Semifinal",time:"Saturday / 19:00 CET",type:"Upcoming",format:"Best of 3",score:"vs",maps:["Array — scheduled","Causeway — scheduled","Foundry — scheduled"],note:"First pick: Array. Iron Union favors early pressure. Hold the first rotation and trade the second angle."},
        {opponent:"Drift Nine",code:"DFN",stage:"Lower final",time:"Next Friday / 18:30 CET",type:"Upcoming",format:"Best of 3",score:"vs",maps:["Array — scheduled","Causeway — scheduled","Foundry — scheduled"],note:"First pick: Array. Drift Nine delays its second rotation. Keep one information tool for the final thirty seconds."},
        {opponent:"Ochre Labs",code:"OCH",stage:"Week 6",time:"Final / CET",type:"Results",format:"Best of 3",score:"2–1",maps:["Array 13–9","Causeway 8–13","Foundry 13–7"],note:"Mako 1.42 / Kestrel 1.18 / Vexa 1.09. A slower middle round made room for the deciding trade."},
        {opponent:"North & Neon",code:"NNN",stage:"Week 5",time:"Final / CET",type:"Results",format:"Best of 3",score:"2–0",maps:["Array 13–6","Foundry 13–11"],note:"Mako 1.31 / Kestrel 1.16 / Vexa 1.13. Clean spacing kept the final two defensive holds intact."},
        {opponent:"Drift Nine",code:"DFN",stage:"Week 4",time:"Final / CET",type:"Results",format:"Best of 3",score:"1–2",maps:["Causeway 11–13","Array 13–10","Foundry 9–13"],note:"Mako 1.12 / Kestrel 1.02 / Vexa 1.05. Late rotations became the focus of the next review."},
        {opponent:"Boro Five",code:"BR5",stage:"Week 3",time:"Final / CET",type:"Results",format:"Best of 3",score:"2–0",maps:["Array 13–4","Foundry 13–8"],note:"Mako 1.38 / Kestrel 1.22 / Vexa 1.18. Support timing gave the entry space to work."}
    ],
    products:
    [
        {name:"Home Jersey",category:"Wear",price:64,sizes:["XS","S","M","L","XL"],material:"Recycled performance knit",fit:"Athletic unisex cut",kind:"jersey"},
        {name:"Scrim Hoodie",category:"Wear",price:72,sizes:["S","M","L","XL","XXL"],material:"420gsm brushed cotton",fit:"Relaxed drop shoulder",kind:"hoodie"},
        {name:"Arena Overshirt",category:"Wear",price:88,sizes:["S","M","L","XL"],material:"Cotton ripstop",fit:"Boxy layer with two chest pockets",kind:"overshirt"},
        {name:"Static Cap",category:"Accessories",price:28,sizes:["Adjustable"],material:"Washed twill",fit:"Six-panel adjustable back",kind:"cap"},
        {name:"Team Scarf",category:"Accessories",price:24,sizes:["One size"],material:"Double-sided knit",fit:"160cm double-sided knit",kind:"scarf"},
        {name:"LAN Duffel",category:"Accessories",price:58,sizes:["32 liter"],material:"Recycled canvas",fit:"32 liters with a separate shoe pocket",kind:"duffel"}
    ],
    sponsors:["Brivo Chairs","Zestfuel","Loam Coffee","Twill Hardware","Aster Mobility"],
    principles:[["Trade before heroics","The second player matters more than the highlight."],["Say the useful thing","Information first, volume second."],["Review without theater","One lesson, one owner, one next drill."]],
    stories:
    [
        {
            title:"Five maps, one calm finish",category:"Matches",time:"6 min read",image:"hero-arena",
            dek:"The timeout that helped Static Vale stop chasing and start trading.",
            quote:"We stopped asking for a hero round and started asking for the next trade.",
            paragraphs:
            [
                "The notebook was almost empty when Mara called the timeout. Across five practice maps, the same problem had appeared in different places: the first player found a gap, the second arrived a moment late, and the round dissolved into separate decisions. Instead of adding another setup, the team removed one. Tinker would call the available information, Kestrel would name the next meeting point, and everyone else would leave enough room for the player beside them to see the same angle.",
                "Causeway was still a loss. Static Vale reached eight rounds before Ochre Labs closed the map, and the review did not try to turn that score into a hidden victory. Mako had entered too far ahead on two important attacks. Vexa had held useful ground without a clear route back. The adjustment for Foundry was practical: say the retreat before taking the space. The timeout gave that sentence a place in the plan, and the opening rounds made it a habit.",
                "The deciding round did not contain a remarkable individual play. Sable waited for Tinker's information, Mako took the opening, and Mara stayed close enough to finish the exchange. Behind them, Vexa kept the route home available. The final score was thirteen to seven, but the useful detail was the distance between the first two players. At the next review, the team saved that frame instead of the celebration. It became the first image in the following day's preparation notes."
            ]
        },
        {
            title:"Inside our 40-minute reset routine",category:"Culture",time:"4 min read",image:"player-kestrel",
            dek:"A repeatable routine for noisy venues, delayed starts, and lost openings.",
            quote:"The routine is ordinary so the match does not have to be.",
            paragraphs:
            [
                "The first part of the reset is not a drill. Everyone leaves the desk, refills a water bottle, and names one thing that needs attention before the next map. Nobody is asked to produce a speech. A stiff shoulder, an unclear call, or a late arrival is enough. Mara writes down anything that changes the plan. The point is to make the small problems visible before the room becomes noisy again, not to manufacture a particular mood or promise a better result.",
                "A ten-minute aim warmup follows, with the same sequence whether the previous series ended well or badly. Mako works on the first controlled movement rather than speed. Tinker checks the timing of support calls. Sable reviews the routes that connect those jobs, while Vexa walks through two defensive exits. Each player then spends a short block on a role-specific replay. The group watches only the moments that can produce an action in the next match, leaving the longer discussion for another day.",
                "The last five minutes happen without screens. A delayed start can stretch the wait, so the routine includes a clear restart point rather than another full warmup. Water stays within reach, the next map stays on one page, and the first call belongs to the same person every time. None of this is presented as a formula for winning. It is a way to arrive ready to listen. When the server opens, the team should have fewer decisions to make before the first useful one."
            ]
        },
        {
            title:"A home kit built for long LAN days",category:"Team",time:"3 min read",image:"jersey",
            dek:"Why the final pattern uses three slashes and almost no branding.",
            quote:"The kit had to work after the arena lights went off.",
            paragraphs:
            [
                "The first fabric test happened at a desk, not under arena lighting. Players wore an unmarked sample through a full practice block, then checked the seams where a headset cable, chair edge, or folded arm might catch. The team kept notes on warmth and movement instead of asking which version looked fastest. A lighter panel helped during long sessions, but the collar needed more structure. That small change survived every later sample because it solved a problem someone could actually describe.",
                "Travel washing became the second test. A shirt that needs special treatment after every event is not a useful team uniform, so the sample went through repeated cold washes and ordinary air drying. The group checked the shape, the print edges, and the feel of the fabric the following morning. The fictional shop describes the result as recycled performance knit, not a technical advantage. Fit notes remain specific because a useful size choice matters more than a paragraph of claims about performance.",
                "The original three-slash mark arrived after the cut was settled. It follows the direction of the shoulder panel without filling the chest, leaving space for the shirt to feel like clothing away from the venue. Volt piping makes the edges readable against black fabric, while the rest stays quiet. Every item shown here is a local demonstration rather than stock available to buy. The design exercise is complete when a visitor can inspect the fit, choose a size, and understand exactly what the demo does."
            ]
        },
        {
            title:"Scrim notes: defending the split",category:"Matches",time:"5 min read",image:"player-vexa",
            dek:"Three small adjustments from a week of replay reviews.",
            quote:"A useful note names the next action.",
            paragraphs:
            [
                "Tinker's replay library starts with plain labels: early information, second contact, and exit route. Those tags let the team compare similar moments without watching an entire evening again. This week, the defensive split appeared in all three groups. Vexa was receiving information from one side while the nearest teammate was already committed to another. The problem was not effort or attention. The two players were working from different pictures, and the review needed a shared point from which to begin the next round.",
                "The first adjustment changed defensive spacing by a single position. Sable stayed within a useful trading distance until the second contact was confirmed. The second adjustment gave Tinker ownership of the exit call, removing a conversation that had previously happened too late. The third was a limit: no new variation until the same setup had been tested in three scrims. That made the practice block less varied but easier to evaluate. Everyone could name what had changed and what should remain the same.",
                "The drill ended when the team could repeat the retreat without a reminder, not when it produced a good-looking score. Mara kept two clips: one successful round and one loss in which the spacing was still correct. They showed the difference between executing a plan and controlling every outcome. Next week, the group will look for the same tags in a different map. If the note still helps someone choose the next action, it stays. If it only explains what already happened, it gets rewritten."
            ]
        }
    ],
    ui:
    {
        menu:"Menu", close:"Close", cart:"Kit bag", next:"Next", previous:"Previous", all:"All",
        sample:"Local sample data for the Meridian Open. All players, fixtures and statistics are fictional.",
        nextSeries:"NEXT SERIES", rosterHeading:"Five ways to win a round.", rosterCopy:"Different instincts, one shared playbook.",
        matchesHeading:"The next test. The last receipt.", shopHeading:"The off-map uniform.",
        shopCopy:"Heavy cotton, quiet branding, and room for long LAN days.", newsHeading:"Notes from inside the round.",
        rosterTitle:"Different instincts. One read.", rosterIntro:"Meet the five players behind Static Vale, their roles, and the numbers that shape a series.",
        glossary:"KAST: rounds with a kill, assist, survival, or trade. K/D: kill-death ratio.",
        matchesTitle:"Every round leaves a trace.", matchesIntro:"Upcoming fixtures, final scores, and the map-by-map story.",
        shopTitle:"Built for the long day.", shopIntro:"Heavy fabrics, practical layers, and an original STV slash mark. Every product is a fictional demo item.",
        demo:"Demo store / no payment is collected", newsTitle:"What happened. What we learned.",
        newsIntro:"Match reviews, preparation notes, and the working life behind Static Vale.",
        fullRoster:"Full roster", allMatches:"All fixtures & results", allShop:"Shop all six pieces", allNews:"All stories",
        partners:"BUILT WITH OUR PARTNERS", partnership:"Partnership enquiries", add:"Add", quick:"Quick view",
        addCart:"Add to cart", size:"Size", quantity:"Quantity", remove:"Remove", subtotal:"Subtotal",
        shipping:"Free demo shipping", checkout:"Local demo checkout", empty:"Your kit bag is empty",
        continue:"Continue shopping", back:"Back to cart", email:"Email", country:"Country", review:"Review demo order",
        place:"Place demo order", saved:"Demo order saved in this browser. No payment was taken and no email was sent.",
        clear:"Clear demo order", local:"Browser-only demo. Nothing is sent to a server.", read:"Read story",
        download:"Download match card", mapPool:"Map pool: Array, Causeway, Foundry",
        stay:"STAY READY.", contact:"Contact", blackVolt:"Black / Volt", recent:"RECENT PERFORMANCES",
        active:"ACTIVE FIVE / MERIDIAN OPEN", teamGoods:"TEAM GOODS / SIX PIECES", newsroom:"TEAM JOURNAL / NOTES FROM THE SERVER ROOM",
        seasonHeader:"MERIDIAN OPEN / MATCH CENTER", upcoming:"Upcoming", results:"Results", details:"Match details",
        prepare:"The plan fits on one page.", prepareCopy:"Three likely maps. Two opponent habits. One reset word if the round gets loud.",
        summary:["12–4 series","34 maps played","6 finals reached"],
        care:[["Cold wash","Turn printed pieces inside out."],["Carry more","The duffel fits a keyboard sleeve and headset."],["Repair first","Spare snaps ship with the overshirt."]],
        fitNote:"Check the fit note before choosing a size. All merchandise is fictional.",
        footer:"Independent Tactical arena team competing in the Meridian Open.",
        filters:["All","Wear","Accessories"], storyFilters:["All","Matches","Culture","Team"],
        matchFilters:["All","Upcoming","Results"], latest:"LATEST RESULT", semifinal:"Meridian semifinal / Best of 3",
        noPayment:"Order review / no payment", player:"player", items:"items", selected:"Selected", count:"results",
        journal:"THE VALE JOURNAL", season:"SEASON 26 / FIELD NOTES", scroll:"PREPARATION. PRECISION. REPEAT.",
        unavailable:"Local storage is unavailable. Your bag will last for this visit only."
    }
};
