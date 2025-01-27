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
        this.fireModes = ["Hoaming", "Single", "Burst"]
        this.fireModeProperties = [{cd: 500, lifetime: 1500}, {cd: 250, lifetime: 750}, {cd: 500, lifetime: 550}]
        this.selectedMode = 0
    }
    drawFireCD() {
        let width = 150
        let height = 25
        let widthPercentage = tankcd/this.fireModeProperties[this.selectedMode].cd
        ctx.beginPath()
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

class Bullet {
    constructor(tank) {
        // if (tank instanceof Tank) {}
        this.tank = tank
        this.radius = 5
        this.hoaming = false
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
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.traveled += Math.abs(this.velocity.x) + Math.abs(this.velocity.y)
        ctx.beginPath()
        ctx.strokeStyle = `hsl(${this.tank.color}, 50%, 30%)`
        ctx.fillStyle = `hsl(${this.tank.color}, 50%, 50%)`
        ctx.lineWidth = 2
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()

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
}

const tank = new Tank(cw, ch)
let bullets = []

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, cw*2, ch*2)
    
    bullets.forEach(bullet => {
        // if (isPointInsideRotatedRectangle(bullet, tank)) {
            // bullets.splice(bullet, 1)
            // console.log("boom")
        // }
        if (bullet.hoaming) {
            let angle = Math.atan2(bullet.position.y - mouse.y, bullet.position.x - mouse.x)
            bullet.velocity.x = -Math.cos(angle)
            bullet.velocity.y = -Math.sin(angle)
        }

        if (bullet.traveled >= hud.fireModeProperties[hud.selectedMode].lifetime) {
            bullets.splice(bullet, 1)
        }

        bullet.draw()
    })

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

addEventListener("click", (e) => {
    if (tank.cd == 0) {
        switch (hud.fireModes[hud.selectedMode]) {
            case "Hoaming":
                tank.cd = hud.fireModeProperties[hud.selectedMode].cd
                let bullet = new Bullet(tank)
                bullet.hoaming = true
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
            default:
                break;
        }
    }
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
                fireModeChange()
                hud.selectedMode = 0
            }
            break;
        case "2":
            if (hud.selectedMode != 1) {
                fireModeChange()
                hud.selectedMode = 1
            }
            break;
        case "3":
            if (hud.selectedMode != 2) {
                fireModeChange()
                hud.selectedMode = 2
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