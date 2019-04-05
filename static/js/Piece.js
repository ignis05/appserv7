class Piece extends THREE.Mesh {
    constructor(color, username, x, y) {
        let pieceGeometry = new THREE.CylinderGeometry(20, 20, 20, 64);
        let pieceMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/mats/wood.png"),
            color: color,
        })
        super(pieceGeometry, pieceMaterial)
        this.owner = username
        this.posX = x
        this.posY = y
        this.position.x = 50 * (x - 4) + 25
        this.position.z = 50 * (y - 4) + 25
        this.position.y = 10
    }
}