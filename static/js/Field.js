class Field extends THREE.Mesh {
    constructor(color, x, y) {
        var fieldGeometry = new THREE.BoxGeometry(50, 20, 50);
        var fieldMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/mats/wood.png"),
            color: color,
        })
        super(fieldGeometry, fieldMaterial)
        this.color = color
        this.posX = x
        this.posY = y
        this.position.x = 50 * (x - 4) + 25
        this.position.z = 50 * (y - 4) + 25
    }
}