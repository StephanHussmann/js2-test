// Vollständige bereinigte Version von script4.js mit integrierter showDotField-Funktion

document.addEventListener("DOMContentLoaded", () => {
    const task = {
      question: "Wie viel Eintrittsgeld muss Kimmi für alle Kinder zahlen?",
      questionPhrases: ["Wie viel Eintrittsgeld", "alle Kinder", "zahlen", "Kimmi"],
      text: [
        "Kimmi macht mit ihren Freundinnen einen Ausflug.",
        "Die Gruppe, die aus sechs Kindern besteht, fährt in den Freizeitpark.",
        "Von Kimmi werden pro Kind sieben Euro Eintrittsgeld eingesammelt.",
        "Für den Ausflug nimmt jedes Kind zehn Euro Taschengeld mit, um sich im Park etwas zu kaufen."
      ],
      textPhrases: [
        "Kimmi", "Freundinnen", "einen Ausflug", "Gruppe, die aus sechs Kindern besteht",
        "Freizeitpark", "pro Kind", "sieben Euro", "Eintrittsgeld", "jedes Kind",
        "zehn Euro", "Taschengeld"
      ],
      correctMatches: {
        "Wie viel Eintrittsgeld": "sieben Euro",
        "alle Kinder": "Gruppe, die aus sechs Kindern besteht"
      }
    };
  
    const questionContainer = document.getElementById("question");
    const textContainer = document.getElementById("text");
    const button = document.getElementById("doneButton");
    const summary = document.getElementById("selectedSummary");
    const tablePlaceholder = document.getElementById("tablePlaceholder");
    let continueBtn = null;
  
    renderQuestion();
  
    button.addEventListener("click", () => {
      button.style.display = "none";
      textContainer.innerHTML = "";
      const heading = document.createElement("p");
      heading.textContent =
        "TI - Lies die Textaufgabe genau durch und markiere alle Informationen, die zur Frage passen.";
      heading.className = "instruction";
      textContainer.appendChild(heading);
  
      task.text.forEach(line => {
        const p = document.createElement("p");
        p.innerHTML = highlightPhrases(line, task.textPhrases);
        p.style.fontFamily = "Patrick Hand";
        p.style.fontSize = "1.2em";
        textContainer.appendChild(p);
      });
  
      document.querySelectorAll("#text .word").forEach(span => {
        span.addEventListener("click", () => {
          span.classList.toggle("marked");
          updateLiveSummary();
        });
      });
  
      if (continueBtn) {
        continueBtn.style.display = "block";
      }
    });
  
    function highlightPhrases(text, phrases) {
      const sorted = phrases.slice().sort((a, b) => b.length - a.length);
      sorted.forEach(phrase => {
        const regex = new RegExp(escapeRegex(phrase), "gi");
        text = text.replace(regex, match => `<span class="word">${match}</span>`);
      });
      return text;
    }
  
    function escapeRegex(text) {
      return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
  
    function renderQuestion() {
      questionContainer.innerHTML = `<p>${highlightPhrases(
        task.question,
        task.questionPhrases
      )}</p>`;
      questionContainer.style.fontSize = "1.1em";
      questionContainer.style.fontFamily = "Patrick Hand";
  
      document.querySelectorAll(".word").forEach(span => {
        span.addEventListener("click", () => {
          span.classList.toggle("marked");
          updateTable();
        });
      });
      addAudioToMarkedWords();
    }
  
    function addAudioToMarkedWords() {
      const wordAudioMap = {
        "Eintrittsgeld": "audio/eintritt.mp3",
        "Kimmi": "audio/kimmi.mp3",
        "alle Kinder": "audio/kinder.mp3"
      };
  
      document.querySelectorAll("#question .word").forEach(span => {
        const wordText = span.textContent.trim();
        const audioSrc = wordAudioMap[wordText];
        if (audioSrc) {
          const audio = new Audio(audioSrc);
          span.addEventListener("mouseenter", () => {
            audio.currentTime = 0;
            audio.play();
          });
          span.addEventListener("mouseleave", () => {
            audio.pause();
            audio.currentTime = 0;
          });
        }
      });
    }
  
    function updateTable() {
      tablePlaceholder.innerHTML = "";
      const marked = Array.from(
        document.querySelectorAll("#question .word.marked")
      ).map(span => span.textContent);
  
      if (marked.length === 0) return;
  
      const table = document.createElement("table");
      const header = document.createElement("tr");
      marked.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        header.appendChild(th);
      });
      table.appendChild(header);
  
      const row = document.createElement("tr");
      marked.forEach(key => {
        const td = document.createElement("td");
        td.innerHTML = "&nbsp;";
        td.style.minHeight = "2em";
        td.style.border = "1px solid #ccc";
        td.style.padding = "0.5em";
        td.dataset.key = key;
        td.ondragover = e => e.preventDefault();
        td.ondrop = e => {
          e.preventDefault();
          const data = e.dataTransfer.getData("text/plain");
          const original = document.getElementById(data);
          if (original) {
            const clone = original.cloneNode(true);
            clone.id = `copy-${Math.random().toString(36).substr(2, 9)}`;
            clone.querySelector("span").onclick = () => clone.remove();
            td.appendChild(clone);
          }
        };
        row.appendChild(td);
      });
      table.appendChild(row);
  
      const wrapper = document.createElement("div");
      wrapper.style.width = "70%";
      wrapper.style.margin = "4em auto";
      wrapper.appendChild(table);
  
      const feedbackBtn = document.createElement("button");
      feedbackBtn.innerHTML = "✔️ Check";
      feedbackBtn.className = "secondaryButton";
      feedbackBtn.style.marginTop = "2em";
      feedbackBtn.onclick = checkFeedback;
      wrapper.appendChild(feedbackBtn);
  
      continueBtn = document.createElement("button");
      continueBtn.textContent = "➤ Weiter zum Punktebild";
      continueBtn.className = "secondaryButton";
      continueBtn.style.display = "none";
      continueBtn.style.marginTop = "1em";
      continueBtn.onclick = () => showDotField(10, 10);
  
      wrapper.appendChild(continueBtn);
  
      tablePlaceholder.appendChild(wrapper);
    }
  
    function checkFeedback() {
      const cells = document.querySelectorAll("#tablePlaceholder td");
      cells.forEach(td => {
        const expected = task.correctMatches[td.dataset.key];
        const boxes = td.querySelectorAll(".box input");
  
        boxes.forEach(input => {
          input.style.border = "2px solid transparent";
          const actual = input.value.trim();
          if (actual === expected) {
            input.style.border = "2px solid green";
            input.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'><path d=\'M1 5 L4 8 L9 1\' stroke=\'green\' stroke-width=\'2\' fill=\'none\'/></svg>')";
            input.style.backgroundRepeat = "no-repeat";
            input.style.backgroundPosition = "right center";
            input.style.paddingRight = "1.5em";
          } else {
            input.style.border = "2px solid red";
            input.style.backgroundImage = "none";
          }
        });
      });
    }
  
    function updateLiveSummary() {
      summary.innerHTML = "";
      const marked = Array.from(document.querySelectorAll("#text .word.marked"));
  
      marked.forEach(span => {
        const box = document.createElement("div");
        box.className = "box";
        box.id = `box-${Math.random().toString(36).substr(2, 9)}`;
        box.setAttribute("draggable", "true");
        box.ondragstart = e => {
          e.dataTransfer.setData("text/plain", box.id);
        };
  
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent.trim();
        input.readOnly = true;
        input.style.width = `${Math.max(2, span.textContent.length)}ch`;
        box.appendChild(input);
  
        const removeBtn = document.createElement("span");
        removeBtn.textContent = " ✖";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.marginLeft = "0.5em";
        removeBtn.onclick = () => box.remove();
        box.appendChild(removeBtn);
  
        summary.appendChild(box);
      });
    }
  
    // ➤ ShowDotField wird hier ergänzt (siehe vorige Nachricht für vollständigen Block)
    function showDotField(rows, cols) {
      if (document.getElementById("dotFieldContainer")) return;
  
      const container = document.createElement("div");
      container.id = "dotFieldContainer";
  
      const headline = document.createElement("p");
      headline.innerHTML = "B - Erstelle ein Punktebild.<br> Klicke auf die Zeilen, um Kinder einzufügen. Klicke auf die Punkte, um Euros einzufügen.";
      headline.className = "instruction";
      document.body.appendChild(headline);
  
      const field = document.createElement("div");
      field.id = "dotField";
      field.style.display = "grid";
      field.style.gridTemplateColumns = `2em repeat(${cols}, 2em)`;
      field.style.gap = "0.4em";
      field.style.margin = "2em";
      field.style.width = "fit-content";
      field.style.justifyContent = "flex-start";
  
      const output = document.createElement("div");
      output.id = "dotTextOutput";
  
      let isTouching = false;
      let actionMode = null;
  
      field.addEventListener("mousedown", () => {
        isTouching = true;
        actionMode = null;
      });
  
      document.addEventListener("mouseup", () => {
        isTouching = false;
      });
  
      field.addEventListener("mousemove", e => {
        if (isTouching && e.target.matches("div") && e.target.title?.startsWith("Punkt")) {
          if (!actionMode) actionMode = e.target.textContent === "€" ? "remove" : "add";
          if (actionMode === "add" && e.target.textContent !== "€") {
            e.target.textContent = "€";
            e.target.style.background = "#4caf50";
          } else if (actionMode === "remove" && e.target.textContent === "€") {
            e.target.textContent = "";
            e.target.style.background = "#eee";
          }
          updateOutput();
        }
      });
  
      for (let row = 0; row < rows; row++) {
        const label = document.createElement("div");
        label.style.cssText = "width:2em;height:2em;border:1px solid #888;border-radius:0.25em;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;";
        label.title = `Zeile ${row + 1}`;
        label.onclick = () => {
          label.textContent = label.textContent === "👦" ? "" : "👦";
          label.animate([{ transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 200 });
          updateOutput();
        };
        field.appendChild(label);
  
        for (let col = 0; col < cols; col++) {
          const dot = document.createElement("div");
          dot.style.cssText = "width:2em;height:2em;border:1px solid #888;border-radius:50%;background:#eee;display:flex;align-items:center;justify-content:center;font-size:0.75em;transition:background-color 0.3s, box-shadow 0.3s;";
          dot.title = `Punkt ${row * cols + col + 1}`;
          dot.onmouseenter = () => dot.style.boxShadow = "0 0 6px #4caf50";
          dot.onmouseleave = () => dot.style.boxShadow = "none";
          dot.onclick = () => {
            dot.textContent = dot.textContent === "€" ? "" : "€";
            dot.style.background = dot.textContent === "€" ? "#4caf50" : "#eee";
            dot.animate([{ transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 200 });
            updateOutput();
          };
          field.appendChild(dot);
        }
      }
  
      const layoutContainer = document.createElement("div");
      layoutContainer.style.display = "flex";
      layoutContainer.style.alignItems = "flex-start";
      layoutContainer.style.gap = "2em";
      layoutContainer.style.margin = "2em";
      layoutContainer.appendChild(field);
  
      container.appendChild(layoutContainer);
      container.appendChild(output);
      document.body.appendChild(container);
  
      const showLanguageBtn = document.createElement("button");
      showLanguageBtn.textContent = "✔️ Fertig mit Punktebild";
      showLanguageBtn.style.display = "block";
      showLanguageBtn.style.margin = "2em auto";
      showLanguageBtn.style.padding = "0.5em 1em";
      showLanguageBtn.style.fontSize = "1em";
      showLanguageBtn.style.border = "none";
      showLanguageBtn.style.borderRadius = "0.4em";
      showLanguageBtn.style.backgroundColor = "#007bff";
      showLanguageBtn.style.color = "white";
      showLanguageBtn.style.cursor = "pointer";
      showLanguageBtn.style.alignSelf = "flex-start";
      layoutContainer.appendChild(showLanguageBtn);
  
      showLanguageBtn.onclick = () => {
        const helper = document.getElementById("languageHelper");
        if (helper) {
          helper.style.display = "block";
          showLanguageBtn.style.display = "none";
        }
      };

      // --- Freitextfeld zuerst ---
const instructionText = document.createElement("p");
instructionText.className = "instruction";
instructionText.textContent = "Beschreibe das Punktebild möglichst gut.";
languageHelper.appendChild(instructionText);

const input = document.createElement("input");
input.type = "text";
input.id = "sentenceInput";
input.placeholder = "";
input.style.fontSize = "1.2em";
input.style.padding = "0.3em";
input.style.fontFamily = "Patrick Hand, cursive";
input.style.background = "transparent";
input.style.border = "none";
input.style.borderBottom = "1px solid #aaa";
input.style.outline = "none";
languageHelper.appendChild(input);

const helpToggle = document.createElement("button");
helpToggle.textContent = "❓ Hilfe anzeigen";
helpToggle.style.marginTop = "1em";
helpToggle.style.background = "#eee";
helpToggle.style.border = "none";
helpToggle.style.borderRadius = "0.4em";
helpToggle.style.padding = "0.3em 0.6em";
helpToggle.style.cursor = "pointer";
helpToggle.style.fontFamily = "Arial, sans-serif";
helpToggle.style.fontSize = "0.9em";
helpToggle.style.color = "#555";
helpToggle.style.textAlign = "left";
languageHelper.appendChild(helpToggle);

const hintText = document.createElement("div");
hintText.id = "hintText";
hintText.style.marginTop = "0.8em";
hintText.style.fontSize = "0.95em";
hintText.style.color = "#555";
hintText.style.display = "none";
hintText.innerHTML = `<p>Du kannst folgende Satzmuster verwenden:</p>
<ul style="margin-left: 1em; padding-left: 1em; list-style-type: disc;">
  <li><em>Pro Kind ...</em></li>
  <li><em>Jedes Kind ...</em></li>
  <li><em>Insgesamt ...</em></li>
</ul>`;
languageHelper.appendChild(hintText);

helpToggle.onclick = () => {
  hintText.style.display = hintText.style.display === "none" ? "block" : "none";
  helpToggle.textContent = hintText.style.display === "none" ? "❓ Hilfe anzeigen" : "❌ Hilfe ausblenden";
};

const feedback = document.createElement("div");
feedback.id = "feedback";
feedback.style.fontSize = "0.9em";
feedback.style.fontFamily = "Arial, sans-serif";
feedback.style.color = "#444";
feedback.style.marginTop = "1em";
languageHelper.appendChild(feedback);

// --- Dann das Rechenfeld ---
// Kompletter Rechenfeld-Block (inkl. Feedback und Hilfe)
const calcInstruction = document.createElement("p");
calcInstruction.className = "instruction";
calcInstruction.textContent = "Schreibe eine Rechnung zum Punktefeld.";
languageHelper.appendChild(calcInstruction);

const calcContainer = document.createElement("div");
calcContainer.style.marginTop = "2em";
calcContainer.style.display = "flex";
calcContainer.style.alignItems = "center";
calcContainer.style.gap = "0.6em";
calcContainer.style.fontFamily = "Arial, sans-serif";
calcContainer.style.fontSize = "1em";

const inputKids = document.createElement("input");
const inputEuro = document.createElement("input");
const inputResult = document.createElement("input");

[inputKids, inputEuro, inputResult].forEach(inp => {
  inp.type = "number";
  inp.min = "0";
  inp.style.width = "3em";
  inp.style.textAlign = "center";
  inp.style.fontSize = "1.1em";
  inp.style.border = "1px solid #ccc";
  inp.style.borderRadius = "0.3em";
  inp.style.padding = "0.2em";
  inp.style.fontFamily = "Patrick Hand, cursive";
});

const calcFeedback = document.createElement("span");
calcFeedback.style.marginLeft = "1em";
calcFeedback.style.fontSize = "0.95em";

calcContainer.appendChild(document.createTextNode("Rechnung: "));
calcContainer.appendChild(inputKids);
calcContainer.appendChild(document.createTextNode(" × "));
calcContainer.appendChild(inputEuro);
calcContainer.appendChild(document.createTextNode(" = "));
calcContainer.appendChild(inputResult);

languageHelper.appendChild(calcContainer);
languageHelper.appendChild(calcFeedback);

function checkCalculation() {
  const rows = 10;
  const cols = 10;
  const field = document.getElementById("dotField");
  if (!field) return;

  const kids = Array.from(field.children).filter(el => el.textContent === "👦");
  const kidCount = kids.length;

  const euros = kids.map(k => {
    const index = Array.from(field.children).indexOf(k);
    const row = Math.floor(index / (cols + 1));
    return Array.from({ length: cols }, (_, i) => field.children[row * (cols + 1) + 1 + i])
      .filter(dot => dot.textContent === "€").length;
  });

  const euroAmount = euros.length > 0 ? euros[0] : 0;
  const total = euroAmount * kidCount;

  const a = parseInt(inputKids.value, 10);
  const b = parseInt(inputEuro.value, 10);
  const c = parseInt(inputResult.value, 10);

  if (a === kidCount && b === euroAmount && c === total) {
    calcFeedback.textContent = "✅ Richtig gerechnet!";
    calcFeedback.style.color = "#28a745";
  } else if (b === kidCount && a === euroAmount && c === total) {
    calcFeedback.textContent = "ℹ️ Das Ergebnis stimmt, aber die Zahlen sind vertauscht?";
    calcFeedback.style.color = "#ffc107";
  } else if ((a !== kidCount || b !== euroAmount) && c === total) {
    calcFeedback.innerHTML = `❌ Das Ergebnis passt, aber einer der Zahlen ist falsch.<br><br><strong>Denkhilfen zur Rechnung:</strong><ul style="margin-top:0.5em; padding-left:1em;"><li>Wie viele Kinder hast du im Punktebild eingefügt?</li><li>Wie viele Euro zahlt jedes Kind?</li><li>Was gehört ins erste Kästchen? Was ins zweite?</li><li>Was rechnest du mit den beiden Zahlen aus?</li></ul>`;
    calcFeedback.style.color = "#dc3545";
  } else {
    calcFeedback.textContent = "❌ Überprüfe deine Zahlen. Schau in die Hilfe.";
    calcFeedback.style.color = "#dc3545";
  }
}

[inputKids, inputEuro, inputResult].forEach(input => {
  input.addEventListener("input", checkCalculation);
});

// Hilfe-Button zur Rechnung
const calcHelpToggle = document.createElement("button");
calcHelpToggle.textContent = "❓ Hilfe zur Rechnung anzeigen";
calcHelpToggle.style.marginTop = "1em";
calcHelpToggle.style.background = "#eee";
calcHelpToggle.style.border = "none";
calcHelpToggle.style.borderRadius = "0.4em";
calcHelpToggle.style.padding = "0.3em 0.6em";
calcHelpToggle.style.cursor = "pointer";
calcHelpToggle.style.fontFamily = "Arial, sans-serif";
calcHelpToggle.style.fontSize = "0.9em";
calcHelpToggle.style.color = "#555";
calcHelpToggle.style.textAlign = "left";

const calcHintText = document.createElement("div");
calcHintText.style.marginTop = "0.8em";
calcHintText.style.fontSize = "0.95em";
calcHintText.style.color = "#555";
calcHintText.style.display = "none";
calcHintText.innerHTML = `<p>Denkhilfen zur Rechnung:</p>
<ul style="margin-left: 1em; padding-left: 1em; list-style-type: disc;">
  <li>Wie viele Kinder hast du im Punktebild eingefügt?</li>
  <li>Wie viele Euro zahlt jedes Kind?</li>
  <li>Was gehört ins erste Kästchen? Was ins zweite?</li>
  <li>Was rechnest du mit den beiden Zahlen aus?</li>
</ul>`;

calcHelpToggle.onclick = () => {
  const isVisible = calcHintText.style.display === "block";
  calcHintText.style.display = isVisible ? "none" : "block";
  calcHelpToggle.textContent = isVisible ? "❓ Hilfe zur Rechnung anzeigen" : "❌ Hilfe zur Rechnung ausblenden";
};

languageHelper.appendChild(calcHelpToggle);
languageHelper.appendChild(calcHintText);





layoutContainer.appendChild(languageHelper);

showLanguageBtn.onclick = () => {
  languageHelper.style.display = "block";
  showLanguageBtn.style.display = "none";
};


const numberWords = {
  "null": 0,
  "eins": 1,
  "eine": 1,
  "ein": 1,
  "zwei": 2,
  "drei": 3,
  "vier": 4,
  "fünf": 5,
  "sechs": 6,
  "sieben": 7,
  "acht": 8,
  "neun": 9,
  "zehn": 10,
  "elf": 11,
  "zwölf": 12,
  "dreizehn": 13,
  "vierzehn": 14,
  "fünfzehn": 15,
  "sechzehn": 16,
  "siebzehn": 17,
  "achtzehn": 18,
  "neunzehn": 19,
  "zwanzig": 20
};

function parseNumber(text) {
  const digitMatch = text.match(/\d+/);
  if (digitMatch) return parseInt(digitMatch[0]);
  for (const [word, value] of Object.entries(numberWords)) {
    if (text.includes(word)) return value;
  }
  return null;
}

function checkFreeSentence() {
  const kids = Array.from({ length: rows }, (_, row) => field.children[row * (cols + 1)]).filter(el => el.textContent === "👦");
  const kidCount = kids.length;
  if (kidCount === 0) {
    feedback.textContent = "❌ Es wurden noch keine Kinder eingefügt.";
    return;
  }
  const euroCounts = kids.map(k => {
    const rowIndex = Array.from(field.children).indexOf(k) / (cols + 1);
    return Array.from({ length: cols }, (_, i) => field.children[(cols + 1) * rowIndex + 1 + i])
      .filter(dot => dot.textContent === "€").length;
  });
  const total = euroCounts.reduce((sum, val) => sum + val, 0);
  const allSame = euroCounts.every(e => e === euroCounts[0]);

  const sentence = input.value.toLowerCase();
  const number = parseNumber(sentence);

  if ((sentence.includes("pro kind") || sentence.includes("je kind")) && sentence.includes("euro")  && allSame && number === euroCounts[0]) {
    feedback.textContent = "✅ Gute Formulierung ";
  } else if ((sentence.includes("jedes kind") || sentence.includes("je kind")) && sentence.includes("euro") && allSame && number === euroCounts[0]) {
    feedback.textContent = "✅ Richtig ";
  } else if ((sentence.includes("insgesamt") || sentence.includes("zusammen")) && sentence.includes("euro")  && number === total) {
    feedback.textContent = "✅ Ja ";
  } else {
    feedback.textContent = "❌ Passt nicht zu deinem Punktebild. Probiere es noch einmal.";
  }
}

input.addEventListener("input", checkFreeSentence);

const originalUpdate = updateOutput;
updateOutput = function() {
  originalUpdate();
  checkFreeSentence();
};

  
      function updateOutput() {
        output.innerHTML = "";
        for (let row = 0; row < rows; row++) {
          const label = field.children[row * (cols + 1)];
          if (label.textContent === "👦") {
            const euroCount = Array.from({ length: cols }, (_, i) =>
              field.children[row * (cols + 1) + 1 + i]
            ).filter(dot => dot.textContent === "€").length;
            if (euroCount > 0) {
              const p = document.createElement("p");
              p.textContent = `Das Kind zahlt ${euroCount} Euro${euroCount > 1 ? "s" : ""}.`;
              output.appendChild(p);
            }
        }
    });
    
  