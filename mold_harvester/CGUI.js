export class Button {
    constructor(text, x, y, w, h) {
        this.text = text
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.padding = 15
        this.font = "20px sans-serif"
        this.textBaseline = "middle"
        this.textAlign = "left"
    }
    render(canvas) {
        let ctx = canvas.getContext('2d')

        ctx.save()
        ctx.beginPath()
        ctx.font = this.font
        ctx.textBaseline = this.textBaseline
        ctx.textAlign = this.textAlign
        ctx.fillStyle = "#fff"
        let textMeasures = ctx.measureText(this.text)
        this.w = textMeasures.width + this.padding*2
        ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.fillStyle = "#000"
        ctx.fillText(this.text, this.x + this.padding, this.y + (this.h/2))
        ctx.restore()
    }
    isInBoundingBox(e) {
        return (e.x>=this.x&&e.x<=this.x+this.w&&e.y>=this.y&&e.y<=this.y+this.h)
    }
}