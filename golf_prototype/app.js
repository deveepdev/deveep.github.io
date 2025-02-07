const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const launch = {
    down: false,
    positionA: {
        x: null,
        y: null
    },
    positionB: {
        x: null,
        y: null
    },
    positionC: {
        x: null,
        y: null
    }
}

const GRASS_COLOR = "#388E3C"
let level = []
let ball = null
let put = null

function win() {
    ball.win = true
    ball.position = put.position

    ctx.beginPath()
    ctx.strokeStyle = "white"
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.moveTo(ball.position.x, ball.position.y)
    ctx.lineTo(ball.position.x, ball.position.y-80)
    ctx.stroke()
    ctx.beginPath()
    ctx.fillStyle = "red"
    ctx.strokeStyle = "red"
    ctx.moveTo(ball.position.x, ball.position.y-75)
    ctx.lineTo(ball.position.x+35, ball.position.y-75+15)
    ctx.lineTo(ball.position.x, ball.position.y-75+30)
    ctx.fill()
    ctx.stroke()
}

function collision(object1, object2) {
    const nextX = object1.position.x + object1.velocity.x;
    const nextY = object1.position.y + object1.velocity.y;

    const ballLeft = nextX - object1.radius / 2;
    const ballRight = nextX + object1.radius / 2;
    const ballTop = nextY - object1.radius / 2;
    const ballBottom = nextY + object1.radius / 2;

    const objLeft = Math.min(object2.position.x, object2.position.x + object2.width);
    const objRight = Math.max(object2.position.x, object2.position.x + object2.width);
    const objTop = Math.min(object2.position.y, object2.position.y + object2.height);
    const objBottom = Math.max(object2.position.y, object2.position.y + object2.height);

    if (ballRight > objLeft && ballLeft < objRight && ballBottom > objTop && ballTop < objBottom) {
        const overlapLeft = ballRight - objLeft;
        const overlapRight = objRight - ballLeft;
        const overlapTop = ballBottom - objTop;
        const overlapBottom = objBottom - ballTop;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        // Small correction buffer
        const buffer = 0.1;

        if (minOverlap === overlapLeft) {
            ball.energyLoss()
            object1.position.x -= overlapLeft + buffer;
            object1.velocity.x = -Math.abs(object1.velocity.x);
        } else if (minOverlap === overlapRight) {
            ball.energyLoss()
            object1.position.x += overlapRight + buffer;
            object1.velocity.x = Math.abs(object1.velocity.x);
        } else if (minOverlap === overlapTop) {
            ball.energyLoss()
            object1.position.y -= overlapTop + buffer;
            object1.velocity.y = -Math.abs(object1.velocity.y);
        } else if (minOverlap === overlapBottom) {
            ball.energyLoss()
            object1.position.y += overlapBottom + buffer;
            object1.velocity.y = Math.abs(object1.velocity.y);
        }
    }
}


function LoadLevel(loadlevel) {
    level = loadlevel
}

class Obstacle {
    constructor(x, y, w, h) {
        this.position = { x, y }
        this.width = w
        this.height = h
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = "#2E7D32"
        ctx.rect(this.position.x, this.position.y, this.width, this.height)
        ctx.fill()
    }
}

class Ball {
    constructor(x, y) {
        this.position = { x, y }
        this.velocity = { x:0, y:0 }
        this.radius = 15
        this.drag = 0.99
        this.stopped = true
        this.win = false
        this.strokes = 0
    }
    energyLoss() {
        this.velocity.x *= 0.86
        this.velocity.y *= 0.86
    }
    draw() {
        if (!this.win) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            if (Math.abs(this.velocity.x) <= 0.05) {
                this.velocity.x = 0
                this.stopped = true
            } else {
                this.stopped = false
                this.velocity.x *= this.drag
            }
            if (Math.abs(this.velocity.y) <= 0.05) {
                this.velocity.y = 0
                this.stopped = true
            } else {
                this.stopped = false
                this.velocity.y *= this.drag
            }
        }

        ctx.beginPath()
        ctx.fillStyle = "#fff"
        ctx.arc(this.position.x, this.position.y, this.radius/2, 0, 2*Math.PI)
        ctx.fill()
    }
}

class Put {
    constructor(x, y) {
        this.position = { x, y }
        this.radius = 20
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = "#1B5E20"
        ctx.arc(this.position.x, this.position.y, this.radius/2, 0, 2*Math.PI)
        ctx.fill()
    }
}

