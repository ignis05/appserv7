class Game {
    constructor(root) {
        this.board = this.generateBoard() // generates 2d array
        this.pieces = this.generatePieces() // generates 2d array

        this.root = root // div to render tree.js inside

        // #region materials and geometries
        this.fieldGeometry = new THREE.BoxGeometry(50, 20, 50);
        this.fieldMaterial1 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/mats/wood.png"),
            color: 0xffff00,
        })
        this.fieldMaterial2 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("/static/mats/wood.png"),
            color: 0x00ffff,
        })
        // #endregion materials and geometries

        this.startGame(this.root) // starts 3d display in root div
    }
    generateBoard() { // generates 2d array reflecting board
        var tab = []
        for (var i = 0; i < 8; i++) {
            tab[i] = []
            for (var j = 0; j < 8; j++) {
                tab[i][j] = (j + (i % 2)) % 2
            }
        }
        return tab
    }
    generatePieces() { // generates 2d array reflecting pieces on board
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
    setCamera() { // creates camera
        this.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(),   // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );
        this.camera.position.set(500, 400, 0)
        this.camera.lookAt(this.scene.position)

        $(window).on("resize", () => {
            this.camera.aspect = $(window).width() / $(window).height()
            this.camera.updateProjectionMatrix()
            this.renderer.setSize($(window).width(), $(window).height())
        })
    }
    setRenderer(root) { // creates renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize($(window).width(), $(window).height());

        $(root).append(this.renderer.domElement);
    }
    addAxes() { // creates helper displaying xyz-axes
        var axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)
    }
    // render = () => { // function rendering changes (syntax works only in chrome)
    //     requestAnimationFrame(this.render);
    //     this.renderer.render(this.scene, this.camera);
    // }
    addBoard() { // generates 3d gameboard display using this.board array
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
    addPieces() { // generates 3d pieces on gameboard using this.pieces array
        for (var i in this.pieces) {
            for (var j in this.pieces[i]) {
                if (this.pieces[i][j] != 0) {
                    var piece
                    if (this.pieces[i][j] == 2) {
                        piece = new Piece(0xff0000)
                    }
                    if (this.pieces[i][j] == 1) {
                        piece = new Piece(0x000000)
                    }
                    piece.position.x = 50 * (i - 4) + 25
                    piece.position.z = 50 * (j - 4) + 25
                    piece.position.y = 10
                    this.scene.add(piece)
                }
            }
        }
    }
    enableOrbitControl() { // enables orbit controls of display
        var orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        orbitControl.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera)
        });
    }
    startGame(root) { // creates 3d components
        this.scene = new THREE.Scene();

        this.setCamera()

        this.setRenderer(root)

        this.addAxes()

        this.addBoard()

        this.addPieces()

        this.enableOrbitControl()

        var render = () => { // function rendering changes 
            requestAnimationFrame(render);
            this.renderer.render(this.scene, this.camera);
        }
        render()
    }
    flipCamera() { // flips camera on x-asis (used for player 2)
        this.camera.position.x = - this.camera.position.x
        this.camera.lookAt(this.scene.position)
    }
}