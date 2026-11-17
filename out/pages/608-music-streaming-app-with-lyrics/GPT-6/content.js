export const content =
{
    brand: "Stillform",
    slug: "stillform",
    mood: "Late-night electronic soul",
    audience: "the ones who read every lyric",
    tagline: "A little closer to the words.",
    featured: "Paper After Dark",
    intro: "Six small songs for the space between the last train and the first light. Put something on. Stay with the words.",
    source: "Original procedural audio · no external stream",
    noteTitle: "Made to be listened to, not just looked at.",
    note: "Every artist, lyric, cover, listener note, and chart figure here is fictional. Six original instrumental previews live right in this demo. Your likes, notes, saves, and queue stay on this device.",
    credit: { label: "Template by VibeFather", url: "https://vibefather.ai/t/music-streaming-app-with-lyrics" },
    nav: [["/", "Library", "library"], ["/charts", "Charts", "chart"], ["/now-playing", "Now Playing", "disc"]],
    labels:
    {
        search: "Search songs, artists, playlists", queue: "Queue", library: "Your library",
        playlist: "Play playlist", addAll: "Add all to queue", save: "Save playlist", saved: "Saved",
        play: "Play", pause: "Pause", previous: "Previous", next: "Next", lyrics: "Lyrics", add: "Queue",
        reset: "Reset local demo", local: "Local demo · original previews", preview: "PREVIEW",
        collections: "A few ways to get lost.", collectionDetail: "Three collections. One carefully made little catalog.",
        tracks: "Tracks worth reading closely", catalogLabel: "THE COMPLETE CATALOG",
        sample: "Sample plays", editorial: "EDITORIAL NOTE", comments: "Listener notes",
        chartTitle: "Six songs. One very subjective chart.",
        chartCopy: "An editorial sample ranking for late-night electronic soul. These play counts are illustrative, not live.",
        chartInfo: "Ranks, movement labels, and play counts are fixed sample data. Playing a preview does not change the editorial chart.",
        guide: "How to listen", steps: ["Press Play to unlock audio", "Open Lyrics to follow or seek a line", "Use Queue to shape what plays next"],
        upNext: "Up next on this device", empty: "Your queue is open. Add a track from the chart.",
        queueTitle: "Your queue", queueDescription: "Audio plays in this order", clear: "Clear upcoming",
        restore: "Add chart", close: "Close", remove: "Remove", moveUp: "Move up", moveDown: "Move down",
        playNext: "Play next", lyricsOn: "Lyrics on", lyricsOff: "Lyrics off", offCopy: "The words can wait. Leave a little room for the music.",
        guest: "Guest listener", placeholder: "Leave a thought between the lines…", write: "Write a listener note",
        localNote: "Your comment is posted only on this device.", publish: "Publish note",
        mostLiked: "Most liked", originalOrder: "Original order", posted: "Posted on this device",
        invalid: "Write 1–240 characters before publishing.", volume: "Volume", mute: "Mute", unmute: "Unmute",
        seek: "Seek preview", replay: "Replay", now: "NOW PLAYING", instrumental: "18-second original instrumental preview",
        resetTitle: "Start fresh on this device?", resetCopy: "This clears only your local notes, likes, saves, and queue. The original catalog stays.",
        clearTitle: "Clear upcoming tracks?", clearCopy: "The current preview will keep its place. You can add the chart again any time.",
        cancel: "Keep listening", confirm: "Confirm", noResults: "No matches. Try a song, artist, or playlist.",
        resultTracks: "SONGS", resultPlaylists: "PLAYLISTS", clearSearch: "Clear search",
        savedToast: "Playlist saved on this device.", unsavedToast: "Playlist removed from saved.",
        addedToast: "Queue updated. No duplicate tracks.", currentToast: "Track selected. Press Play when you are ready.",
        likeToast: "Listener-note like updated on this device.", noteToast: "Your note is saved on this device.",
        deleteToast: "Your local note was removed.", queueToast: "Your listening order was updated.",
        resetToast: "Local demo reset. Playback is paused.", audioError: "The local preview could not play. Please try Play again.",
        clearToast: "Upcoming tracks cleared.", delete: "Delete note", browse: "Browse library",
        count: "tracks", originalMix: "A STILLFORM ORIGINAL MIX", collection: "COLLECTION",
        sixNote: "6 tracks · 18-second original previews · local audio", read: "Read the lyrics",
        nextChapter: "YOUR NEXT CHAPTER", subtitle: "A small catalog. A deeper listen.", allTracks: "All six tracks",
        stagePath: "Library / Now Playing", sound: "Sound", queueCurrent: "CURRENT PREVIEW",
        expand: "Expand Now Playing", noteCount: "characters", lyricStart: "Seek to lyric at",
        chartPlay: "Play chart", playlistQueue: "Add collection to queue", info: "About the sample chart",
        edition: "STILLFORM SELECTS / 001", sortNotes: "Sort listener notes", likeNote: "Like note by",
        addToQueue: "Add to queue", openQueue: "Open queue"
    }
};

