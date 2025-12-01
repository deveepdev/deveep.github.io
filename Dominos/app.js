// DOMINOS INSIDER LEARNING APP (QUEBEC, CANADA)

const query = document.querySelector(".query")
const selected = document.querySelector(".selected")
const solution = document.querySelector(".solution")

let score = 0

const TOPPINGS_INVERTED_LIST = {
    "American Cheese": "A",
    "Beef": "B",
    "Cheese (Mozzarella)": "C",
    "Cheddar Cheese": "E",
    "Feta Cheese": "Feta",
    "Green Peppers": "G",
    "Ham": "H",
    "Jalapeno Peppers": "J",
    "Bacon": "K",
    "Philly Steak": "St",
    "Mushrooms": "M",
    "Pineapple": "N",
    "Onions": "O",
    "Pepperoni": "P",
    "Chicken": "D",
    "Black Olives": "R",
    "Italian Sausage": "S",
    "Tomato": "T",
    "Green Olives": "V",
    "Provolone Cheese": "Prov",
    "Brooklyn Pepperoni": "PL",
    "Banana Peppers": "Z",
    "Roasted Red Peppers": "Rp",
    "Spinach": "Sp",
    "Parmesan Asiago": "Parasiag",
    "Cheddar/Mozzarella Mix": "MIX",
}

const TOPPINGS = {
    "Ca": "American Cheese",
    "B": "Beef",
    "C": "Cheese (Mozzarella)",
    "E": "Cheddar Cheese",
    "Feta": "Feta Cheese",
    "G": "Green Peppers",
    "H": "Ham",
    "J": "Jalapeno Peppers",
    "K": "Bacon",
    "St": "Philly Steak",
    "M": "Mushrooms",
    "N": "Pineapple",
    "O": "Onions",
    "P": "Pepperoni",
    "D": "Chicken",
    "R": "Black Olives",
    "S": "Italian Sausage",
    "T": "Tomato",
    "V": "Green Olives",
    "Prov": "Provolone Cheese",
    "PL": "Brooklyn Pepperoni",
    "Z": "Banana Peppers",
    "Rp": "Roasted Red Peppers",
    "Sp": "Spinach",
    "Parasiag": "Parmesan Asiago",
    "MIX": "Cheddar/Mozzarella Mix",
}

const TOPPINGS_LIST = [
    ["PL", "Brooklyn Pepperoni"],
    ["B", "Beef"],
    ["H", "Ham"],
    ["K", "Bacon"],
    ["St", "Philly Steak"],
    ["P", "Pepperoni"],
    ["D", "Chicken"],
    ["S", "Italian Sausage"],
    ["Parasiag", "Parmesan Asiago"],
    ["C", "Cheese (Mozzarella)"],
    ["E", "Cheddar Cheese"],
    ["Feta", "Feta Cheese"],
    // provolone also "W"
    ["Prov", "Provolone Cheese"],
    ["Ca", "American Cheese"],
    ["MIX", "Cheddar/Mozzarella Mix"],
    ["G", "Green Peppers"],
    ["J", "Jalapeno Peppers"],
    ["M", "Mushrooms"],
    ["N", "Pineapple"],
    ["O", "Onions"],
    ["R", "Black Olives"],
    ["T", "Tomato"],
    ["V", "Green Olives"],
    ["Z", "Banana Peppers"],
    ["Rp", "Roasted Red Peppers"],
    ["Sp", "Spinach"],
]

const TOPPINGS_LIST_MEATS = [
    ["B", "Beef"],
    ["H", "Ham"],
    ["K", "Bacon"],
    ["St", "Philly Steak"],
    ["P", "Pepperoni"],
    ["D", "Chicken"],
    ["S", "Italian Sausage"],
    ["PL", "Brooklyn Pepperoni"],
]

const TOPPINGS_LIST_VEGETABLES = [
    ["G", "Green Peppers"],
    ["J", "Jalapeno Peppers"],
    ["M", "Mushrooms"],
    ["N", "Pineapple"],
    ["O", "Onions"],
    ["R", "Black Olives"],
    ["T", "Tomato"],
    ["V", "Green Olives"],
    ["Z", "Banana Peppers"],
    ["Rp", "Roasted Red Peppers"],
    ["Sp", "Spinach"],
]

