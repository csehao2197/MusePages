(function ()
{
    "use strict";

    var data = window.OffscriptData;
    var current = 0;
    var answers = [];
    var orders = [];
    var busy = false;
    var result = null;
    var activeDialog = null;
    var previousFocus = null;
    var theme = "light";
    var sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    var moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

    function byId(id)
    {
        return document.getElementById(id);
    }

    function escapeHtml(text)
    {
        return String(text).replace(/[&<>"']/g, function (character)
        {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
        });
    }

    function setTheme(value)
    {
        theme = value;
        document.documentElement.setAttribute("data-theme", value);
        byId("theme-toggle").innerHTML = value === "dark" ? sun : moon;
        byId("theme-toggle").setAttribute("aria-label", value === "dark" ? "Switch to light theme" : "Switch to dark theme");
        byId("theme-toggle").setAttribute("aria-pressed", String(value === "dark"));
        try
        {
            localStorage.setItem("offscript-theme", value);
        }
        catch (error)
        {
            // Private browsing may disable storage; the quiz still works.
        }
    }

    function showView(name)
    {
        ["entry", "quiz", "processing", "result"].forEach(function (id)
        {
            byId(id).hidden = id !== name;
        });
        document.body.classList.toggle("result-mode", name === "result");
        byId("theme-toggle").hidden = name === "result";
        window.scrollTo(0, 0);
        var heading = byId(name).querySelector("h1");
        if (heading)
        {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
        }
    }

    function renderQuestion()
    {
        busy = false;
        var question = data.questions[current];
        var dimension = data.dimensions[question.dimension];
        byId("quiz").innerHTML =
            '<div class="quiz-topline"><span>YOUR EVERYDAY / ' + dimension.name.toUpperCase() + '</span><span>' + (current + 1) + ' / 12</span></div>' +
            '<div class="progress-track" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="12" aria-valuenow="' + answers.filter(function (a) { return typeof a === "number"; }).length + '"><div class="progress-fill" style="width:' + (current / 12 * 100) + '%"></div></div>' +
            '<p class="question-intro">' + escapeHtml(question.intro) + '</p><h1 class="question-title">' + escapeHtml(question.question) + '</h1>' +
            '<div class="options" role="group" aria-label="Choose one answer">' +
            orders[current].map(function (option, index)
            {
                var selected = answers[current] === option.value;
                return '<button type="button" class="option' + (selected ? " selected" : "") + '" data-value="' + option.value + '" aria-pressed="' + selected + '"><span class="option-letter" aria-hidden="true">' + "ABCD"[index] + '</span><span>' + escapeHtml(option.text) + '</span></button>';
            }).join("") + '</div>' +
            '<div class="quiz-controls"><button class="text-button" id="back" type="button"' + (current === 0 ? " disabled" : "") + '>← Previous question</button><span>Choose what feels most like today.</span></div>' +
            '<p class="small-note">Inspired by ' + escapeHtml(dimension.construct.toLowerCase()) + '. Original entertainment questions, not a validated scale.</p>';
        byId("quiz").querySelectorAll(".option").forEach(function (button)
        {
            button.addEventListener("click", function ()
            {
                selectAnswer(button);
            });
        });
        byId("back").addEventListener("click", function ()
        {
            if (busy || current === 0)
            {
                return;
            }
            current--;
            renderQuestion();
            showView("quiz");
        });
        var heading = byId("quiz").querySelector("h1");
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
    }

    function selectAnswer(button)
    {
        if (busy)
        {
            return;
        }
        busy = true;
        answers[current] = Number(button.getAttribute("data-value"));
        byId("quiz").querySelectorAll(".option").forEach(function (option)
        {
            var chosen = option === button;
            option.classList.toggle("selected", chosen);
            option.setAttribute("aria-pressed", String(chosen));
            option.disabled = true;
        });
        byId("back").disabled = true;
        window.setTimeout(function ()
        {
            current++;
            if (current < data.questions.length)
            {
                renderQuestion();
                showView("quiz");
            }
            else
            {
                showView("processing");
                window.setTimeout(function ()
                {
                    result = data.calculateResult(answers);
                    renderResult();
                    showView("result");
                    busy = false;
                }, 1700);
            }
        }, 200);
    }

    function startQuiz()
    {
        current = 0;
        answers = [];
        result = null;
        orders = data.questions.map(data.shuffledOptions);
        renderQuestion();
        showView("quiz");
    }

    function radar(scores)
    {
        var center = 160;
        var radius = 96;
        var points = scores.map(function (score, index)
        {
            var angle = (-90 + index * 90) * Math.PI / 180;
            var length = score / 100 * radius;
            return (center + Math.cos(angle) * length).toFixed(1) + "," + (center + Math.sin(angle) * length).toFixed(1);
        }).join(" ");
        var rings = [0.25, 0.5, 0.75, 1].map(function (scale)
        {
            var r = radius * scale;
            return '<polygon points="160,' + (160 - r) + ' ' + (160 + r) + ',160 160,' + (160 + r) + ' ' + (160 - r) + ',160" fill="none" stroke="#393939"/>';
        }).join("");
        return '<svg class="radar" viewBox="0 0 320 320" role="img" aria-label="' + escapeHtml("Four-dimension radar: " + data.dimensions.map(function (d, i) { return d.name + " " + scores[i] + " out of 100"; }).join(", ")) + '">' +
            rings + '<path d="M160 64v192M64 160h192" stroke="#393939"/><polygon points="' + points + '" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="1.5"/>' +
            '<text x="160" y="40" text-anchor="middle">CURIOSITY</text><text x="268" y="164" text-anchor="start">RHYTHM</text><text x="160" y="284" text-anchor="middle">ENERGY</text><text x="52" y="164" text-anchor="end">VIEW</text></svg>';
    }

    function renderResult()
    {
        var profile = result.profile;
        var partners = data.findPartners(profile);
        byId("result").innerHTML =
            '<div class="result-hero"><div class="eyebrow">YOUR OFF-SCRIPT PERSPECTIVE</div><span class="profile-emoji" aria-hidden="true">' + profile.emoji + '</span><div class="result-code">' + profile.code + '</div><h1 class="result-title">' + profile.name + '</h1><p>One perspective. Plenty of room to change.</p></div>' +
            '<div class="result-block"><div class="result-stat"><span>Off-script index</span><strong>' + result.index + '%</strong></div><div class="progress-track"><div class="progress-fill" style="width:' + result.index + '%"></div></div><p class="small-note">Average of your four directional scores. Not a percentile, achievement, or measure of wellbeing. Higher is not better.</p></div>' +
            '<div class="result-block"><h2>Your four dimensions</h2>' + radar(result.scores) + '<div class="dimension-list">' +
            data.dimensions.map(function (dimension, index)
            {
                var tier = profile.tiers[index] ? dimension.high : dimension.low;
                return '<div class="dimension-row"><span>' + dimension.name + ' · ' + tier.name + '</span><strong>' + result.scores[index] + '/100</strong><small>0 = ' + dimension.low.name + ' · 100 = ' + dimension.high.name + '</small></div>';
            }).join("") + '</div><p class="small-note" style="margin-top:16px">Each score is a direction, not a strength. Exact midpoint ties go to the second named pole.</p></div>' +
            '<div class="result-block"><blockquote>“' + profile.quote + '”</blockquote></div>' +
            '<div class="result-block interpretation"><h2 style="margin-bottom:16px">Your everyday, in perspective.</h2>' +
            profile.paragraphs.map(function (paragraph) { return '<p>' + paragraph + '</p>'; }).join("") + '</div>' +
            '<div class="quality-card"><div class="section-heading"><h2>A little transparency</h2><span class="quality-badge">4 / 4 MAPPED</span></div><p class="small-note">Theory coverage: 100% conceptual mapping to openness, planning, social engagement, and attention. This is coverage, not scientific accuracy.</p><div class="progress-track"><div class="progress-fill" style="width:100%"></div></div><p class="small-note">Original questions · 3 scholarly references<br>Question validity: not established<br>Reliability and compatibility: not tested</p><button class="text-button" id="result-method" type="button">Read the method & references ↗</button></div>' +
            '<div class="result-block"><h2>Your adventure counterparts</h2><p class="small-note" style="margin-top:8px">Three contrasting perspectives to try a day with. A playful complement rule, not a prediction about relationships.</p>' +
            partners.map(function (partner)
            {
                return '<div class="partner"><span aria-hidden="true">' + partner.profile.emoji + '</span><div><strong>' + partner.profile.name + '</strong><small>' + partner.reason + '</small></div><span class="partner-code">' + partner.profile.code + '</span></div>';
            }).join("") +
            '<p class="small-note">Ranked by opposite poles: curiosity 4, rhythm 3, energy 2, perspective 1. Ties use alphabetical code order.</p></div>' +
            '<div class="result-actions"><button class="button primary" id="copy-result" type="button">Copy & share ↗</button><button class="button" id="save-result" type="button">Save result ↓</button><button class="button restart-button" id="restart" type="button">Take a fresh look ↺</button></div><p id="share-status" class="share-status" role="status"></p><p class="small-note" style="text-align:center">For entertainment, not a psychological assessment.<br>Your answers are not uploaded or saved.</p>';
        byId("result-method").addEventListener("click", function () { openDialog("about-overlay"); });
        byId("restart").addEventListener("click", function ()
        {
            answers = [];
            result = null;
            current = 0;
            showView("entry");
        });
        byId("copy-result").addEventListener("click", copyResult);
        byId("save-result").addEventListener("click", saveResult);
    }

    function shareText()
    {
        var profile = result.profile;
        var url = window.location.href.split(/[?#]/)[0];
        return "[Everyday adventure quiz result]\n\nI am “" + profile.name + "” " + profile.emoji + " · " + profile.code + "\n" +
            data.dimensions.map(function (dimension, index)
            {
                var tier = profile.tiers[index] ? dimension.high : dimension.low;
                return dimension.name + " (" + tier.name + ")";
            }).join(" · ") +
            "\n\nOff-script index: " + result.index + "%\n\n“" + profile.quote + "”\n\nAdventure counterparts:\n" +
            data.findPartners(profile).map(function (partner, index)
            {
                return (index + 1) + ". " + partner.profile.emoji + " " + partner.profile.name;
            }).join("\n") + "\n\nFind your own perspective: " + url + "\n\nFor entertainment. Not a validated psychological assessment or diagnosis. Counterparts are playful, not validated compatibility.";
    }

    function fallbackShare(text)
    {
        byId("share-fallback").value = text;
        openDialog("copy-overlay");
        byId("share-fallback").focus();
        byId("share-fallback").select();
        byId("share-status").textContent = "Your share text is ready to copy manually.";
    }

    function copyResult()
    {
        var text = shareText();
        if (navigator.clipboard && navigator.clipboard.writeText)
        {
            navigator.clipboard.writeText(text).then(function ()
            {
                byId("share-status").textContent = "Copied. Share your perspective wherever you like.";
            }).catch(function ()
            {
                fallbackShare(text);
            });
        }
        else
        {
            fallbackShare(text);
        }
    }

    function saveResult()
    {
        var blob = new Blob([shareText() + "\n\nYour reflection\n\n" + result.profile.paragraphs.join("\n\n")], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "offscript-" + result.profile.code.toLowerCase() + ".txt";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        byId("share-status").textContent = "Result file prepared. Keep it as a little snapshot of today.";
    }

    function openDialog(id)
    {
        previousFocus = document.activeElement;
        activeDialog = byId(id);
        activeDialog.hidden = false;
        byId("main").setAttribute("inert", "");
        document.querySelector(".site-header").setAttribute("inert", "");
        document.querySelector(".site-footer").setAttribute("inert", "");
        document.body.style.overflow = "hidden";
        activeDialog.querySelector('[role="dialog"]').focus();
    }

    function closeDialog()
    {
        if (!activeDialog)
        {
            return;
        }
        activeDialog.hidden = true;
        activeDialog = null;
        byId("main").removeAttribute("inert");
        document.querySelector(".site-header").removeAttribute("inert");
        document.querySelector(".site-footer").removeAttribute("inert");
        document.body.style.overflow = "";
        if (previousFocus)
        {
            previousFocus.focus();
        }
    }

    byId("theory-content").innerHTML = data.dimensions.map(function (dimension)
    {
        return '<div class="theory-item"><strong>' + dimension.name + ' · ' + dimension.low.letter + '/' + dimension.high.letter + '</strong>' + dimension.insight + ' Source [' + (dimension.reference + 1) + '].</div>';
    }).join("") + '<p>Four dimensions, two poles each: 2 × 2 × 2 × 2 = 16 perspectives. They are editorial lenses, not proven independent traits. Per dimension, three questions use weights 1, 2, 1; original answer values are 0, 1, 3, 4. Score = weighted total ÷ 16 × 100, rounded. Scores below 50 use the first pole; 50 and above use the second. Answer display order is shuffled for every fresh attempt.</p>';
    byId("references").innerHTML = data.references.map(function (reference) { return "<li>" + escapeHtml(reference) + "</li>"; }).join("");
    byId("start").addEventListener("click", startQuiz);
    byId("theme-toggle").addEventListener("click", function () { setTheme(theme === "light" ? "dark" : "light"); });
    byId("about-open").addEventListener("click", function () { openDialog("about-overlay"); });
    byId("about-close").addEventListener("click", closeDialog);
    byId("copy-close").addEventListener("click", closeDialog);
    document.querySelectorAll(".dialog-overlay").forEach(function (overlay)
    {
        overlay.addEventListener("click", function (event)
        {
            if (event.target === overlay)
            {
                closeDialog();
            }
        });
    });
    document.addEventListener("keydown", function (event)
    {
        if (!activeDialog)
        {
            return;
        }
        if (event.key === "Escape")
        {
            event.preventDefault();
            closeDialog();
        }
        else if (event.key === "Tab")
        {
            var elements = activeDialog.querySelectorAll('button, textarea, a[href], [tabindex="0"]');
            var first = elements[0];
            var last = elements[elements.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === activeDialog.querySelector('[role="dialog"]')))
            {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last)
            {
                event.preventDefault();
                first.focus();
            }
        }
    });
    try
    {
        var storedTheme = localStorage.getItem("offscript-theme");
        if (storedTheme === "light" || storedTheme === "dark")
        {
            theme = storedTheme;
        }
    }
    catch (error)
    {
        theme = "light";
    }
    setTheme(theme);
}());
