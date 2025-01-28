const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const cw = canvas.width /2
const ch = canvas.height /2

let mouse = {
    x: 0,
    y: 0
}

// function isPointInsideRotatedRectangle(point, rectangle) {
//     // Extract properties of the rectangle
//     const rotation = rectangle.rotation
//     const width = rectangle.width
//     const height = rectangle.height
//     const rectX = rectangle.position.x;
//     const rectY = rectangle.position.y;
//     const pointX = point.position.x;
//     const pointY = point.position.y;

//     // Calculate center of the rectangle
//     const centerX = rectX + width / 2;
//     const centerY = rectY + height / 2;

//     // Translate point and rectangle center to origin
//     const translatedPointX = pointX - centerX;
//     const translatedPointY = pointY - centerY;

//     // Rotate point coordinates by negative rotation angle
//     const rotatedPointX = translatedPointX * Math.cos(-rotation) - translatedPointY * Math.sin(-rotation);
//     const rotatedPointY = translatedPointX * Math.sin(-rotation) + translatedPointY * Math.cos(-rotation);

//     // Check if rotated point is within the unrotated rectangle's bounds
//     return (
//         Math.abs(rotatedPointX) <= width / 2 &&
//         Math.abs(rotatedPointY) <= height / 2
//     );
// }

let tankcd = 0

class Hud {
    constructor() {
        this.margin = 15
        this.fireModes = ["Hoaming", "Single", "Burst", "Explosive"]
        this.fireModeProperties = [{cd: 500, lifetime: 1500}, {cd: 250, lifetime: 750}, {cd: 500, lifetime: 550}, {cd: 700, lifetime: 400}]
        this.selectedMode = 1
    }
    drawFireCD() {
        let width = 200
        let height = 25
        let widthPercentage = tankcd/this.fireModeProperties[this.selectedMode].cd
        
        ctx.beginPath()
        ctx.fillStyle = "#515151"
        ctx.fillRect(this.margin, (canvas.height-this.margin)-height, width, height)
        ctx.fillStyle = "#fff"
        ctx.fillRect(this.margin, (canvas.height-this.margin)-height, width*widthPercentage, height)
    }
    drawFireModes() {
        let size = 50
        ctx.beginPath()
        for (let i = 0; i < this.fireModes.length; i++) {
            ctx.fillStyle = `hsl(${50*i}, 50%, 50%)`
            ctx.fillRect(canvas.width - ((50+this.margin)*(i+1)), canvas.height-50 - this.margin, size, size)
            ctx.fillStyle = "#fff"
            ctx.textAlign = "center"
            ctx.font = "24px sans-serif"
            ctx.fillText(i+1, canvas.width - ((50+this.margin)*(i+1))+25, canvas.height-50 - this.margin*2)
            ctx.fillStyle = "#000"
            ctx.font = "11px sans-serif"
            ctx.fillText(this.fireModes[i], canvas.width - ((50+this.margin)*(i+1))+25, canvas.height-50 + this.margin)
        }
        ctx.beginPath()
        ctx.lineWidth = 4
        ctx.strokeStyle = `#fff`
        ctx.rect(canvas.width - ((50+this.margin)*(this.selectedMode+1)), canvas.height-50 - this.margin, size, size)
        ctx.stroke()
    }
    draw() {
        this.drawFireCD()
        this.drawFireModes()
    }
}

const hud = new Hud()

class Tank {
    constructor(x, y) {
        this.color = Math.random() * 255
        this.width = 40
        this.height = 60
        this.cd = hud.fireModeProperties[hud.selectedMode].cd

        this.steering = {
            forward: false,
            backward: false,
            left: false,
            right: false
        }
        this.velocity = {
            x: 0,
            y: 0
        }

        this.position = {
            x,
            y
        }

        this.rotation = 0
        this.muzzleRotation = 0
    }
    draw() {
        tankcd = this.cd
        ctx.beginPath()
        ctx.save()
        ctx.strokeStyle = `hsl(${this.color}, 50%, 30%)`
        ctx.fillStyle = `hsl(${this.color}, 50%, 50%)`
        ctx.lineWidth = 3
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotation+(Math.PI/2))
        ctx.rect(-(this.width/2), -(this.height/2), this.width, this.height)
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // muzzle
        ctx.beginPath()
        ctx.save()
        ctx.fillStyle = `hsl(${this.color}, 50%, 40%)`
        ctx.strokeStyle = `hsl(${this.color}, 50%, 30%)`
        ctx.lineWidth = 2.5
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.muzzleRotation+(Math.PI/2))
        ctx.rect(-(this.width/3.5)/2, 0, this.width/3.5, this.width)
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // muzzle base
        ctx.beginPath()
        // ctx.save()
        // ctx.rotate(this.muzzleRotation)
        // ctx.translate(this.position.x, this.position.y)
        // ctx.restore()
        ctx.fillStyle = `hsl(${this.color}, 50%, 40%)`
        ctx.strokeStyle = `hsl(${this.color}, 50%, 30%)`
        ctx.lineWidth = 3
        ctx.arc(this.position.x, this.position.y, this.width/3, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()

        this.steer()
    }
    steer() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.steering.forward) {
            this.velocity.x = Math.cos(this.rotation) * 1
            this.velocity.y = Math.sin(this.rotation) * 1
        } else if (this.steering.backward) {
            this.velocity.x = -Math.cos(this.rotation) * 1
            this.velocity.y = -Math.sin(this.rotation) * 1
        } else {
            this.velocity.y = 0
            this.velocity.x = 0
        }

        if (this.steering.left) {
            this.rotation -= 0.02
        } else if (this.steering.right) {
            this.rotation += 0.02
        }
    }
}

