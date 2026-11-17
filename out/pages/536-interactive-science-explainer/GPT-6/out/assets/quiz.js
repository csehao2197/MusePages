import { content } from "./content.js";

export function quizMarkup()
{
    return content.quiz.questions.map((item, q) => `<fieldset class="question">
        <legend><span>0${q + 1} / 04</span>${item.question}</legend>
        ${item.options.map((option, i) => `<label><input type="radio" name="question-${q}" value="${i}" aria-describedby="feedback-${q}"><span>${option}</span></label>`).join("")}
        <p class="quiz-feedback" id="feedback-${q}" aria-live="polite" data-state="unanswered"></p>
    </fieldset>`).join("");
}

export function mountQuiz(section)
{
    const answers = new Map();
    const score = section.querySelector("#quiz-score");
    const completion = section.querySelector("#quiz-completion");
    function update()
    {
        const correct = [...answers].filter(([q, answer]) => content.quiz.questions[q].answer === answer).length;
        score.textContent = `${correct} / 4 ${content.quiz.progress}`;
        section.dataset.score = String(correct);
        section.dataset.answered = String(answers.size);
        completion.textContent = answers.size === 4 ? content.quiz.complete : content.quiz.incomplete;
    }
    section.querySelectorAll("input[type=radio]").forEach((input) =>
    {
        input.addEventListener("change", () =>
        {
            const q = Number(input.name.split("-")[1]);
            const selected = Number(input.value);
            const item = content.quiz.questions[q];
            const correct = selected === item.answer;
            answers.set(q, selected);
            const feedback = section.querySelector(`#feedback-${q}`);
            feedback.dataset.state = correct ? "correct" : "incorrect";
            feedback.textContent = `${correct ? content.quiz.correct : content.quiz.incorrect} ${item.explanation}`;
            update();
        });
    });
    section.querySelector("#quiz-reset").addEventListener("click", () =>
    {
        answers.clear();
        section.querySelectorAll("input").forEach((input) => input.checked = false);
        section.querySelectorAll(".quiz-feedback").forEach((feedback) =>
        {
            feedback.textContent = "";
            feedback.dataset.state = "unanswered";
        });
        update();
        section.querySelector("input").focus();
    });
    update();
}
