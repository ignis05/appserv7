class Piece extends THREE.Mesh {
    constructor(color, username) {
        let pieceGeometry = new THREE.CylinderGeometry(20, 20, 20, 64);
        let pieceMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/mats/wood.png"),
            color: color,
        })
        super(pieceGeometry, pieceMaterial)
        this.owner = username
    }
}