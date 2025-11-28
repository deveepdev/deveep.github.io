// DOMINOS INSIDER LEARNING APP (QUEBEC, CANADA)

const query = document.querySelector(".query")
const selected = document.querySelector(".selected")
const solution = document.querySelector(".solution")

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
    ["C", "Cheese (Mozzarella)"],
    ["B", "Beef"],
    ["H", "Ham"],
    ["K", "Bacon"],
    ["St", "Philly Steak"],
    ["P", "Pepperoni"],
    ["D", "Chicken"],
    ["S", "Italian Sausage"],
    ["PL", "Brooklyn Pepperoni"],
    ["Ca", "American Cheese"],
    ["E", "Cheddar Cheese"],
    ["Feta", "Feta Cheese"],
    ["Prov", "Provolone Cheese"],
    ["Parasiag", "Parmesan Asiago"],
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

const DOUGH = {
    "10in": {
        "Per-Tray": 10,
        "Uses": ["Small pizza", "12in New-York style", "Brooklyn Style Pizza"]
    },
    "12in": {
        "Per-Tray": 8,
        "Uses": ["Medium pizza", "14in New-York style", "Cheezy Bread", "Bread sticks", "CinnaStix"]
    },
    "14in": {
        "Per-Tray": 6,
        "Uses": ["Large pizza", "16in New-York style", "Stuffed Bread/Pain Farci"]
    },
    "16in": {
        "Per-Tray": 5,
        "Uses": ["Extra Large pizza"]
    },
    "Pan": {
        "Per-Tray": 8,
        "Uses": ["Pan Pizza (12in only)", "12in Stuffed Crust", "(32xCinna Bites/32xParm Bites) 16x2"]
    },
    "Gluten-Free": {
        "Per-Tray": "Bags",
        "Uses": ["Gluten-Free Pizza (10in only)"]
    },
    "Croustimince": {
        "Per-Tray": "Bags",
        "Uses": ["Croustimince Pizza (10in, 12in, 14in)"]
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
    "Philly Cheese Steak": ["-X", "Ca", "St", "G", "M", "Prov", "O"],
    "Chicken Bacon BBQ": ["Q", "C", "D", "G", "E", "O", "K"],
    "Chicken Bacon Ranch": ["RD", "C", "D", "G", "T", "E", "K"],
    "Chicken Bacon Alfredo": ["XF", "C", "M", "D", "Prov", "E", "O", "K"],
    "Canadian/Quebecois": ["X", "+C", "P", "M", "K"],
    "Toute Garnie": ["X", "C", "P", "G", "M"],
    "Tropical": ["X", "+C", "H", "N", "K"],
    "Veggie": ["X", "C", "G", "M", "R", "T", "O"],
    "Spinach & Feta": ["Sp", "C", "Feta", "Prov", "Parasiag", "O", "XF"],
    "6 Cheese": ["X", "C", "E", "Prov", "Feta", "Parasiag", "**OREG**"],
    "Pacific Veggie": ["X", "Sp", "C", "M", "R", "Rp", "T", "Prov", "Feta", "O", "**GAR_HERB**"],
    "Authentic": ["Xm", "+C", "+P", "M", "G"],
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
                element.style.background = "green"
                setTimeout(() => NEW_QUERY(), 400)
            } else {
                selected.textContent = topping[1]
                element.style.background = "red"
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
                element.style.background = "green"
                setTimeout(() => NEW_QUERY(), 400)
            } else {
                selected.textContent = topping[1]
                element.style.background = "red"
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
                element.style.background = "green"
                setTimeout(() => NEW_QUERY(), 400)
            } else {
                selected.textContent = topping[1]
                element.style.background = "red"
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
                element.style.background = "green"
                setTimeout(() => NEW_QUERY(), 400)
            } else {
                selected.textContent = sauce[1]
                element.style.background = "red"
            }
        })
    })
}
function _SOLUTION_PIZZA_FEAST_(pizzaName, q) {

    // Clean the feast symbols (remove + - ~)
    let cleanedFeast = q.map(sym => sym.replace(/^[+\-~]/, "")).filter(sym => !Object.keys(SAUCES).includes(sym)).filter(sym => !Object.keys(CUT_TABLE_OPTIONS).includes(sym));
    let found = 0

    TOPPINGS_LIST.forEach(topping => {
        let symbol = topping[0]

        let element = document.createElement("div")
        element.textContent = symbol
        solution.appendChild(element)

        element.addEventListener("click", () => {
            if (element.id !== "checked") {
                element.id = "checked"
                if (cleanedFeast.includes(symbol)) {
                    selected.textContent = topping[1]
                    element.style.background = "green"
                    found++
                } else {
                    selected.textContent = topping[1]
                    element.style.background = "red"
                }
            }
            if (found == cleanedFeast.length) {
                selected.textContent = "Correct! All ingredients found."
                setTimeout(() => QUERY_PIZZA_FEAST_BASE(pizzaName, q), 400)
            }
        })
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
                element.style.background = "green"
                setTimeout(() => NEW_QUERY(q), 400)
            } else {
                selected.textContent = topping[1]
                element.style.background = "red"
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
    query.textContent = `What are the ingredients used for the ${pizzaName} Pizza Feast`
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

function NEW_QUERY() {
    solution.innerHTML = ""
    let r = Math.floor(Math.random() * 5)
    if (r == 0) {
        QUERY_TOPPINGS_MEATS()
    } else if (r == 1) {
        QUERY_TOPPINGS_VEGETABLES()
    } else if (r == 2) {
        QUERY_TOPPINGS_CHEESES()
    } else if (r == 3) {
        QUERY_SAUCES()
    } else if (r == 4) {
        QUERY_PIZZA_FEAST()
    }
}

NEW_QUERY()