const TOPPINGS_LIST_CHEESES = [
    ["Ca", "American Cheese"],
    ["C", "Cheese (Mozzarella)"],
    ["E", "Cheddar Cheese"],
    ["Feta", "Feta Cheese"],
    ["Prov", "Provolone Cheese"],
    ["Parasiag", "Parmesan Asiago"],
    ["MIX", "Cheddar/Mozzarella Mix"],
]

const SAUCES = {
    "X": "Tomato Sauce",
    "XF": "Alfredo Sauce",
    "XW": "Garlic Parm Sauce",
    "RD": "Ranch Dressing",
    "XM": "Marinara Sauce",
    "Q": "BBQ Sauce",
}

const SAUCES_LIST = [
    ["X", "Tomato Sauce"],
    ["XF", "Alfredo Sauce"],
    ["XW", "Garlic Parm Sauce"],
    ["RD", "Ranch Dressing"],
    ["XM", "Marinara Sauce"],
    ["Q", "BBQ Sauce"],
]

const MODIFIERS = {
    "+": "Extra",
    "~": "Light",
    "-": "Without",
    "(WHITE)": "No Extra",
}

const CUT_TABLE_OPTIONS = {
    "**OREG**": "Oregano",
    "**RED_FLAKE**": "Red Pepper Flakes",
    "**GAR_HERB**": "Garlic Herb",
    "UNCT": "Uncut Pizza",
    "SQCT": "Square Cut",
    "PIECT": "Pie Cut",
    "WD": "Well Done",
    "LD": "Lightly Done",
    // verify
}



