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

const CUSTOMER_STORAGE_KEY = "pricingD2D.savedCustomers";

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

function getSavedCustomers(){

    try{
        const saved = JSON.parse(
            localStorage.getItem(CUSTOMER_STORAGE_KEY) || "[]"
        );

        return Array.isArray(saved)
            ? saved.map(normalizeCustomer)
            : [];
    }catch{
        return [];
    }

}

function storeSavedCustomers(customers){

    localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(customers.slice(0, 50))
    );

}

function normalizeCustomer(customer){

    return {
        id: customer.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: customer.name || "",
        number: customer.number || "",
        address: customer.address || "",
        notes: customer.notes || "",
        jobs: Array.isArray(customer.jobs) ? customer.jobs : [],
        createdAt: customer.createdAt || customer.updatedAt || new Date().toISOString(),
        updatedAt: customer.updatedAt || new Date().toISOString()
    };

}

function getCustomerForm(){

    return {
        name: $("customer-name").value.trim(),
        number: $("customer-number").value.trim(),
        address: $("customer-address").value.trim(),
        notes: $("customer-notes").value.trim()
    };

}

function fillCustomerForm(customer){

    $("customer-name").value = customer.name || "";
    $("customer-number").value = customer.number || "";
    $("customer-address").value = customer.address || "";
    $("customer-notes").value = customer.notes || "";
    showView("quote");
    openQuoteModal();

}

function formatMoney(value){

    return `$${Number(value || 0).toFixed(2)}`;

}

