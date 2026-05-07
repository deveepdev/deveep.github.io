const $ = id => document.getElementById(id);

const PRICING = {
    windows:{
        bungalow:{ outside:8, inside:12 },
        multi:{ outside:10, inside:14 }
    },

    gutters:{
        bungalowBase:65,
        multiStoryBase:125,
        complexityMultiplier:8,

        sizeMultipliers:{
            1:1,
            2:1.35,
            3:1.90,
            4:2.65
        }
    }
};

const state = {
    windowHouse:"bungalow",
    gutterHouse:"bungalow",
    gutterSize:1,
    outside:true,
    inside:false
};

/* =========================
   OPTION HELPERS
========================= */

function setupOptions(selector, callback){

    const buttons = document.querySelectorAll(selector);

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            buttons.forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");

            callback(btn.dataset.value);

            calculate();

        });

    });

}

function setupToggle(id, key){

    $(id).addEventListener("click", () => {

        $(id).classList.toggle("active");

        state[key] = !state[key];

        calculate();

    });

}

/* =========================
   WINDOW OPTIONS
========================= */

setupOptions(".house-option", value => {
    state.windowHouse = value;
});

setupOptions(".gutter-house", value => {
    state.gutterHouse = value;
});

setupOptions(".size-option", value => {
    state.gutterSize = Number(value);
});

setupToggle("outside-toggle","outside");
setupToggle("inside-toggle","inside");

/* =========================
   GUTTER COMPLEXITY
========================= */

$("gutter-complexity")
.addEventListener("input", e => {

    const value = Number(e.target.value);

    $("complexity-label").textContent = value;

    $("complexity-description").textContent =
        value <= 3
        ? "Easy to stand on roof and simple design"
        : value <= 6
        ? "Harder to stand on roof or more complex design"
        : "Very hard to stand on roof or extremely complex design";

    calculate();

});

/* =========================
   GLOBAL INPUT LISTENERS
========================= */

document.querySelectorAll("input")
.forEach(input => {

    input.addEventListener("input", calculate);
    input.addEventListener("change", calculate);

});

/* =========================
   CALCULATOR
========================= */

function calculate(){

    let total = 0;
    let services = 0;
    let breakdown = "";

    /* WINDOWS */

    if($("windows-toggle").checked){

        services++;

        const count =
        Number($("window-count").value);

        const pricing =
        PRICING.windows[state.windowHouse];

        let price = 0;

        if(state.outside)
            price += count * pricing.outside;

        if(state.inside)
            price += count * pricing.inside;

        total += price;

        breakdown += `
            <div class="breakdown-item">
                <span>Window Cleaning</span>
                <span>$${price.toFixed(0)}</span>
            </div>
        `;
    }

    /* GUTTERS */

    if($("gutters-toggle").checked){

        services++;

        const complexity =
        Number($("gutter-complexity").value);

        let price =
            state.gutterHouse === "bungalow"
            ? PRICING.gutters.bungalowBase
            : PRICING.gutters.multiStoryBase;

        price +=
            complexity *
            PRICING.gutters.complexityMultiplier;

        price *=
            PRICING.gutters
            .sizeMultipliers[state.gutterSize];

        total += price;

        breakdown += `
            <div class="breakdown-item">
                <span>Gutter Cleaning</span>
                <span>$${price.toFixed(0)}</span>
            </div>
        `;
    }

    $("total-price").textContent =
        `$${total.toFixed(0)}`;

    $("service-count").textContent =
        `${services} Service${services !== 1 ? "s" : ""}`;

    $("breakdown").innerHTML = breakdown;

}

calculate();

/* =========================
   QUOTE MODAL
========================= */

let selectedStatus = "schedule";

const modal = $("quote-modal");

$("confirm-quote")
.addEventListener("click", () => {

    modal.classList.remove("hidden");

});

$("close-modal")
.addEventListener("click", () => {

    modal.classList.add("hidden");

});

/* STATUS OPTIONS */

setupOptions(".status-option", value => {

    selectedStatus = value;

    $("date-field").style.display =
        value === "schedule"
        ? "block"
        : "none";

});

/* =========================
   GENERATE JOB TEXT
========================= */

$("generate-job")
.addEventListener("click", () => {

    const name =
    $("customer-name").value || "N/A";

    const number =
    $("customer-number").value || "N/A";

    const address =
    $("customer-address").value || "N/A";

    const notes =
    $("customer-notes").value || "None";

    const date =
    $("schedule-date").value || "Not Set";

    /* BUILD JOB DESCRIPTION */

    let jobDescription = "";

    if($("windows-toggle").checked){

        const count =
        $("window-count").value;

        jobDescription +=
`Window Cleaning
- ${count} windows
- ${state.windowHouse}
- ${state.outside ? "Outside " : ""}
${state.inside ? "/ Inside" : ""}
`;
    }

    if($("gutters-toggle").checked){

        const complexity =
        $("gutter-complexity").value;

        const sizeLabels = {
            1:"Small",
            2:"Medium",
            3:"Large",
            4:"Huge"
        };

        jobDescription +=
`Gutter Cleaning
- ${state.gutterHouse}
- Complexity ${complexity}/10
- ${sizeLabels[state.gutterSize]} house
`;
    }

    const total =
    $("total-price").textContent;

    const output =
`
 -=- Customer's info -=-
  Name: ${name}
  Phone: ${number}
  Address: ${address}

Status: ${selectedStatus}${
selectedStatus === "schedule"
? ` | Scheduled Date: ${date}`
: ""
}

  -=- JOB DESCRIPTION -=-
${jobDescription}

   -===-
  TOTAL: ${total}
   -===-

  -=- NOTES -=-
${notes}
`;

    $("job-output").value = output;

});

/* =========================
   COPY JOB TEXT
========================= */

$("copy-job")
.addEventListener("click", async () => {

    const text =
    $("job-output").value;

    if(!text) return;

    await navigator.clipboard.writeText(text);

    const btn = $("copy-job");

    btn.textContent = "Copied!";

    setTimeout(() => {

        btn.textContent = "Copy Job Text";

    }, 1800);

});