// quantities LRE  - Light-0, Regular-1, Extra-2 -  *** IN OZ ***
const DOUGH = {
    IN10: {
        Quantities: {
            // PIZZA CHEESE
            "C": {
                _LRE_: [2.5, 3.5, 1.5],
                _LRE_CHEESE_ONLY_: [2.5, 5.25, 1.75]
            },

            // CHEDDAR / PROVOLONE
            "E": { _LRE_: [0.5, 1, 1.5] },
            "PROV": { _LRE_: [0.5, 1, 1.5] },

            // FETA / PARM ASIAGO
            "FETA": { _LRE_: [0.5, 1, 1.5] },
            "PARASIAG": { _LRE_: [0.5, 1, 1.5] },

            // PIZZA SAUCE / MARINARA SAUCE
            "X": { _LRE_: [1.5, 3, 4.5] },
            "XM": { _LRE_: [1.5, 3, 4.5] },

            // ALFREDO / GARLIC PARM / RANCH / BBQ
            "XF": { _LRE_: [0.75, 1.5, 2.25] },
            "XW": { _LRE_: [0.75, 1.5, 2.25] },
            "RD": { _LRE_: [0.75, 1.5, 2.25] },
            "Q": { _LRE_: [0.75, 1.5, 2.25] },

            // AMERICAN CHEESE
            "CA": 4
        },
        Tray: 10,
        Uses: ["Small pizza", "12in New-York style", "Brooklyn Style Pizza"]
    },

    IN12: {
        Quantities: {
            // PIZZA CHEESE
            "C": {
                _LRE_: [3.5, 5, 2.5],
                _LRE_CHEESE_ONLY_: [3.75, 7.5, 2.5]
            },

            // CHEDDAR / PROVOLONE
            "E": { _LRE_: [1, 2, 3] },
            "PROV": { _LRE_: [1, 2, 3] },

            // FETA / PARM ASIAGO
            "FETA": { _LRE_: [0.75, 1.5, 2.25] },
            "PARASIAG": { _LRE_: [0.75, 1.5, 2.25] },

            // PIZZA SAUCE / MARINARA SAUCE
            "X": { _LRE_: [2.1, 4.25, 6.3] },
            "XM": { _LRE_: [2.1, 4.25, 6.3] },

            // ALFREDO / GARLIC PARM / RANCH / BBQ
            "XF": { _LRE_: [1.5, 3, 4.5] },
            "XW": { _LRE_: [1.5, 3, 4.5] },
            "RD": { _LRE_: [1.5, 3, 4.5] },
            "Q": { _LRE_: [1.5, 3, 4.5] },

            // AMERICAN CHEESE
            "CA": 6
        },
        Tray: 8,
        Uses: ["Medium pizza", "14in New-York style", "Cheezy Bread", "Bread sticks", "CinnaStix"]
    },

    IN14: {
        Quantities: {
            // PIZZA CHEESE
            "C": {
                _LRE_: [5, 7, 3.5],
                _LRE_CHEESE_ONLY_: [5, 10.5, 3.5]
            },

            // CHEDDAR / PROVOLONE
            "E": { _LRE_: [1.25, 2.5, 3.7] },
            "PROV": { _LRE_: [1.25, 2.5, 3.7] },

            // FETA / PARM ASIAGO
            "FETA": { _LRE_: [1, 2, 3] },
            "PARASIAG": { _LRE_: [1, 2, 3] },

            // PIZZA SAUCE / MARINARA SAUCE
            "X": { _LRE_: [3, 6, 9] },
            "XM": { _LRE_: [3, 6, 9] },

            // ALFREDO / GARLIC PARM / RANCH / BBQ
            "XF": { _LRE_: [2, 4, 6] },
            "XW": { _LRE_: [2, 4, 6] },
            "RD": { _LRE_: [2, 4, 6] },
            "Q": { _LRE_: [2, 4, 6] },

            // AMERICAN CHEESE
            "CA": 7
        },
        Tray: 6,
        Uses: ["Large pizza", "16in New-York style", "Stuffed Bread/Pain Farci"]
    },

    IN16: {
        Quantities: {
            // PIZZA CHEESE
            "C": {
                _LRE_: [6.5, 9, 4.5],
                _LRE_CHEESE_ONLY_: [6.75, 13.5, 4.5]
            },

            // CHEDDAR / PROVOLONE
            "E": { _LRE_: [1.75, 3.5, 5.2] },
            "PROV": { _LRE_: [1.75, 3.5, 5.2] },

            // FETA / PARM ASIAGO
            "FETA": { _LRE_: [1.25, 2.5, 3.75] },
            "PARASIAG": { _LRE_: [1.25, 2.5, 3.75] },

            // PIZZA SAUCE / MARINARA SAUCE
            "X": { _LRE_: [4, 8, 12] },
            "XM": { _LRE_: [4, 8, 12] },

            // ALFREDO / GARLIC PARM / RANCH / BBQ
            "XF": { _LRE_: [2.5, 5, 7.5] },
            "XW": { _LRE_: [2.5, 5, 7.5] },
            _RD_: { _LRE_: [2.5, 5, 7.5] },
            "Q": { _LRE_: [2.5, 5, 7.5] },

            // AMERICAN CHEESE
            "CA": 9
        },
        Tray: 5,
        Uses: ["Extra Large pizza"]
    },

    Pan: {
        Quantities: {
            // PIZZA CHEESE
            "C": {
                _LRE_: [2.25, 3, 1.5],
                _LRE_CHEESE_ONLY_: [2.25, 4.5, 1.5]
            },

            // PROVOLONE
            "PROV": 4,

            // ALL SAUCES (X, XM, XF, XW, RD, Q)
            "X": 3,
            "XM": 3,
            "XF": 3,
            "XW": 3,
            _RD_: 3,
            "Q": 3
        },
        Tray: 8,
        Uses: ["Pan Pizza (12in only)", "12in Stuffed Crust", "(32xCinna Bites/32xParm Bites) 16x2"]
    },

    Gluten_free: {
        Uses: ["Gluten-Free Pizza (10in only)"]
    },

    Croustimince: {
        Uses: ["Croustimince Pizza (10in, 12in, 14in)"]
    }
}


const PIZZA_FEAST = {
    "Cheese Only": ["X", "+C"],
    "Brooklyn Pepperoni": ["X", "C", "PL", "Prov"],
    "Deluxe": ["X", "C", "P", "G", "M", "S", "O"],
    "Meatzza": ["X", "+C", "P", "H", "B", "S"],
    "Extravaganza": ["X", "+C", "P", "H", "B", "S", "G", "M", "R", "O"],
    "Pepperoni Feast": ["X", "+C", "+P"],
    "Hawaiian": ["X", "+C", "H", "N"],
    "Mediterranean": ["X", "C", "R", "T", "Feta", "O"],
    "Mexican": ["X", "+C", "B", "Z", "R", "O"],
    "Philly Cheese Steak": ["Ca", "St", "G", "M", "Prov", "O"],
    "Chicken Bacon BBQ": ["Q", "C", "D", "G", "E", "O", "K"],
    "Chicken Bacon Ranch": ["RD", "C", "D", "G", "T", "E", "K"],
    "Chicken Bacon Alfredo": ["XF", "C", "M", "D", "Prov", "E", "O", "K"],
    "Canadian/Quebecois": ["X", "+C", "P", "M", "K"],
    "Toute Garnie": ["X", "C", "P", "G", "M"],
    "Tropical": ["X", "+C", "H", "+N", "K"],
    "Veggie": ["X", "C", "G", "M", "R", "T", "O"],
    "Spinach & Feta": ["Sp", "C", "Feta", "Prov", "Parasiag", "O", "XF"],
    "6 Cheese": ["X", "C", "E", "Prov", "Feta", "Parasiag", "**OREG**"],
    "Pacific Veggie": ["X", "Sp", "C", "M", "R", "Rp", "T", "Prov", "Feta", "O", "**GAR_HERB**"],
    "Authentic": ["XM", "+C", "+P", "M", "G"],
}