export const tracks =
[
    {
        id: "window-weather", title: "Window Weather", artist: "Iris Vale", file: "afterglow-avenue",
        alt: "Abstract mixed-media avenue lights in apricot and coral on deep plum.",
        bpm: 80, root: 57, scale: [0, 2, 3, 5, 7, 9, 10], motif: [0, 4, 2, 6, 3, 1], seed: 171,
        lyrics: ["The last train folds its paper wings", "Your cup leaves moons upon the sill", "A passing window softly sings", "Of all the rooms the rain can fill", "I leave the quiet light for you", "And watch the glass turn almost blue"],
        comments: [
            ["SoftMargins", "The cup leaving a moon on the windowsill is such a small, good image.", 42],
            ["QuietLinen", "The little piano motif makes room for that third line.", 27],
            ["PaperDial", "I queued Harbor in Blue after this. They share the same kind of air.", 18],
            ["LowercaseSky", "A tiny instrumental postcard. I came back to read it twice.", 9]
        ],
        plays: 48206, movement: "—"
    },
    {
        id: "apricot-receiver", title: "Apricot Receiver", artist: "Oren Finch", file: "peach-static",
        alt: "Abstract peach arcs and soft signal lines in a grainy mixed-media composition.",
        bpm: 88, root: 60, scale: [0, 2, 4, 5, 7, 9, 11], motif: [2, 0, 4, 3, 5, 1], seed: 282,
        lyrics: ["An orange peel beside the wire", "The kitchen catches little sparks", "We turn the dial a little higher", "And draw a door into the dark", "Your signal warms the empty chair", "A summer folded into air"],
        comments: [["WarmDial", "That small descending phrase feels like coming home to a lamp left on.", 31], ["AnalogFern", "The last image made me stay with the words after the sound stopped.", 14]],
        plays: 37419, movement: "—"
    },
    {
        id: "harbor-in-blue", title: "Harbor in Blue", artist: "Ada Solis", file: "blue-hour-radio",
        alt: "Abstract powder-blue radio waves and a coral moon on textured plum paper.",
        bpm: 72, root: 55, scale: [0, 2, 3, 5, 7, 8, 10], motif: [0, 2, 5, 4, 1, 3], seed: 393,
        lyrics: ["The harbor holds a second sky", "A rope taps softly on the rail", "We let the brighter boats go by", "And keep the color of their trail", "One blue note underneath the foam", "A frequency that sounds like home"],
        comments: [["TideReader", "The rope against the rail: I can almost hear the place around this.", 26], ["BlueSpool", "A good little companion for the end of a long paragraph.", 11]],
        plays: 41882, movement: "+2"
    },
    {
        id: "small-orbits", title: "Small Orbits", artist: "Lowell Reed", file: "velvet-satellites",
        alt: "Abstract gouache satellite spheres and lilac orbital ribbons on deep plum.",
        bpm: 76, root: 53, scale: [0, 2, 3, 5, 7, 8, 10], motif: [4, 0, 3, 6, 2, 1], seed: 404,
        lyrics: ["A thread of silver on the floor", "The room revolves around a sound", "You turn the handle of the door", "And leave the whole night turning round", "Our little planets find their place", "Two quiet circles sharing space"],
        comments: [["LittleEllipse", "The lower notes give these small planets their own gravity.", 19], ["ThreadAndTone", "I like the space before the last motif comes back.", 8]],
        plays: 29764, movement: "+1"
    },
    {
        id: "light-through-glass", title: "Light Through Glass", artist: "Tess Linden", file: "glass-garden",
        alt: "Abstract translucent botanical shapes with apricot light and powder-blue shadows.",
        bpm: 84, root: 62, scale: [0, 2, 4, 6, 7, 9, 11], motif: [0, 3, 1, 5, 4, 2], seed: 515,
        lyrics: ["The fern unfolds a paper hand", "A green reflection finds the wall", "No need to make the morning grand", "A drop of light contains it all", "We let the open window stay", "And grow a little toward the day"],
        comments: [["FernPocket", "A little brighter without breaking the mood of the collection.", 23], ["GlassLetters", "The fourth line is the one I kept coming back to.", 12]],
        plays: 24108, movement: "-2"
    },
    {
        id: "the-last-lantern", title: "The Last Lantern", artist: "Noa & the Fold", file: "midnight-orchard",
        alt: "Abstract orchard circles and dark branches with coral fruit and lilac grain.",
        bpm: 68, root: 50, scale: [0, 2, 3, 5, 7, 9, 10], motif: [5, 2, 4, 0, 3, 1], seed: 626,
        lyrics: ["A lantern sways above the pear", "The ladder leans into the night", "We leave a little sweetness there", "For all the moths that follow light", "The final branch lets go of gold", "A warmer thing than we can hold"],
        comments: [["OrchardFold", "This belongs at the end of the queue. It closes the room gently.", 21], ["LanternGrain", "The pear and the moths make a whole world in six lines.", 10]],
        plays: 19530, movement: "NEW"
    }
];

export const playlists =
[
    { id: "paper-after-dark", title: content.featured, description: "Soft synths, paper moons, and words for the journey home.", ids: tracks.map(t => t.id), covers: [0, 2, 3, 5] },
    { id: "soft-signal-studies", title: "Soft Signal Studies", description: "Warm static and brighter edges for a slower reset.", ids: [tracks[1].id, tracks[4].id, tracks[0].id], covers: [1, 4] },
    { id: "the-quiet-orbit", title: "The Quiet Orbit", description: "A darker orbit for the space between the lines.", ids: [tracks[3].id, tracks[2].id, tracks[5].id], covers: [3, 2] }
];

export const chart = [tracks[0].id, tracks[2].id, tracks[1].id, tracks[3].id, tracks[4].id, tracks[5].id];
