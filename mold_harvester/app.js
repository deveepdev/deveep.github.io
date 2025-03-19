import { Button } from "./CGUI.js"

// explain game
alert("Mold harvester: on the right side you can harvest mold and upgrade it genetically to grow faster\n"+
    "and upgrade your harvester to become number one in mold harvesting!")

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })

canvas.width = innerWidth
canvas.height = innerHeight

let mold = {
    bound: {
        topX: (canvas.width / 2),
        bottomX: (canvas.width),
        topY: 0,
        bottomY: (canvas.height),
    },
    spread: 1,
    harvester: 10,
    density: 30,
    pointPerCell: 1,
    cellSize: 1,
    upgrade: {
        price: {
            spread: 10_000,
            harvester: 10_000,
            density: 10_000,
            pointPerCell: 10_000,
            cellSize: 10_000,
        },
        maxlevel: {
            spread: 15,
            harvester: 150,
            density: 15,
            pointPerCell: 25,
            cellSize: 5,
        },
        spread: () => {mold.spread+=0.5},
        harvester: () => {mold.harvester+=5},
        density: () => {if(mold.density>10)mold.density-=2.5},
        pointPerCell: () => {mold.pointPerCell++},
        cellSize: () => {mold.cellSize++},
    },
}

let DirectionBias = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let Origin = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let mouse = {
    x: 0,
    y: 0
}

let points = 0

let spreadUpgradeButton = new Button('-:-', 50, 50, 200, 50)
let harvesterUpgradeButton = new Button('-:-', 50, 105, 200, 50)
let densityUpgradeButton = new Button('-:-', 50, 160, 200, 50)
let pointPerCellUpgradeButton = new Button('-:-', 50, 215, 200, 50)
let cellSizeUpgradeButton = new Button('-:-', 50, 270, 200, 50)

function animate() {
    requestAnimationFrame(animate)
    if (mouse.x > canvas.width / 2) {
        let data = ctx.getImageData(mouse.x-mold.harvester, mouse.y-mold.harvester, mold.harvester*2, mold.harvester*2)
    
        for (let i = 0; i < data.data.length; i += 4) {
            let r = data.data[i]
            let g = data.data[i+1]
            let b = data.data[i+2]
        
            if (r === 255 && g === 255 && b === 255) {
                points+=mold.pointPerCell
            }
        }
        ctx.clearRect(mouse.x-mold.harvester, mouse.y-mold.harvester, mold.harvester*2, mold.harvester*2)
    }

    ctx.clearRect(0, 0, canvas.width / 2, canvas.height)

// code

    spreadUpgradeButton.text = `spread (${mold.spread}): ${mold.upgrade.price.spread}`
    harvesterUpgradeButton.text = `harvester (${mold.harvester}): ${mold.upgrade.price.harvester}`
    densityUpgradeButton.text = `density (${mold.density}): ${mold.upgrade.price.density}`
    pointPerCellUpgradeButton.text = `point Per Cell (${mold.pointPerCell}): ${mold.upgrade.price.pointPerCell}`
    cellSizeUpgradeButton.text = `cell Size (${mold.cellSize}): ${mold.upgrade.price.cellSize}`

    spreadUpgradeButton.render(canvas)
    harvesterUpgradeButton.render(canvas)
    densityUpgradeButton.render(canvas)
    pointPerCellUpgradeButton.render(canvas)
    cellSizeUpgradeButton.render(canvas)

// spread code

    for (let i = 0; i < mold.spread; i++) {
        let rand = {
            x: ((Math.cos(Origin.x)) * mold.density) + Origin.x,
            y: ((Math.sin(Origin.y)) * mold.density) + Origin.y
        }
    
        if (rand.x < mold.bound.topX) rand.x+=100
        if (rand.x > mold.bound.bottomX) rand.x-=100
        if (rand.y < mold.bound.topY) rand.y+=100
        if (rand.y > mold.bound.bottomY) rand.y-=100
    
        Origin = rand
    
        ctx.beginPath()
        ctx.fillStyle = "#fff"
        ctx.fillRect(rand.x, rand.y, mold.cellSize, mold.cellSize)
    }

    ctx.beginPath()
    ctx.fillStyle = "#fff"
    ctx.textBaseline = "top"
    ctx.font = "25px sans-serif"
    ctx.fillText(points, 0, 0)
}

addEventListener('click', (e) => {
    if (spreadUpgradeButton.isInBoundingBox(e)) {
        if (points >= mold.upgrade.price.spread) {
            mold.upgrade.price.spread *= 2
            mold.upgrade.spread()
        }
    }
    if (harvesterUpgradeButton.isInBoundingBox(e)) {
        if (points >= mold.upgrade.price.harvester) {
            points -= mold.upgrade.price.harvester
            mold.upgrade.price.harvester *= 2
            mold.upgrade.harvester()
        }
    }
    if (densityUpgradeButton.isInBoundingBox(e)) {
        if (points >= mold.upgrade.price.density) {
            points -= mold.upgrade.price.density
            mold.upgrade.price.density *= 5
            mold.upgrade.density()
        }
    }
    if (pointPerCellUpgradeButton.isInBoundingBox(e)) {
        if (points >= mold.upgrade.price.pointPerCell) {
            points -= mold.upgrade.price.pointPerCell
            mold.upgrade.price.pointPerCell *= 2
            mold.upgrade.pointPerCell()
        }
    }
    if (cellSizeUpgradeButton.isInBoundingBox(e)) {
        if (points >= mold.upgrade.price.cellSize) {
            points -= mold.upgrade.price.cellSize
            mold.upgrade.price.cellSize *= 10
            mold.upgrade.cellSize()
        }
    }
})

addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})

requestAnimationFrame(animate)

// todo
// add upgrade button