function escapeHTML(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

function formatDate(value){

    if(!value) return "Not set";

    return new Date(value).toLocaleDateString(undefined, {
        year:"numeric",
        month:"short",
        day:"numeric"
    });

}

function getCustomerSearchText(customer){

    return [
        customer.name,
        customer.number,
        customer.address,
        customer.notes,
        ...customer.jobs.map(job => [
            job.status,
            job.paymentType,
            job.paymentLabel,
            job.notes,
            job.description,
            job.total
        ].join(" "))
    ].join(" ").toLowerCase();

}

function getJobSummary(){

    const services = [];

    if(state.windowsEnabled){
        services.push({
            name:"Window Cleaning",
            details:[
                `${$("window-count").value || 0} windows`,
                state.windowHouse === "multi" ? "Multiple stories" : "Bungalow",
                `${state.outside ? "Outside" : ""}${state.inside ? " / Inside" : ""}`.trim()
            ].filter(Boolean)
        });
    }

    if(state.guttersEnabled){
        const sizeLabels = {
            1:"Small",
            2:"Medium",
            3:"Large",
            4:"Huge"
        };

        services.push({
            name:"Gutter Cleaning",
            details:[
                state.gutterHouse === "multi" ? "Multiple stories" : "Bungalow",
                `Complexity ${$("gutter-complexity").value}/10`,
                `${sizeLabels[state.gutterSize]} house`
            ]
        });
    }

    return services;

}

function upsertCustomer(customer, job = null){

    const customers = getSavedCustomers();
    const existingIndex = customers.findIndex(saved =>
        (customer.number && saved.number === customer.number) ||
        (customer.address && saved.address === customer.address)
    );

    const existing = existingIndex >= 0
        ? customers[existingIndex]
        : null;

    const savedCustomer = normalizeCustomer({
        ...(existing || {}),
        ...customer,
        id: existing ? existing.id : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        jobs: existing ? existing.jobs : [],
        updatedAt: new Date().toISOString()
    });

    if(job){
        savedCustomer.jobs = [job, ...savedCustomer.jobs].slice(0, 100);
    }

    if(existingIndex >= 0){
        customers.splice(existingIndex, 1);
    }

    storeSavedCustomers([savedCustomer, ...customers]);
    renderRecords(savedCustomer.id);

    return savedCustomer;

}

function updateCustomerProfile(customerId, updates){

    const customers = getSavedCustomers();
    const index = customers.findIndex(customer => customer.id === customerId);

    if(index < 0) return;

    customers[index] = normalizeCustomer({
        ...customers[index],
        ...updates,
        updatedAt: new Date().toISOString()
    });

    storeSavedCustomers(customers);
    renderRecords(customerId);

}

function createCustomerProfile(){

    const customers = getSavedCustomers();
    const customer = normalizeCustomer({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: "",
        number: "",
        address: "",
        notes: "",
        jobs: []
    });

    storeSavedCustomers([customer, ...customers]);
    $("records-search").value = "";
    renderRecords(customer.id, true);

}

function removeCustomerJob(customerId, jobId){

    const customers = getSavedCustomers();
    const customer = customers.find(saved => saved.id === customerId);

    if(!customer) return;

    customer.jobs = customer.jobs.filter(job => job.id !== jobId);
    customer.updatedAt = new Date().toISOString();

    storeSavedCustomers(customers);
    renderRecords(customerId);

}

function showView(view){

    const isRecords = view === "records";

    $("quote-view").classList.toggle("active-view", !isRecords);
    $("records-view").classList.toggle("active-view", isRecords);
    $("show-quote-view").classList.toggle("active", !isRecords);
    $("show-records-view").classList.toggle("active", isRecords);
    document.body.classList.toggle("records-open", isRecords);

    if(isRecords){
        renderRecords();
    }

}

function renderRecords(selectedId = null, editingId = null){

    const list = $("records-list");
    const detail = $("record-detail");
    const query = $("records-search").value.trim().toLowerCase();

    const customers = getSavedCustomers();
    const filtered = customers.filter(customer =>
        getCustomerSearchText(customer).includes(query)
    );

    $("records-count").textContent =
        `${customers.length} saved customer${customers.length !== 1 ? "s" : ""}`;

    list.innerHTML = "";

    if(!filtered.length){
        list.innerHTML = `
            <div class="empty-record">
                ${query ? "No customer records match that search." : "No customers saved yet."}
            </div>
        `;
        detail.innerHTML = `
            <div class="empty-record">
                Generate a quote, save a profile, or tap + to add a customer.
            </div>
        `;
        return;
    }

    const activeCustomer =
        filtered.find(customer => customer.id === selectedId) || filtered[0];

    filtered.forEach(customer => {

        const latestJob = customer.jobs[0];
        const button = document.createElement("button");
        button.type = "button";
        button.className = `record-list-item${customer.id === activeCustomer.id ? " active" : ""}`;
        button.innerHTML = `
            <div>
                <strong>${escapeHTML(customer.name || "Unnamed customer")}</strong>
                <span>${escapeHTML(customer.address || "No address saved")}</span>
            </div>
            <small>
                ${customer.jobs.length} job${customer.jobs.length !== 1 ? "s" : ""}
                ${latestJob ? ` - ${formatMoney(latestJob.total)}` : ""}
            </small>
        `;
        button.addEventListener("click", () => renderRecordDetail(customer.id));
        list.appendChild(button);

    });

    renderRecordDetail(activeCustomer.id, editingId === activeCustomer.id);

}

function renderRecordDetail(customerId, editing = false){

    const customers = getSavedCustomers();
    const customer = customers.find(saved => saved.id === customerId);
    const detail = $("record-detail");

    if(!customer){
        detail.innerHTML = `<div class="empty-record">Select a customer record.</div>`;
        return;
    }

    document.querySelectorAll(".record-list-item")
    .forEach(item => item.classList.remove("active"));

    const listItems = Array.from(document.querySelectorAll(".record-list-item"));
    const selectedIndex = getSavedCustomers()
        .filter(saved => getCustomerSearchText(saved).includes($("records-search").value.trim().toLowerCase()))
        .findIndex(saved => saved.id === customerId);

    if(listItems[selectedIndex]){
        listItems[selectedIndex].classList.add("active");
    }

    const totalQuoted = customer.jobs.reduce(
        (sum, job) => sum + Number(job.total || 0),
        0
    );

    detail.innerHTML = `
        <div class="record-toolbar">
            <div>
                <h3>${escapeHTML(customer.name || "Unnamed customer")}</h3>
                <p>${escapeHTML(customer.address || "No address saved")}</p>
            </div>

            <div class="record-actions">
                <button type="button" class="icon-button primary-icon-button" id="start-record-job" aria-label="Start new job" title="Start new job">
                    +
                </button>
                ${editing ? "" : `
                    <button type="button" class="edit-profile-button" id="edit-record-customer">
                        Edit
                    </button>
                `}
                <button type="button" class="icon-button danger-button" id="delete-record-customer" aria-label="Delete customer" title="Delete customer">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>

        <div class="record-stats">
            <div>
                <span>Total quoted</span>
                <strong>${formatMoney(totalQuoted)}</strong>
            </div>
            <div>
                <span>Jobs / quotes</span>
                <strong>${customer.jobs.length}</strong>
            </div>
            <div>
                <span>Updated</span>
                <strong>${formatDate(customer.updatedAt)}</strong>
            </div>
        </div>

        <section class="profile-summary${editing ? " hidden-panel" : ""}" id="profile-summary">
            <div>
                <span>Phone</span>
                <strong>${escapeHTML(customer.number || "No phone saved")}</strong>
            </div>
            <div>
                <span>Address</span>
                <strong>${escapeHTML(customer.address || "No address saved")}</strong>
            </div>
            <div class="profile-notes">
                <span>Profile notes</span>
                <p>${escapeHTML(customer.notes || "No profile notes yet.")}</p>
            </div>
        </section>

        <form class="profile-editor${editing ? "" : " hidden-panel"}" id="profile-editor">
            <div class="editor-grid">
                <label>
                    Name
                    <input type="text" id="edit-customer-name" value="${escapeHTML(customer.name)}" autocomplete="name">
                </label>

                <label>
                    Phone
                    <input type="tel" id="edit-customer-number" value="${escapeHTML(customer.number)}" autocomplete="tel" inputmode="tel">
                </label>
            </div>

            <label>
                Address
                <input type="text" id="edit-customer-address" value="${escapeHTML(customer.address)}" autocomplete="street-address">
            </label>

            <label>
                Profile notes
                <textarea id="edit-customer-notes" rows="4">${escapeHTML(customer.notes)}</textarea>
            </label>

            <div class="editor-actions">
                <button type="button" class="secondary-action" id="cancel-profile-edit">Cancel</button>
                <button type="submit">Save profile changes</button>
            </div>
        </form>

        <div class="record-section">
            <h4>Job History</h4>
            <div class="job-history">
                ${customer.jobs.length
                    ? customer.jobs.map(job => renderJobRecord(job, customer.id)).join("")
                    : `<div class="empty-record">No jobs saved for this customer yet.</div>`
                }
            </div>
        </div>
    `;

    $("start-record-job").addEventListener("click", () => {
        fillCustomerForm(customer);
    });

    if($("edit-record-customer")){
        $("edit-record-customer").addEventListener("click", () => {
            renderRecordDetail(customer.id, true);
        });
    }

    $("cancel-profile-edit").addEventListener("click", () => {
        renderRecordDetail(customer.id, false);
    });

    $("delete-record-customer").addEventListener("click", () => {
        if(!confirm("Delete this customer and all saved jobs?")) return;

        storeSavedCustomers(
            getSavedCustomers().filter(saved => saved.id !== customer.id)
        );
        renderRecords();
    });

    $("profile-editor").addEventListener("submit", e => {
        e.preventDefault();
        updateCustomerProfile(customer.id, {
            name: $("edit-customer-name").value.trim(),
            number: $("edit-customer-number").value.trim(),
            address: $("edit-customer-address").value.trim(),
            notes: $("edit-customer-notes").value.trim()
        });
        renderRecordDetail(customer.id, false);
    });

    document.querySelectorAll("[data-delete-job]")
    .forEach(button => {
        button.addEventListener("click", () => {
            if(!confirm("Delete this saved job from the customer history?")) return;

            removeCustomerJob(customer.id, button.dataset.deleteJob);
        });
    });

}

function renderJobRecord(job, customerId){

    return `
        <article class="job-record">
            <div class="job-record-top">
                <div>
                    <strong>${formatMoney(job.total)}</strong>
                    <span>${formatDate(job.createdAt)}</span>
                </div>
                <div class="job-row-actions">
                    <span class="status-pill">${escapeHTML(job.status)}</span>
                    <button type="button" class="icon-button danger-button" data-delete-job="${escapeHTML(job.id)}" aria-label="Delete job" title="Delete job">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>

            <div class="job-meta-grid">
                <div>
                    <span>Payment</span>
                    <strong>${escapeHTML(job.paymentLabel)}</strong>
                </div>
                <div>
                    <span>Subtotal</span>
                    <strong>${formatMoney(job.subtotal)}</strong>
                </div>
                <div>
                    <span>GST / QST</span>
                    <strong>${job.taxesWaived ? "Waived" : formatMoney(job.taxes)}</strong>
                </div>
                <div>
                    <span>Scheduled</span>
                    <strong>${escapeHTML(job.scheduledDate || "Not set")}</strong>
                </div>
            </div>

            <div class="job-services">
                ${job.services.length
                    ? job.services.map(service => `
                        <div>
                            <strong>${escapeHTML(service.name)}</strong>
                            <span>${escapeHTML(service.details.join(" - "))}</span>
                        </div>
                    `).join("")
                    : "<span>No service selected</span>"
                }
            </div>

            <p>${escapeHTML(job.notes || "No job notes.")}</p>

            <details class="job-output-detail">
                <summary>Generated job text</summary>
                <pre>${escapeHTML(job.output || "")}</pre>
            </details>
        </article>
    `;

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
        ? `Easy roof access - +$${value * 11}`
        : value <= 6
        ? `Moderate roof difficulty - +$${value * 11}`
        : `High difficulty roof - +$${value * 11}`;

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

$("show-quote-view")
.addEventListener("click", () => {
    showView("quote");
});

$("show-records-view")
.addEventListener("click", () => {
    showView("records");
});

$("back-to-quote")
.addEventListener("click", () => {
    showView("quote");
});

$("records-search")
.addEventListener("input", () => {
    renderRecords();
});

$("add-customer-profile")
.addEventListener("click", createCustomerProfile);

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

document.addEventListener("dblclick", e => {

    if(
        e.target instanceof Element &&
        e.target.closest("button, .option, .switch, input, textarea")
    ){
        e.preventDefault();
    }

}, { passive:false });

$("open-saved-customers")
.addEventListener("click", () => {
    closeQuoteModal();
    showView("records");
});

$("save-customer")
.addEventListener("click", () => {

    const customer = getCustomerForm();

    if(!customer.name && !customer.number && !customer.address){
        setButtonText("save-customer", "Add Info First", "Save Profile", 1600);
        return;
    }

    upsertCustomer(customer);
    setButtonText("save-customer", "Saved", "Save Profile", 1400);

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

    const savedCustomer = upsertCustomer(
        {
            name: name === "N/A" ? "" : name,
            number: number === "N/A" ? "" : number,
            address: address === "N/A" ? "" : address,
            notes: notes === "None" ? "" : notes
        },
        {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            createdAt: new Date().toISOString(),
            status: selectedStatus,
            scheduledDate: selectedStatus === "schedule" ? date : "",
            paymentType,
            paymentLabel,
            taxesWaived,
            subtotal: quoteTotals.subtotal,
            gst: quoteTotals.gst,
            qst: quoteTotals.qst,
            taxes: quoteTotals.taxes,
            total: quoteTotals.total,
            services: getJobSummary(),
            description: jobDescription.trim(),
            notes: notes === "None" ? "" : notes,
            output
        }
    );

    const copied = await copyToClipboard(output);

    setButtonText(
        "generate-job",
        copied ? "Generated + Copied" : "Generated",
        "Generate Job Text"
    );

    setButtonText(
        "save-customer",
        savedCustomer.jobs.length > 1 ? "Case Added" : "Case Saved",
        "Save Profile",
        1400
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