const LEVEL = {
    EDITOR: ["editor", "walls", null],
    l1: [new Obstacle(0, 0, 35, canvas.height), new Obstacle(0, 0, canvas.width, 35), new Obstacle(canvas.width-35, 0, 35, canvas.height), new Obstacle(0, canvas.height-35, canvas.width, 35), new Obstacle(canvas.width/2.4, 0, 35, canvas.height/1.5), new Obstacle(canvas.width/1.6, canvas.height/3, 35, canvas.height/1.5), new Put(canvas.width/5, canvas.height/2), new Ball(canvas.width/1.2, canvas.height/2)],
    l2: [new Obstacle(2077,44, -2077, -135), new Obstacle(120,26, -120, 1082), new Obstacle(1921,30, 411, 1078), new Obstacle(68,842, 1902, 203), new Obstacle(508,392, 294, 543), new Obstacle(560,16, 161, 245), new Obstacle(851,38, 330, 309), new Obstacle(1027,835, 297, -368), new Obstacle(866,323, 101, 364), new Obstacle(1161,394, 310, -122), new Obstacle(1324,282, 90, -178), new Obstacle(1394,145, 428, 58), new Obstacle(1560,92, 47, 69), new Obstacle(1666,30, 24, 82), new Obstacle(1733,163, 54, -61), new Obstacle(1637,197, 120, 325), new Obstacle(1090,807, 45, 64), new Obstacle(1375,446, 193, 61), new Obstacle(1516,260, 65, 133), new Obstacle(1396,781, 36, -231), new Obstacle(1465,494, 50, 187), new Obstacle(1578,877, 186, -189), new Obstacle(1615,582, 118, 68), new Obstacle(1793,587, 91, 67), new Obstacle(1804,471, 64, 75), new Obstacle(1746,362, 70, 50), new Obstacle(1866,332, 85, 80), new Obstacle(1786,261, 90, 46), new Obstacle(1857,167, 11, -12), new Obstacle(1866,38, 19, 63), new Obstacle(1795,704, 56, 4), new Obstacle(1848,733, 39, 1), new Obstacle(1845,727, 45, 16), new Obstacle(1793,771, 35, 21), new Obstacle(736,298, -423, 25), new Obstacle(488,357, -155, 26), new Obstacle(303,308, -133, 28), new Obstacle(326,396, -148, -31), new Obstacle(220,240, 160, 23), new Obstacle(301,96, 32, 128), new Obstacle(373,94, 58, 136), new Obstacle(456,82, 35, 123), new Obstacle(157,101, 54, 69), new Obstacle(75,481, 183, 29), new Obstacle(97,573, 257, 3), new Obstacle(85,601, 288, 35), new Obstacle(298,531, 248, 11), new Obstacle(460,606, 101, 186), new Obstacle(122,685, 279, 51), new Obstacle(238,772, 106, 90), new Ball(1238,171), new Put(162,780)],
}

LoadLevel(LEVEL.EDITOR)

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (level[0] == "editor") {
        for (let i = 3; i < level.length; i++) {
            level[i].draw()
        }
    } else {
        for (let i = 0; i < level.length; i++) {
            level[i].draw()
            if (level[i] instanceof Ball) ball = level[i]
            if (level[i] instanceof Put) put = level[i]
            if (ball != null && put != null) {
                let distance = Math.hypot(ball.position.y - put.position.y, ball.position.x - put.position.x)
                if (distance <= ball.radius/3 + put.radius/2) {
                    win()
                }
            }
            if (level[i] instanceof Obstacle && ball != null) {
                collision(ball, level[i])
            }
        }
    
        if (ball != null) {
            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.textAlign = "left"
            ctx.textBaseline = "top"
            ctx.font = "90px sans-serif"
            ctx.fillText(ball.strokes, 0, 0)

            if (launch.down && ball.stopped) {
                ctx.beginPath()
                ctx.moveTo(launch.positionA.x, launch.positionA.y)
                ctx.lineTo(launch.positionC.x, launch.positionC.y)
                let differanceX = launch.positionC.x-ball.position.x
                let differanceY = launch.positionC.y-ball.position.y
                ctx.moveTo(launch.positionA.x-differanceX, launch.positionA.y-differanceY)
                ctx.lineTo(launch.positionC.x-differanceX, launch.positionC.y-differanceY)
                ctx.stroke()
            }
        }
    }

    // debug
    if (level[0] == "editor") {
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.font = "24px sans-serif"
        ctx.fillText(level[1] + " [W] [S] [M] [D] [P] [B] [C (copy)] [V (paste)]     [SPACE (play level)]", 0, 0)

        if (launch.down) {
            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.rect(launch.positionA.x, launch.positionA.y, launch.positionC.x-launch.positionA.x, launch.positionC.y-launch.positionA.y)
            ctx.stroke()
        }
    }
}

