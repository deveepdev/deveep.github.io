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
    EDITOR: ["editor"],
    l1: [new Obstacle(0, 0, 35, canvas.height), new Obstacle(0, 0, canvas.width, 35), new Obstacle(canvas.width-35, 0, 35, canvas.height), new Obstacle(0, canvas.height-35, canvas.width, 35), new Obstacle(canvas.width/2.4, 0, 35, canvas.height/1.5), new Obstacle(canvas.width/1.6, canvas.height/3, 35, canvas.height/1.5), new Put(canvas.width/5, canvas.height/2), new Ball(canvas.width/1.2, canvas.height/2)],
    l2: [new Obstacle(2077,44, -2077, -135), new Obstacle(120,26, -120, 1082), new Obstacle(1921,30, 411, 1078), new Obstacle(68,842, 1902, 203), new Obstacle(508,392, 294, 543), new Obstacle(560,16, 161, 245), new Obstacle(851,38, 330, 309), new Obstacle(1027,835, 297, -368), new Obstacle(866,323, 101, 364), new Obstacle(1161,394, 310, -122), new Obstacle(1324,282, 90, -178), new Obstacle(1394,145, 428, 58), new Obstacle(1560,92, 47, 69), new Obstacle(1666,30, 24, 82), new Obstacle(1733,163, 54, -61), new Obstacle(1637,197, 120, 325), new Obstacle(1090,807, 45, 64), new Obstacle(1375,446, 193, 61), new Obstacle(1516,260, 65, 133), new Obstacle(1396,781, 36, -231), new Obstacle(1465,494, 50, 187), new Obstacle(1578,877, 186, -189), new Obstacle(1615,582, 118, 68), new Obstacle(1793,587, 91, 67), new Obstacle(1804,471, 64, 75), new Obstacle(1746,362, 70, 50), new Obstacle(1866,332, 85, 80), new Obstacle(1786,261, 90, 46), new Obstacle(1857,167, 11, -12), new Obstacle(1866,38, 19, 63), new Obstacle(1795,704, 56, 4), new Obstacle(1848,733, 39, 1), new Obstacle(1845,727, 45, 16), new Obstacle(1793,771, 35, 21), new Obstacle(736,298, -423, 25), new Obstacle(488,357, -155, 26), new Obstacle(303,308, -133, 28), new Obstacle(326,396, -148, -31), new Obstacle(220,240, 160, 23), new Obstacle(301,96, 32, 128), new Obstacle(373,94, 58, 136), new Obstacle(456,82, 35, 123), new Obstacle(157,101, 54, 69), new Obstacle(75,481, 183, 29), new Obstacle(97,573, 257, 3), new Obstacle(85,601, 288, 35), new Obstacle(298,531, 248, 11), new Obstacle(460,606, 101, 186), new Obstacle(122,685, 279, 51), new Obstacle(238,772, 106, 90), new Ball(1238,171), new Put(162,780)],
}

LoadLevel(LEVEL.l1)

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (level[0] == "editor") {
        for (let i = 1; i < level.length; i++) {
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
    
        if (ball != null && launch.down && ball.stopped) {
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

function shoot() {
    if (level[0] != "editor") {
        if (ball.velocity.x == 0 && ball.velocity.y == 0) {
            const angle = Math.atan2(launch.positionA.y - launch.positionB.y, launch.positionA.x - launch.positionB.x)
            const distance = Math.hypot(launch.positionA.y - launch.positionB.y, launch.positionA.x - launch.positionB.x)
        
            ball.velocity.x = Math.cos(angle) * (distance/10)
            ball.velocity.y = Math.sin(angle) * (distance/10)
        }
    }
}

function CreateWall() {
    level.push(new Obstacle(launch.positionA.x, launch.positionA.y, launch.positionB.x-launch.positionA.x, launch.positionB.y-launch.positionA.y))
}

addEventListener('mousedown', (e) => {
    launch.positionA.x = e.x
    launch.positionA.y = e.y
    launch.down = true
})

addEventListener('mousemove', (e) => {
    launch.positionC.x = e.x
    launch.positionC.y = e.y
})

addEventListener('mouseup', (e) => {
    launch.positionB.x = e.x
    launch.positionB.y = e.y
    launch.down = false
    shoot()
    if (level[0] == "editor") {
        CreateWall()
    }
})

requestAnimationFrame(animate)
