const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// Classes
class Body {
    constructor(radius, mass) {
        this.radius = radius
        this.mass = mass
        this.color = '#fff'
        this.alpha = '0.5'

        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 0
        }
    }

    render() {
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
    }

    update() {
        this.render()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

let allowAngleChange = false
let allowMovement = true
let renderOrbitCircle = false
let showCenterLine = false
let autoVelocity = true
let alwaysShowCircle = false
let rapidFire = false
let spawnCenterBody = false
const G = 8

let point
let orbiters = []

if (spawnCenterBody) {
    centerBody()
}

function centerBody() {
    point = new Body(25, 100)
    point.alpha = '0.2'
    point.position.x = canvas.width / 2
    point.position.y = canvas.height / 2
}

function createOrbiter() {
    let orbiter = new Body(5, 5);
    orbiter.position.x = mouse.x;
    orbiter.position.y = mouse.y;

    if (autoVelocity && spawnCenterBody) {
        // Calculate the radius vector from central point to orbiter
        let dx = orbiter.position.x - point.position.x
        let dy = orbiter.position.y - point.position.y
    
        // Calculate the magnitude of the radius vector
        let radius = Math.sqrt(dx * dx + dy * dy);
    
        // Calculate the initial velocity magnitude for a circular orbit
        let v = Math.sqrt((G * point.mass) / radius) * (Math.PI / 1.4)
    
        // Calculate the initial velocity components perpendicular to the radius
        orbiter.velocity.x = -(dy / radius) * (v / orbiter.mass)
        orbiter.velocity.y = (dx / radius) * (v / orbiter.mass)
    } else {
        // implement
    }

    orbiters.push(orbiter);
}

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y

    if (allowAngleChange) {
        let d = Math.hypot(point.position.y - e.y, point.position.x - e.x)
        let angle = Math.atan2((point.position.y) - e.y, (point.position.x) - e.x)
        point.velocity.x = -Math.cos(angle)
        point.velocity.y = -Math.sin(angle)
    }
})

addEventListener('keydown', (e) => {
    if (e.key === 'N' || e.key === 'n') {
        renderOrbitCircle = true
    }

    if (e.key === 'S' || e.key === 's') {
        allowMovement = !allowMovement
        point.velocity.x = 0
        point.velocity.y = 0
    }

    if (e.key === 'Escape') {
        renderOrbitCircle = false
    }

    if (e.key === 'L' || e.key === 'l') {
        showCenterLine = !showCenterLine
    }

    if (e.key === 'F' || e.key === 'f') {
        autoVelocity = !autoVelocity
    }

    if (e.key === 'C' || e.key === 'c') {
        alwaysShowCircle = !alwaysShowCircle
    }

    if (e.key === 'R' || e.key === 'r') {
        rapidFire = !rapidFire

        if (rapidFire) {
            addEventListener('mousemove', createOrbiter)
        } else {
            removeEventListener('mousemove', createOrbiter)
        }
    }
})

addEventListener('keyup', (e) => {
    if (e.key === 'N' || e.key === 'n') {
        createOrbiter()
        renderOrbitCircle = false;
    }
})

addEventListener('click', (e) => {
    if (spawnCenterBody) {
        allowAngleChange = !allowAngleChange
    }
})

let starting_velocity = 4
let starting_position = 200
let starting_mass = 150
let starting_position_corners = starting_position - (starting_mass / 2)

orbiters.push(new Body(10, starting_mass))
orbiters[0].position.x = canvas.width / 2 - starting_position
orbiters[0].position.y = canvas.height / 2
orbiters[0].velocity.y -= starting_velocity

orbiters.push(new Body(10, starting_mass))
orbiters[1].position.x = canvas.width / 2 + starting_position
orbiters[1].position.y = canvas.height / 2
orbiters[1].velocity.y += starting_velocity

orbiters.push(new Body(10, starting_mass))
orbiters[2].position.x = canvas.width / 2
orbiters[2].position.y = canvas.height / 2 - starting_position
orbiters[2].velocity.x += starting_velocity

orbiters.push(new Body(10, starting_mass))
orbiters[3].position.x = canvas.width / 2
orbiters[3].position.y = canvas.height / 2 + starting_position
orbiters[3].velocity.x -= starting_velocity

orbiters.push(new Body(10, starting_mass))
orbiters[4].position.x = canvas.width / 2 - starting_position_corners
orbiters[4].position.y = canvas.height / 2 - starting_position_corners
orbiters[4].velocity.x += starting_velocity / 2
orbiters[4].velocity.y -= starting_velocity / 2

orbiters.push(new Body(10, starting_mass))
orbiters[5].position.x = canvas.width / 2 - starting_position_corners
orbiters[5].position.y = canvas.height / 2 + starting_position_corners
orbiters[5].velocity.x -= starting_velocity / 2
orbiters[5].velocity.y -= starting_velocity / 2