const SPECIALITY_CHICKEN = {}
const PASTA = {}

const OTHERS = {
    "Garlic Fingers": ["Garlic Spread", "+C"],
}

// SOLUTION FUNCTIONS

function _SOLUTION_TOPPINGS_MEATS_(q) {
    TOPPINGS_LIST_MEATS.forEach(topping => {
        let element = document.createElement("div")
        element.textContent = topping[0]
        solution.appendChild(element)
        element.addEventListener("click", () => {
            if (topping[0].toLowerCase() == q.toLowerCase()) {
                selected.textContent = topping[1]
                element.style.background = "#6cfe9050"
                setTimeout(() => NEW_QUERY(), 400)
                score++
                selected.textContent = "score; " + score
            } else {
                selected.textContent = topping[1]
                element.style.background = "#7f2727ff"
            }
        })
    })
}
function _SOLUTION_TOPPINGS_VEGETABLES_(q) {
    TOPPINGS_LIST_VEGETABLES.forEach(topping => {
        let element = document.createElement("div")
        element.textContent = topping[0]
        solution.appendChild(element)
        element.addEventListener("click", () => {
            if (topping[0].toLowerCase() == q.toLowerCase()) {
                selected.textContent = topping[1]
                element.style.background = "#6cfe9050"
                setTimeout(() => NEW_QUERY(), 400)
                score++
                selected.textContent = "score; " + score
            } else {
                selected.textContent = topping[1]
                element.style.background = "#7f2727ff"
            }
        })
    })
}
function _SOLUTION_TOPPINGS_CHEESES_(q) {
    TOPPINGS_LIST_CHEESES.forEach(topping => {
        let element = document.createElement("div")
        element.textContent = topping[0]
        solution.appendChild(element)
        element.addEventListener("click", () => {
            if (topping[0].toLowerCase() == q.toLowerCase()) {
                selected.textContent = topping[1]
                element.style.background = "#6cfe9050"
                setTimeout(() => NEW_QUERY(), 400)
                score++
                selected.textContent = "score; " + score
            } else {
                selected.textContent = topping[1]
                element.style.background = "#7f2727ff"
            }
        })
    })
}
function _SOLUTION_SAUCES_(q) {
    SAUCES_LIST.forEach(sauce => {
        let element = document.createElement("div")
        element.textContent = sauce[0]
        solution.appendChild(element)
        element.addEventListener("click", () => {
            if (sauce[0].toLowerCase() == q.toLowerCase()) {
                selected.textContent = sauce[1]
                element.style.background = "#6cfe9050"
                setTimeout(() => NEW_QUERY(), 400)
                score++
                selected.textContent = "score; " + score
            } else {
                selected.textContent = sauce[1]
                element.style.background = "#7f2727ff"
            }
        })
    })
}

