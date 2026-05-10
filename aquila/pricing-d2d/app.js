const $ = id => document.getElementById(id);

const PRICING = {
    windows:{
        bungalow:{ outside:8, inside:12 },
        multi:{ outside:10, inside:14 }
    },

    gutters:{
        bungalowBase:65,
        multiStoryBase:95,
        complexityMultiplier:11,

        sizeMultipliers:{
            1:1,
            2:1.25,
            3:1.75,
            4:2.25
        }
    },

    fees:{
        transportation:35,
        GST:5,
        QST:9.975
    }
};

let paymentType = "cash";
let quoteTotals = {
    subtotal: 0,
    gst: 0,
    qst: 0,
    taxes: 0,
    total: 0,
    taxesWaived: true
};

const state = {
    windowHouse:"bungalow",
    gutterHouse:"bungalow",
    gutterSize:1,
    outside:true,
    inside:false,
    windowsEnabled: false,
    guttersEnabled: false
};

state.windowsEnabled = false;
state.guttersEnabled = false;

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

function setButtonText(id, text, resetText, delay = 1800){

    const btn = $(id);
    btn.textContent = text;

    if(resetText){
        setTimeout(() => {
            btn.textContent = resetText;
        }, delay);
    }

}

function copyToClipboard(text){

    if(!navigator.clipboard || !text){
        return Promise.resolve(false);
    }

    return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => false);

}

/* =========================
   SERVICE TOGGLES
========================= */

$("windows-toggle")
.addEventListener("change", e => {

    state.windowsEnabled =
    e.target.checked;

    calculate();

});

$("gutters-toggle")
.addEventListener("change", e => {

    state.guttersEnabled =
    e.target.checked;

    calculate();

});

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
        ? `Easy roof access • +$${value * 11}`
        : value <= 6
        ? `Moderate roof difficulty • +$${value * 11}`
        : `High difficulty roof • +$${value * 11}`;

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

    let subtotal = 0;
    let services = 0;
    let breakdown = "";

    const windowsEnabled =
    state.windowsEnabled

    const guttersEnabled =
    state.guttersEnabled;

    /* WINDOWS */

    if(windowsEnabled){

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

        subtotal += price;

        breakdown += `
            <div class="breakdown-item">
                <span>Window Cleaning</span>
                <span>$${price.toFixed(0)}</span>
            </div>
        `;
    }

    /* GUTTERS */

    if(guttersEnabled){

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

        subtotal += price;

        breakdown += `
            <div class="breakdown-item">
                <span>Gutter Cleaning</span>
                <span>$${price.toFixed(0)}</span>
            </div>
        `;
    }

    /* TRANSPORTATION */

let transportationFee =
PRICING.fees.transportation;

if(

    state.guttersEnabled

    ||

    (
        state.windowsEnabled &&
        state.windowHouse === "multi"
    )

){
    transportationFee += 15;
}

subtotal += transportationFee;

breakdown += `
    <div class="breakdown-item">

        <span>
            Transportation
            ${
                transportationFee > 35
                ? "(Large Ladder Equipment)"
                : ""
            }
        </span>

        <span>
            $${transportationFee.toFixed(0)}
        </span>

    </div>
`;

    /* TAXES */

    const gst =
    subtotal * (PRICING.fees.GST / 100);

    const qst =
    subtotal * (PRICING.fees.QST / 100);

    const taxes =
    gst + qst;

    const taxesWaived =
    paymentType === "cash";

    const total =
    taxesWaived
    ? subtotal
    : subtotal + taxes;

    quoteTotals = {
        subtotal,
        gst,
        qst,
        taxes,
        total,
        taxesWaived
    };

    /* TAX DISPLAY */

    $("tax-summary").innerHTML = `

        <div class="breakdown-item">

            <span>
                GST / TPS (${PRICING.fees.GST}%)
            </span>

            <span class="${
                taxesWaived ? "tax-waived" : ""
            }">
                $${gst.toFixed(2)}
            </span>

        </div>

        <div class="breakdown-item">

            <span>
                QST / TVQ (${PRICING.fees.QST}%)
            </span>

            <span class="${
                taxesWaived ? "tax-waived" : ""
            }">
                $${qst.toFixed(2)}
            </span>

        </div>

    `;

    $("total-price").textContent =
        `$${total.toFixed(2)}`;

    $("mobile-total").textContent =
        `$${total.toFixed(2)}`;

    $("service-count").textContent =
        `${services} Service${services !== 1 ? "s" : ""}`;

    $("breakdown").innerHTML =
        breakdown;

}

calculate();

/* =========================
   QUOTE MODAL
========================= */

let selectedStatus = "schedule";

const modal = $("quote-modal");

function openQuoteModal(){

    modal.classList.remove("hidden");
    $("customer-name").focus();

}

function closeQuoteModal(){

    modal.classList.add("hidden");

}

$("confirm-quote")
.addEventListener("click", openQuoteModal);

$("mobile-confirm-quote")
.addEventListener("click", openQuoteModal);

$("close-modal")
.addEventListener("click", closeQuoteModal);

modal.addEventListener("click", e => {

    if(e.target === modal){
        closeQuoteModal();
    }

});

document.addEventListener("keydown", e => {

    if(e.key === "Escape"){
        closeQuoteModal();
    }

});

document.querySelectorAll(".quick-stepper button")
.forEach(button => {

    button.addEventListener("click", () => {

        const input = $(button.dataset.target);
        const step = Number(button.dataset.step);
        const min = Number(input.min || 0);
        const current = Number(input.value || 0);

        input.value = Math.max(min, current + step);
        input.dispatchEvent(new Event("input", { bubbles:true }));

    });

});

/* =========================
   STATUS OPTIONS
========================= */

setupOptions(".status-option", value => {

    selectedStatus = value;

    $("date-field").style.display =
        value === "schedule"
        ? "block"
        : "none";

});

/* =========================
   PAYMENT OPTIONS
========================= */

setupOptions(".payment-option", value => {

    paymentType = value;

    calculate();

});

/* =========================
   GENERATE JOB TEXT
========================= */

$("generate-job")
.addEventListener("click", async () => {

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

    let jobDescription = "";

    if(state.windowsEnabled){

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

    if(state.guttersEnabled){

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

    const taxesWaived =
    quoteTotals.taxesWaived;

    const paymentLabel =
    taxesWaived
    ? "Cash (Taxes Waived)"
    : "Card / E-Transfer";

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

 -=- PAYMENT INFO -=-

Payment Type: ${paymentLabel}

GST / TPS:
${
taxesWaived
? `~~$${quoteTotals.gst.toFixed(2)}~~`
: `$${quoteTotals.gst.toFixed(2)}`
}

QST / TVQ:
${
taxesWaived
? `~~$${quoteTotals.qst.toFixed(2)}~~`
: `$${quoteTotals.qst.toFixed(2)}`
}

 -=- TOTAL -=-

${$("total-price").textContent}

 -=- NOTES -=-

${notes}
`;

    $("job-output").value = output;

    const copied = await copyToClipboard(output);

    setButtonText(
        "generate-job",
        copied ? "Generated + Copied" : "Generated",
        "Generate Job Text"
    );

});

/* =========================
   COPY JOB TEXT
========================= */

$("copy-job")
.addEventListener("click", async () => {

    const text =
    $("job-output").value;

    if(!text) return;

    const copied = await copyToClipboard(text);

    setButtonText(
        "copy-job",
        copied ? "Copied!" : "Copy unavailable",
        "Copy Job Text"
    );

});
