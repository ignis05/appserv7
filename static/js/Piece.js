class Piece extends THREE.Mesh {
    constructor(color) {
        let pieceGeometry = new THREE.CylinderGeometry(20, 20, 20, 64);
        let pieceMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/mats/wood.png"),
            color: color,
        })
        super(pieceGeometry, pieceMaterial)
    }
}