// SPF - SOLUTION PIZZA FEAST
let _SPF_EXTRA_ACTIVE_ = false
function _SOLUTION_PIZZA_FEAST_(pizzaName, q) {
    solution.innerHTML = ""
    // Clean the feast symbols (remove + - ~)
    let check_sauce = q.map(sym => sym.replace(/^[+\-~]/, ""))
    let skip_base_query = false
    if (check_sauce.filter(sym => !Object.keys(SAUCES).includes(sym))) {
        skip_base_query = true
    }

    let q_filtered = q.map(sym => sym.replace(/^[\-~]/, "")).filter(sym => !Object.keys(SAUCES).includes(sym)).filter(sym => !Object.keys(CUT_TABLE_OPTIONS).includes(sym))

    let _EXTRA_ = document.createElement("div")
    _EXTRA_.className = "extra-button"
    _EXTRA_.textContent = "EXTRA"
    solution.appendChild(_EXTRA_)

    let _TABS_ = document.createElement("div")
    _TABS_.className = "extra-button"
    _TABS_.textContent = "MEATS"
    solution.appendChild(_TABS_)

    let _WRAPPER_ = document.createElement("WRAPPER")
    _WRAPPER_.appendChild(_EXTRA_)
    _WRAPPER_.appendChild(_TABS_)
    _WRAPPER_.className = "spf-wrapper"

    let TAB = 2
    _TABS_.addEventListener("click", () => {
        console.log(TAB);
        
        TAB++
        if (TAB > 2) {
            TAB = 0
        }
        _TABS_.textContent = ["MEATS", "VEGGIES", "CHEESES"][TAB]
                    
        let _SPF_TOPPINGS_WRAPPER_ = document.createElement("WRAPPER")
        _SPF_TOPPINGS_WRAPPER_.className = "spf-wrapper"
        switch (TAB) {
            case 0:
                solution.innerHTML = ""
                solution.appendChild(_WRAPPER_)
                solution.appendChild(_SPF_TOPPINGS_WRAPPER_)
                TOPPINGS_LIST_MEATS.forEach(topping => {
                    _SPF_(topping, q_filtered, _EXTRA_, pizzaName, skip_base_query, _SPF_TOPPINGS_WRAPPER_)
                })
                break;
            case 1:
                solution.innerHTML = ""
                solution.appendChild(_WRAPPER_)
                solution.appendChild(_SPF_TOPPINGS_WRAPPER_)
                TOPPINGS_LIST_VEGETABLES.forEach(topping => {
                    _SPF_(topping, q_filtered, _EXTRA_, pizzaName, skip_base_query, _SPF_TOPPINGS_WRAPPER_)
                })
                break;
            case 2:
                solution.innerHTML = ""
                solution.appendChild(_WRAPPER_)
                solution.appendChild(_SPF_TOPPINGS_WRAPPER_)
                    
                TOPPINGS_LIST_CHEESES.forEach(topping => {
                    _SPF_(topping, q_filtered, _EXTRA_, pizzaName, skip_base_query, _SPF_TOPPINGS_WRAPPER_)
                })
                break;
        }
    })

    _TABS_.click()

    _EXTRA_.addEventListener("click", () => {
        _SPF_EXTRA_ACTIVE_ = !_SPF_EXTRA_ACTIVE_
        if (_SPF_EXTRA_ACTIVE_) {
            _EXTRA_.style.color = "#6cfe90"
        } else {
            _EXTRA_.style.color = "#777"
        }
    })
}

let _SPF_FOUND_ = 0
function _SPF_(topping, q_filtered, _EXTRA_, pizzaName, skip_base_query, _SPF_TOPPINGS_WRAPPER_) {
    let symbol = topping[0]

    let element = document.createElement("div")
    element.textContent = symbol
    _SPF_TOPPINGS_WRAPPER_.appendChild(element)

    element.addEventListener("click", () => {
        if (element.id !== "checked") {
            if (_SPF_EXTRA_ACTIVE_) {
                if (!symbol.startsWith("+")) {
                    symbol = "+" + symbol
                    _SPF_EXTRA_ACTIVE_ = false
                    _EXTRA_.style.color = "#777"
                }
            }
            if (q_filtered.includes(symbol)) {
                element.id = "checked"
                selected.textContent = topping[1]
                element.style.background = "#6cfe9075"
                _SPF_FOUND_++
            } else {
                selected.textContent = "Incorrect: " + topping[1]
                element.style.background = "#7f2727ff"
                if (symbol.startsWith("+")) {
                    symbol = symbol.slice(1)
                }
            }
        }

        console.log(_SPF_FOUND_, q_filtered.length);
        

        if (_SPF_FOUND_ === q_filtered.length) {
            selected.textContent = "Correct! All ingredients found."
            _SPF_FOUND_ = 0
            if (skip_base_query) {
                setTimeout(() => QUERY_PIZZA_FEAST(4), 400)
                score++
                selected.textContent = "score; " + score
            } else {
                setTimeout(() => QUERY_PIZZA_FEAST_BASE(pizzaName, q), 400)
                score++
                selected.textContent = "score; " + score
            }
        }
    })
}