function shoot() {
    if (level[0] != "editor") {
        if (ball.velocity.x == 0 && ball.velocity.y == 0) {
            const angle = Math.atan2(launch.positionA.y - launch.positionB.y, launch.positionA.x - launch.positionB.x)
            const distance = Math.min(Math.hypot(launch.positionA.y - launch.positionB.y, launch.positionA.x - launch.positionB.x), 300)
        
            ball.velocity.x = Math.cos(angle) * (distance/10)
            ball.velocity.y = Math.sin(angle) * (distance/10)
            ball.strokes++
        }
    }
}

function CreateWall() {
    let x = Math.min(launch.positionA.x, launch.positionB.x)
    let y = Math.min(launch.positionA.y, launch.positionB.y)
    let width = Math.abs(launch.positionB.x - launch.positionA.x)
    let height = Math.abs(launch.positionB.y - launch.positionA.y)

    level.push(new Obstacle(x, y, width, height))
}

function PlacePut(x, y) {
    level.push(new Put(x, y))
}

function PlaceBall(x, y) {
    level.push(new Ball(x, y))
}

addEventListener('mousedown', (e) => {
    launch.positionA.x = e.x
    launch.positionA.y = e.y
    launch.down = true
})

addEventListener('mousemove', (e) => {
    launch.positionC.x = e.x
    launch.positionC.y = e.y

    if (level[0] == "editor" && level[1] == "move" && level[2] != null) {
        level[level[2]].position.x = e.x - level[level[2]].width/2
        level[level[2]].position.y = e.y - level[level[2]].height/2
    }
})

addEventListener('mouseup', (e) => {
    launch.positionB.x = e.x
    launch.positionB.y = e.y
    launch.down = false
    shoot()
    if (level[0] == "editor") {
        if (level[1] == "walls") {
            CreateWall()
        }
    }
})

addEventListener('click', (e) => {
    if (level[0] == "editor") {
        if (level[1] == "put") {
            PlacePut(e.x, e.y)
        } else if (level[1] == "ball") {
            PlaceBall(e.x, e.y)
        } else {
            for (let i = 3; i < level.length; i++) {
                if (
                    Math.min(level[i].position.x, level[i].position.x + level[i].width) <= e.x &&
                    Math.max(level[i].position.x, level[i].position.x + level[i].width) >= e.x &&
                    Math.min(level[i].position.y, level[i].position.y + level[i].height) <= e.y &&
                    Math.max(level[i].position.y, level[i].position.y + level[i].height) >= e.y
                ) {
                    if (level[1] == "select") {
                        if (level[2] == i) {
                            level[2] = null
                        } else {
                            level[2] = i
                        }
                    }
                    if (level[1] == "delete") {
                        level.splice(i, 1)
                    }
                }
            }
        }
    }
})

function serializeLevel(levelArray) {
    arr = levelArray.map(obj => {
        if (obj instanceof Obstacle) {
            return { type: "Obstacle", x: obj.position.x, y: obj.position.y, w: obj.width, h: obj.height };
        } else if (obj instanceof Ball) {
            return { type: "Ball", x: obj.position.x, y: obj.position.y };
        } else if (obj instanceof Put) {
            return { type: "Put", x: obj.position.x, y: obj.position.y };
        }
        return obj; // Preserve other level data (like "editor" mode)
    })

    arr.splice(0, 3)

    return arr
}


function splitObjectsFromString(str) {
    const matches = str.match(/\{[^{}]*\}/g); // Extracts each JSON object
    if (!matches) return [];

    try {
        return matches.map(obj => JSON.parse(obj)); // Parse each object
    } catch (error) {
        console.error("Error parsing JSON objects:", error);
        return [];
    }
}

function deserializeLevel(arr) {
    level = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].type == "Obstacle") {
            level.push(new Obstacle(arr[i].x, arr[i].y, arr[i].w, arr[i].h))
        } else if (arr[i].type == "Ball") {
            level.push(new Ball(arr[i].x, arr[i].y))
        } else if (arr[i].type == "Put") {
            level.push(new Put(arr[i].x, arr[i].y))
        } else {
            console.log("Foreign object")
        }
    }
}

addEventListener('keydown', async (e) => {
    if (level[0] == "editor") {
        switch (e.key) {
            case 's':
                level[1] = "select"
                break;
            case 'm':
                level[1] = "move"
                break;
            case 'w':
                level[1] = "walls"
                break;
            case 'd':
                level[1] = "delete"
                break;
            case 'p':
                level[1] = "put"
                break;
            case 'b':
                level[1] = "ball"
                break;
            case 'c':
                navigator.clipboard.writeText(JSON.stringify(serializeLevel(level)))
                break;
            case 'v':
                deserializeLevel(JSON.parse(await navigator.clipboard.readText()))
                break;
            case ' ':
                level.splice(0, 3)
                break;
            default:
                break;
        }
    }
})

requestAnimationFrame(animate)