class Enemy {
    constructor(x, y) {
        this.color = Math.random() * 255
        this.health = 100
        this.radius = 15
        this.velocity = {
            x: 0,
            y: 0
        }

        this.position = {
            x,
            y
        }
    }
    damage(n) {
        this.health -= n
    }
    draw() {
        ctx.beginPath()
        ctx.strokeStyle = `hsl(${this.color}, 50%, 30%)`
        ctx.fillStyle = `hsl(${this.color}, 50%, 50%)`
        ctx.lineWidth = 3
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}

class Bullet {
    constructor(tank) {
        // if (tank instanceof Tank) {}
        this.tank = tank
        this.radius = 5
        this.explosionRadius = 100
        this.alpha = 0.5
        this.detonate = false
        this.type
        this.traveled = 0
        this.originalPosition = {
            x: this.tank.position.x,
            y: this.tank.position.y
        }
        this.position = {
            x: this.tank.position.x-Math.cos(this.tank.muzzleRotation)*(this.tank.width-this.radius),
            y: this.tank.position.y-Math.sin(this.tank.muzzleRotation)*(this.tank.width-this.radius)
        }

        this.velocity = {
            x: -Math.cos(this.tank.muzzleRotation),
            y: -Math.sin(this.tank.muzzleRotation)
        }
    }
    draw() {
        if (!this.detonate) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
        this.traveled += Math.abs(Math.cos(this.velocity.x))
        this.traveled += Math.abs(Math.cos(this.velocity.y))
        if (!this.detonate) {
            ctx.beginPath()
            ctx.strokeStyle = `hsl(${this.tank.color}, 50%, 30%)`
            ctx.fillStyle = `hsl(${this.tank.color}, 50%, 50%)`
            ctx.lineWidth = 2
            ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
            ctx.fill()
            ctx.stroke()
        }

        if (this.position.x -this.radius + this.velocity.x <= 0 || this.position.x +this.radius + this.velocity.x >= canvas.width) {
            this.velocity.x = -this.velocity.x
        }
        if (this.position.y -this.radius + this.velocity.y <= 0 || this.position.y +this.radius + this.velocity.y >= canvas.height) {
            this.velocity.y = -this.velocity.y
        }

        // if (
        //     this.position.x + this.radius + this.velocity.x >= this.tank.position.x - (this.tank.width/2) + this.tank.velocity.x &&
        //     this.position.x - this.radius + this.velocity.x <= this.tank.position.x + (this.tank.width/2) + this.tank.velocity.x &&
        //     this.position.y + this.radius + this.velocity.y >= this.tank.position.y - (this.tank.height/2) + this.tank.velocity.y &&
        //     this.position.y - this.radius + this.velocity.y <= this.tank.position.y + (this.tank.height/2) + this.tank.velocity.y
        // ) {
        //     this.velocity.x = -this.velocity.x
        // }

        // if (this.position.x +this.radius + this.velocity.x >= this.tank.position.x - this.tank.width/2) {
        //     if (this.position.x -this.radius + this.velocity.x <= this.tank.position.x + this.tank.width/2) {
        //         this.velocity.x = -this.velocity.x
        //     }
        // }
        // if (this.position.y +this.radius + this.velocity.y >= this.tank.position.y - this.tank.height/2) {
        //     if (this.position.y -this.radius + this.velocity.y <= this.tank.position.y + this.tank.height/2) {
        //         this.velocity.y = -this.velocity.y
        //     }
        // }
    }
    explode() {
        this.alpha -= 0.006
        ctx.beginPath()
        ctx.save()
        ctx.globalAlpha = Math.max(this.alpha, 0)
        ctx.fillStyle = `hsl(${this.tank.color}, 50%, 50%)`
        ctx.arc(this.position.x, this.position.y, this.explosionRadius, 0, 2*Math.PI)
        ctx.fill()
        ctx.restore()
    }
}

const tank = new Tank(cw, ch)

let enemies = []
let bullets = []

setInterval(() => {
    enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * canvas.height))
}, 1000)

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, cw*2, ch*2)

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw()

        if (bullets[i].detonate) {
            bullets[i].explode()
        }

        if (bullets[i].alpha <= 0) {
            bullets.splice(i, 1)
            break
        }
        
        if (bullets[i].type == "hoaming") {
            let angle = Math.atan2(bullets[i].position.y - mouse.y, bullets[i].position.x - mouse.x)
            bullets[i].velocity.x = -Math.cos(angle)
            bullets[i].velocity.y = -Math.sin(angle)
        }

        if (bullets[i].traveled >= hud.fireModeProperties[hud.selectedMode].lifetime && !bullets[i].detonate) {
            if (bullets[i].type == "explosive") {
                bullets[i].detonate = true
            } else {
                if (bullets[i].detonate) break
                bullets.splice(i, 1)
                break
            }
        }

        let distance = Math.hypot(bullets[i].position.y - mouse.y, bullets[i].position.x - mouse.x)
        if (bullets[i].type == "hoaming" && distance <= bullets[i].radius/2) {
            bullets.splice(i, 1)
            break
        }

        for (let j = 0; j < enemies.length; j++) {
            let distance = Math.hypot(bullets[i].position.y - enemies[j].position.y, bullets[i].position.x - enemies[j].position.x)
            if (bullets[i].type == "explosive") {
                if (distance <= bullets[i].explosionRadius + enemies[j].radius && bullets[i].detonate) {
                    enemies[j].damage(100)
                } else if (distance <= bullets[i].radius + enemies[j].radius) {
                    bullets[i].detonate = true
                }
            } else {
                if (distance <= bullets[i].radius + enemies[j].radius) {
                    enemies[j].damage(100)
                    bullets.splice(i, 1)
                    break
                }
            }
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw()
        if (enemies[i].health <= 0) {
            enemies.splice(i, 1)
        }
    }

    let angle = Math.atan2(tank.position.y - mouse.y, tank.position.x - mouse.x)
    tank.muzzleRotation = angle
    
    tank.draw()
    hud.draw()
}