function _SOLUTION_PIZZA_FEAST_BASE_(q) {
    let cleanedFeast = q.find(item => Object.keys(SAUCES).includes(item))
    SAUCES_LIST.forEach(topping => {
        let symbol = topping[0]

        let element = document.createElement("div")
        element.textContent = symbol
        solution.appendChild(element)

        element.addEventListener("click", () => {
            if (cleanedFeast.includes(symbol)) {
                selected.textContent = topping[1]
                element.style.background = "#6cfe9050"
                setTimeout(() => QUERY_PIZZA_FEAST(q), 400)
                score++
                selected.textContent = "score; " + score
            } else {
                selected.textContent = topping[1]
                element.style.background = "#7f2727ff"
            }
        })
    })
}



// QUERIES FUNCTIONS

function QUERY_TOPPINGS_MEATS() {
    let RdTopping = Math.floor(Math.random() * TOPPINGS_LIST_MEATS.length)
    query.textContent = `What Symbol is used for ${TOPPINGS_LIST_MEATS[RdTopping][1]}`
    _SOLUTION_TOPPINGS_MEATS_(TOPPINGS_LIST_MEATS[RdTopping][0])
}
function QUERY_TOPPINGS_VEGETABLES() {
    let RdTopping = Math.floor(Math.random() * TOPPINGS_LIST_VEGETABLES.length)
    query.textContent = `What Symbol is used for ${TOPPINGS_LIST_VEGETABLES[RdTopping][1]}`
    _SOLUTION_TOPPINGS_VEGETABLES_(TOPPINGS_LIST_VEGETABLES[RdTopping][0])
}
function QUERY_TOPPINGS_CHEESES() {
    let RdTopping = Math.floor(Math.random() * TOPPINGS_LIST_CHEESES.length)
    query.textContent = `What Symbol is used for ${TOPPINGS_LIST_CHEESES[RdTopping][1]}`
    _SOLUTION_TOPPINGS_CHEESES_(TOPPINGS_LIST_CHEESES[RdTopping][0])
}
function QUERY_SAUCES() {
    let RdSauce = Math.floor(Math.random() * SAUCES_LIST.length)
    query.textContent = `What Symbol is used for ${SAUCES_LIST[RdSauce][1]}`
    _SOLUTION_SAUCES_(SAUCES_LIST[RdSauce][0])
}
function QUERY_PIZZA_FEAST() {
    let RdPizzaFeast = Math.floor(Math.random() * Object.keys(PIZZA_FEAST).length)
    let pizzaName = Object.keys(PIZZA_FEAST)[RdPizzaFeast]
    query.innerHTML = `<p>What are the ingredients used for the <span style="color: #6cfe90; font-weight: 600;">${pizzaName}</span> Pizza</p>`
    _SOLUTION_PIZZA_FEAST_(pizzaName, PIZZA_FEAST[pizzaName])
}
function QUERY_PIZZA_FEAST_BASE(pizzaName, q) {
    if (q != undefined) {
        console.log(q);
        solution.innerHTML = ""
        query.textContent = `What base is used on the ${pizzaName} Pizza Feast`
        _SOLUTION_PIZZA_FEAST_BASE_(q)
    } else {
        let RdPizzaFeast = Math.floor(Math.random() * Object.keys(PIZZA_FEAST).length)
        let pizzaName = Object.keys(PIZZA_FEAST)[RdPizzaFeast]
        query.textContent = `What base is used on the ${pizzaName} Pizza Feast`
        _SOLUTION_PIZZA_FEAST_BASE_(PIZZA_FEAST[pizzaName])
    }
}

function NEW_QUERY(exclude) {
    solution.innerHTML = ""
    let r = Math.floor(Math.random() * 5)
    if (r == 0) {
        QUERY_TOPPINGS_MEATS()
    } else if (r == 1 && exclude != 1) {
        QUERY_TOPPINGS_VEGETABLES()
    } else if (r == 2 && exclude != 2) {
        QUERY_TOPPINGS_CHEESES()
    } else if (r == 3 && exclude != 3) {
        QUERY_SAUCES()
    } else if (r == 4 && exclude != 4) {
        QUERY_PIZZA_FEAST()
    } else {
        NEW_QUERY(exclude)
    }
}

QUERY_PIZZA_FEAST()