orbiters.push(new Body(10, starting_mass))
orbiters[6].position.x = canvas.width / 2 + starting_position_corners
orbiters[6].position.y = canvas.height / 2 - starting_position_corners
orbiters[6].velocity.x += starting_velocity / 2
orbiters[6].velocity.y += starting_velocity / 2

orbiters.push(new Body(10, starting_mass))
orbiters[7].position.x = canvas.width / 2 + starting_position_corners
orbiters[7].position.y = canvas.height / 2 + starting_position_corners
orbiters[7].velocity.x -= starting_velocity / 2
orbiters[7].velocity.y += starting_velocity / 2

// to remove gray marks when not using clearRect
// ctx.fillStyle = '#fff'
// ctx.fillRect(0, 0, canvas.width, canvas.height)

function animate() {
    requestAnimationFrame(animate)
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (renderOrbitCircle && spawnCenterBody || alwaysShowCircle && spawnCenterBody || renderOrbitCircle && spawnCenterBody || rapidFire && spawnCenterBody) {
        let d = Math.hypot(point.position.y - mouse.y, point.position.x - mouse.x)
    
        ctx.beginPath()
        ctx.strokeStyle = '#fff'
        ctx.arc(point.position.x, point.position.y, d, 0, 2 * Math.PI)
        ctx.stroke()
    }

    if (showCenterLine && spawnCenterBody) {
        ctx.beginPath()
        ctx.strokeStyle = '#fff'
        ctx.moveTo(point.position.x, point.position.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
        ctx.closePath()
    }
    
    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.font = "16px serif";
    ctx.fillText(`BUGGED -> Stop (S)`, 0, 16)
    ctx.fillText(`Show line to center (L): ${showCenterLine}`, 0, 32)
    ctx.fillText(`Click toggle: ${allowAngleChange}`, 0, 48)
    ctx.fillText(`Fixed starting velocity (F): ${autoVelocity}`, 0, 64)
    ctx.fillText(`Always show orbit circle (C): ${alwaysShowCircle}`, 0, 80)
    ctx.fillText(`Toggle rapid fire (R): ${rapidFire}`, 0, 96)
    ctx.fillText(`Orbiters: ${orbiters.length}`, 0, 112)
    ctx.closePath()
    
    if (spawnCenterBody) {
        ctx.beginPath()
        ctx.strokeStyle = '#ff00ff'
        ctx.moveTo(point.position.x, point.position.y)
        ctx.lineTo(point.position.x + (point.velocity.x * 64), point.position.y + (point.velocity.y * 64))
        ctx.stroke()
        ctx.closePath()

        point.update()
    }

    orbiters.forEach(orbiter => {
        // ctx.beginPath()
        // ctx.strokeStyle = '#fff'
        // ctx.moveTo(point.position.x, point.position.y)
        // ctx.lineTo(orbiter.position.x, orbiter.position.y)
        // ctx.stroke()
        // ctx.closePath()

        orbiter.update()
        if (spawnCenterBody) {
            let d = Math.hypot(point.position.y - orbiter.position.y, point.position.x - orbiter.position.x)
            let angle = Math.atan2(point.position.y - orbiter.position.y, point.position.x - orbiter.position.x)
            let force = G * ((point.mass * orbiter.mass) / Math.pow(d, 2))
            orbiter.velocity.x += Math.cos(angle) * force
            orbiter.velocity.y += Math.sin(angle) * force
        }
    })
    
    orbiters.forEach(orbiter => {
        orbiters.forEach(nextOrbiter => {
            if (orbiters[orbiter] == orbiters[nextOrbiter]) {} else {
                let d1 = Math.hypot(nextOrbiter.position.y - orbiter.position.y, nextOrbiter.position.x - orbiter.position.x)
                let angle1 = Math.atan2(nextOrbiter.position.y - orbiter.position.y, nextOrbiter.position.x - orbiter.position.x)
                let force1 = G * ((nextOrbiter.mass * orbiter.mass) / Math.pow(d1, 2))

                orbiter.velocity.x += Math.cos(angle1) * force1
                orbiter.velocity.y += Math.sin(angle1) * force1

                nextOrbiter.velocity.x += Math.cos(angle1) * force1
                nextOrbiter.velocity.y += Math.sin(angle1) * force1
            }
        })
    })

    for (let i = 0; i < orbiters.length; i++) {
        for (let j = 0; j < orbiters.length; j++) {
            if (i !== j) {
                let distance = Math.hypot(orbiters[j].position.x - orbiters[i].position.x, orbiters[j].position.y - orbiters[i].position.y);
                let force = (G * orbiters[j].mass * orbiters[i].mass) / (distance ** 2);
                let angle = Math.atan2(orbiters[j].position.y - orbiters[i].position.y, orbiters[j].position.x - orbiters[i].position.x);

                orbiters[i].velocity.x += Math.cos(angle) * (force / orbiters[i].mass);
                orbiters[i].velocity.y += Math.sin(angle) * (force / orbiters[i].mass);
            }
        }
    }
}

animate()