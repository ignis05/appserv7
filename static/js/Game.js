class Game {
    constructor(root) {
        this.board = this.generateBoard()
        this.pieces = this.generatePieces()
        console.table(this.pieces);
        this.root = root
        this.fieldGeometry = new THREE.BoxGeometry(50, 20, 50);
        this.fieldMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffff00, })
        this.fieldMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ffff, })
        this.pieceGeometry = new THREE.CylinderGeometry(20, 20, 20, 64);
        this.pieceMaterial1 = new THREE.MeshBasicMaterial({ color: 0x000000, })
        this.pieceMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000, })
        this.startGame(this.root)
    }
    generateBoard() {
        var tab = []
        for (var i = 0; i < 8; i++) {
            tab[i] = []
            for (var j = 0; j < 8; j++) {
                tab[i][j] = (j + (i % 2)) % 2
            }
        }
        return tab
    }
    generatePieces() {
        var tab = []
        for (var i = 0; i < 8; i++) {
            tab[i] = []
            for (var j = 0; j < 8; j++) {
                tab[i][j] = 0
                if (i == 0 && j % 2 == 0) {
                    tab[i][j] = 1
                }
                if (i == 1 && j % 2 == 1) {
                    tab[i][j] = 1
                }
                if (i == 6 && j % 2 == 0) {
                    tab[i][j] = 2
                }
                if (i == 7 && j % 2 == 1) {
                    tab[i][j] = 2
                }
            }
        }
        return tab
    }
    setCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(),   // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );
        this.camera.position.set(400, 200, 0)
        this.camera.lookAt(this.scene.position)

        $(window).on("resize", () => {
            this.camera.aspect = $(window).width() / $(window).height()
            this.camera.updateProjectionMatrix()
            this.renderer.setSize($(window).width(), $(window).height())
        })
    }
    setRenderer(root) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize($(window).width(), $(window).height());

        $(root).append(this.renderer.domElement);
    }
    addAxes() {
        var axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)
    }
    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
    }
    addBoard() {
        for (var i in this.board) {
            for (var j in this.board[i]) {
                var field
                if (this.board[i][j] == 1) {
                    field = new THREE.Mesh(this.fieldGeometry, this.fieldMaterial1)
                }
                else {
                    field = new THREE.Mesh(this.fieldGeometry, this.fieldMaterial2)
                }
                field.position.x = 50 * (i - 4) + 25
                field.position.z = 50 * (j - 4) + 25
                this.scene.add(field)
            }
        }
    }
    addPieces() {
        for (var i in this.pieces) {
            for (var j in this.pieces[i]) {
                if (this.pieces[i][j] != 0) {
                    var piece
                    if (this.pieces[i][j] == 2) {
                        piece = new THREE.Mesh(this.pieceGeometry, this.pieceMaterial1)
                    }
                    if (this.pieces[i][j] == 1) {
                        piece = new THREE.Mesh(this.pieceGeometry, this.pieceMaterial2)
                    }
                    piece.position.x = 50 * (i - 4) + 25
                    piece.position.z = 50 * (j - 4) + 25
                    piece.position.y = 10
                    this.scene.add(piece)
                }
            }
        }
    }
    enableOrbitControl() {
        var orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        orbitControl.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera)
        });
    }
    startGame(root) {
        this.scene = new THREE.Scene();

        this.setCamera()

        this.setRenderer(root)

        this.addAxes()

        this.addBoard()

        this.addPieces()

        this.enableOrbitControl()

        this.render()
    }

}