animate()

let cdInterval = setInterval(() => {
    if (tank.cd > 0) {
        tank.cd--
    }
}, 1)

function fireModeChange() {
    tank.cd = hud.fireModeProperties[hud.selectedMode].cd
}

addEventListener("mousemove", (e) => {
    mouse.x = e.x
    mouse.y = e.y
})

function fire() {
    if (tank.cd == 0) {
        let bullet
        switch (hud.fireModes[hud.selectedMode]) {
            case "Hoaming":
                tank.cd = hud.fireModeProperties[hud.selectedMode].cd
                bullet = new Bullet(tank)
                bullet.type = "hoaming"
                bullets.push(bullet)
                break;
            case "Single":
                tank.cd = hud.fireModeProperties[hud.selectedMode].cd
                bullets.push(new Bullet(tank))
                break;
            case "Burst":
                tank.cd = hud.fireModeProperties[hud.selectedMode].cd
                bullets.push(new Bullet(tank))
                setTimeout(() => {
                    bullets.push(new Bullet(tank))
                    setTimeout(() => {
                        bullets.push(new Bullet(tank))
                        setTimeout(() => {
                            bullets.push(new Bullet(tank))
                        }, 70)
                    }, 70)
                }, 70)
                break;
            case "Explosive":
                tank.cd = hud.fireModeProperties[hud.selectedMode].cd
                bullet = new Bullet(tank)
                bullet.type = "explosive"
                bullets.push(bullet)
                break;
            default:
                break;
        }
    }
}

addEventListener("click", () => {
    fire()
})

addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            tank.steering.forward = true
            break;
        case "s":
            tank.steering.backward = true
            break;
        case "a":
            tank.steering.left = true
            break;
        case "d":
            tank.steering.right = true
            break;
        case "1":
            if (hud.selectedMode != 0) {
                hud.selectedMode = 0
                fireModeChange()
            }
            break;
        case "2":
            if (hud.selectedMode != 1) {
                hud.selectedMode = 1
                fireModeChange()
            }
            break;
        case "3":
            if (hud.selectedMode != 2) {
                hud.selectedMode = 2
                fireModeChange()
            }
            break;
        case "4":
            if (hud.selectedMode != 3) {
                hud.selectedMode = 3
                fireModeChange()
            }
            break;
        default:
            break;
    }
})

addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            tank.steering.forward = false
            break;
        case "s":
            tank.steering.backward = false
            break;
        case "a":
            tank.steering.left = false
            break;
        case "d":
            tank.steering.right = false
            break;
        default:
            break;
    }
})