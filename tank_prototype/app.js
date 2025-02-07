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

let paused = false
let tankcd = 0

class Hud {
    constructor() {
        this.margin = 15
        this.usd = 0
        this.fireModes = ["Homing", "Single", "Burst", "Explosive"]
        this.fireModeProperties = [{cd: 500, lifetime: 1500}, {cd: 250, lifetime: 750}, {cd: 500, lifetime: 550}, {cd: 700, lifetime: 400}]
        this.selectedMode = 1
    }
    drawUSD() {
        // FREEDOM DOLLAR
        ctx.beginPath()
        ctx.save()
        ctx.font = "35px sans-serif"
        ctx.fillStyle = "#fff"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillText(this.usd, this.margin, this.margin)
        ctx.restore()
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
        this.drawUSD()
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

        this.bullet = {
            speed: 1,
            explosionRadius: 100
        }

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
    upgrade(value, n) {
        switch (value) {
            case "speed":
                this.bullet.speed += n
                break;
            case "explosion radius":
                this.bullet.explosionRadius += n
                break;
            default:
                break;
        }
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
    constructor(tank, type) {
        this.speed = tank.bullet.speed
        this.lifetime = hud.fireModeProperties[hud.selectedMode].lifetime

        this.type = type
        this.tank = tank
        this.radius = 5
        this.explosionRadius = tank.bullet.explosionRadius
        this.alpha = 0.5
        this.detonate = false
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
            x: -Math.cos(this.tank.muzzleRotation) * this.speed,
            y: -Math.sin(this.tank.muzzleRotation) * this.speed
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

class Panel {
    constructor(title) {
        this.title = title
        this.width = canvas.width/1.5
        this.height = canvas.height/1.5
        this.upgrades = 0
    }
    upgrade() {
        this.upgrades++

    }
    draw() {
        // box
        ctx.beginPath()
        ctx.save()
        ctx.translate((canvas.width/2)-this.width/2, (canvas.height/2)-this.height/2)
        ctx.fillStyle = "#101010"
        ctx.strokeStyle = "#515151"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.font = "24px sans-serif"
        ctx.rect(0, 0, this.width, this.height)
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // text
        ctx.beginPath()
        ctx.save()
        ctx.translate((canvas.width/2)-this.width/2, (canvas.height/2)-this.height/2)
        ctx.fillStyle = "#fff"
        ctx.strokeStyle = "#515151"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.font = "24px sans-serif"
        ctx.fillText(this.title, 15, 15)
        ctx.restore()

        for (let i = 0; i < this.upgrades; i++) {
            ctx.beginPath()
            ctx.save()
            ctx.translate((canvas.width/2)-this.width/2, (canvas.height/2)-this.height/2)
            ctx.lineWidth = 1
            ctx.fillStyle = "#fff"
            ctx.textAlign = "left"
            ctx.textBaseline = "top"
            ctx.font = "15px sans-serif"
            ctx.rect(15, 75+(i*50), 75, 25)
            ctx.fillText("upgrade", 15, 75+(i*50))
            ctx.fillText("upgrade", 15, 75+(i*50))
            ctx.stroke()
            ctx.restore()
        }
    }
}

const tank = new Tank(cw, ch)

let panels = []
let enemies = []
let bullets = []

let spawndelay = 0

function pause() {
    paused = true
}

function unpause() {
    paused = false
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, cw*2, ch*2)

    for (let i = 0; i < panels.length; i++) {
        panels[i].draw()
    }

    if (!paused) {
        if (tank.cd > 0) {
            tank.cd--
        }

        spawndelay++
        if (spawndelay >= 200) {
            spawndelay = 0
            enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * canvas.height))
        }

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].draw()

            if (bullets[i].detonate) {
                bullets[i].explode()
            }

            if (bullets[i].alpha <= 0) {
                bullets.splice(i, 1)
                break
            }
            
            if (bullets[i].type == "Homing") {
                let angle = Math.atan2(bullets[i].position.y - mouse.y, bullets[i].position.x - mouse.x)
                bullets[i].velocity.x = -Math.cos(angle)
                bullets[i].velocity.y = -Math.sin(angle)
            }

            if (bullets[i].traveled >= bullets[i].lifetime && !bullets[i].detonate) {
                if (bullets[i].type == "explosive") {
                    bullets[i].detonate = true
                } else {
                    if (bullets[i].detonate) break
                    bullets.splice(i, 1)
                    break
                }
            }

            let distance = Math.hypot(bullets[i].position.y - mouse.y, bullets[i].position.x - mouse.x)
            if (bullets[i].type == "Homing" && distance <= bullets[i].radius/2) {
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
                hud.usd += 100
            }
        }

        let angle = Math.atan2(tank.position.y - mouse.y, tank.position.x - mouse.x)
        tank.muzzleRotation = angle
        
        tank.draw()
        hud.draw()
    }
}

requestAnimationFrame(animate)

function fireModeChange() {
    tank.cd = hud.fireModeProperties[hud.selectedMode].cd
}

addEventListener("mousemove", (e) => {
    mouse.x = e.x
    mouse.y = e.y
})

function fire() {
    if (tank.cd == 0 && !paused) {
        switch (hud.fireModes[hud.selectedMode]) {
            case "Homing":
                fireModeChange()
                bullets.push(new Bullet(tank, "Homing"))
                break;
            case "Single":
                fireModeChange()
                bullets.push(new Bullet(tank, "single"))
                break;
            case "Burst":
                fireModeChange()
                bullets.push(new Bullet(tank, "burst"))
                setTimeout(() => {
                    bullets.push(new Bullet(tank, "burst"))
                    setTimeout(() => {
                        bullets.push(new Bullet(tank, "burst"))
                        setTimeout(() => {
                            bullets.push(new Bullet(tank, "burst"))
                        }, 70)
                    }, 70)
                }, 70)
                break;
            case "Explosive":
                fireModeChange()
                bullets.push(new Bullet(tank, "explosive"))
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
            break
        case "s":
            tank.steering.backward = true
            break
        case "a":
            tank.steering.left = true
            break
        case "d":
            tank.steering.right = true
            break
        case "1":
            if (hud.selectedMode != 0) {
                hud.selectedMode = 0
                fireModeChange()
            }
            break
        case "2":
            if (hud.selectedMode != 1) {
                hud.selectedMode = 1
                fireModeChange()
            }
            break
        case "3":
            if (hud.selectedMode != 2) {
                hud.selectedMode = 2
                fireModeChange()
            }
            break
        case "4":
            if (hud.selectedMode != 3) {
                hud.selectedMode = 3
                fireModeChange()
            }
            break
        case "Escape":
            if (panels.length >= 1) {
                panels.splice(0, 1)
                unpause()
            } else {
                let panel = new Panel("Upgrade shop")
                panel.upgrade()
                panels.push(panel)
                pause()
            }
            break
        default:
            break
    }
})

addEventListener("keyup", (e) => {
    switch (e.key) {
        case "w":
            tank.steering.forward = false
            break
        case "s":
            tank.steering.backward = false
            break
        case "a":
            tank.steering.left = false
            break
        case "d":
            tank.steering.right = false
            break
        default:
            break
    }
})