class Game {
    constructor(root) {
        this.myTurn = false
        this.boardTab = this.generateBoardTab() // generates 2d array
        this.piecesTab = this.generatePiecesTab() // generates 2d array

        this.pieces = [] // tab for pieces Class elements
        this.activePiece;

        this.board = []
        this.activeField

        this.validMoveFiels = []

        this.root = root // div to render tree.js inside

        this.startGame(this.root) // starts 3d display in root div
        this.addRaycasterListeners()
    }
    async startFirst() {
        await Net.sendBoard(session.color, this.piecesTab)
        this.myTurn = true
        console.log("TCL: Game -> startFirst -> this.myTurn", this.myTurn)
    }
    async startSecond(restart) { // restart is true if restarting session
        this.myTurn = false
        console.log("TCL: Game -> startSecond -> this.myTurn", this.myTurn)
        await Net.sendBoard(session.color, this.piecesTab)
        let response = await Net.wait(session.username, "getBoard")
        if (restart) {
            await Net.sendBoard(session.color, this.piecesTab)
            response = await Net.wait(session.username, "getBoard")
        }
        this.piecesTab = response.board
        this.renderPieces()
        this.myTurn = true
        console.log("TCL: Game -> startSecond -> this.myTurn", this.myTurn)
    }
    addRaycasterListeners() {
        $("#root").on("click", () => {
            if (this.myTurn) {
                if (this.activePiece && this.activeField)
                    this.raycasterMove()
                this.raycasterPiece()
            }
        })
        $("#root").on("mousemove", () => {
            if (this.myTurn) {
                if (this.activePiece) {
                    this.raycasterField()
                }
            }
        })
    }
    generateBoardTab() { // generates 2d array reflecting board
        var tab = []
        for (var i = 0; i < 8; i++) {
            tab[i] = []
            for (var j = 0; j < 8; j++) {
                tab[i][j] = (j + (i % 2)) % 2
            }
        }
        return tab
    }
    generatePiecesTab() { // generates 2d array reflecting piecesTab on board
        var tab = []
        for (var i = 0; i < 8; i++) {
            tab[i] = []
            for (var j = 0; j < 8; j++) {
                tab[i][j] = 0
                if (i == 0 && j % 2 == 0) {
                    tab[i][j] = 2
                }
                if (i == 1 && j % 2 == 1) {
                    tab[i][j] = 2
                }
                if (i == 6 && j % 2 == 0) {
                    tab[i][j] = 1
                }
                if (i == 7 && j % 2 == 1) {
                    tab[i][j] = 1
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
    deactivateField() {
        if (this.activeField) {
            let _field = new Field(0x00ff00, this.activeField.posX, this.activeField.posY)
            this.board[this.board.indexOf(this.activeField)] = _field
            this.validMoveFiels[this.validMoveFiels.indexOf(this.activeField)] = _field
            this.scene.remove(this.activeField)
            this.scene.add(_field)
            this.activeField = undefined
        }
    }
    deactivatePiece() {
        let _piece = new Piece((session.color == 1 ? 0xff0000 : 0x000000), session.username, this.activePiece.posX, this.activePiece.posY)
        this.pieces[this.pieces.indexOf(this.activePiece)] = _piece
        this.scene.remove(this.activePiece)
        this.scene.add(_piece)
        this.activePiece = undefined
        this.deactivateField()
        for (let field of this.validMoveFiels) { // restore gren fields colors
            this.scene.remove(field) // delete from scene
            let _field = new Field((this.boardTab[parseInt(field.posX)][parseInt(field.posY)] == 1 ? 0xa59a93 : 0x8c4010), field.posX, field.posY) // new green field
            _field.position.copy(field.position) // set position
            this.scene.add(_field)
            this.board[this.board.indexOf(field)] = _field // replace in array
        }
        this.validMoveFiels = []
    }
    setRaycaster() {
        // raycaster
        this.raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
        this.mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) 
    }
    async raycasterMove() {
        console.log('moving');
        let piece = this.activePiece
        let field = this.activeField

        if (Math.abs(parseInt(piece.posX) - parseInt(field.posX)) > 1) { // actually need to check only one dimension
            console.log('zbijanie');
            console.log(piece.posX, piece.posY);
            console.log(field.posX, field.posY);
            let toRemoveX = (parseInt(piece.posX) + parseInt(field.posX)) / 2
            let toRemoveY = (parseInt(piece.posY) + parseInt(field.posY)) / 2
            console.log(toRemoveX, toRemoveY);
        }

        this.piecesTab[field.posX][field.posY] = this.piecesTab[piece.posX][piece.posY]
        this.piecesTab[piece.posX][piece.posY] = 0
        this.activePiece = undefined
        this.renderPieces()
        this.deactivateField()
        for (let field of this.validMoveFiels) { // restore gren fields colors
            this.scene.remove(field) // delete from scene
            let _field = new Field((this.boardTab[parseInt(field.posX)][parseInt(field.posY)] == 1 ? 0xa59a93 : 0x8c4010), field.posX, field.posY) // new green field
            _field.position.copy(field.position) // set position
            this.scene.add(_field)
            this.board[this.board.indexOf(field)] = _field // replace in array
        }
        this.validMoveFiels = []
        this.myTurn = false
        console.log("TCL: Game -> raycasterMove -> this.myTurn", this.myTurn)
        await Net.sendBoard(session.color, this.piecesTab)
        let response = await Net.wait(session.username, "getBoard")
        this.piecesTab = response.board
        this.renderPieces()
        this.myTurn = true
        console.log("TCL: Game -> raycasterMove -> this.myTurn", this.myTurn)
    }
    raycasterField() {
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        var intersects = this.raycaster.intersectObjects(this.board); // only valid fields

        // this.activeField
        if (intersects.length > 0) {

            let field = intersects[0].object
            if (this.validMoveFiels.find(f => f == field)) {
                if (field.color != 16776960) { // if not already highlighted
                    console.log('here');
                    this.scene.remove(field) // delete from scene

                    let _field = new Field(0xffff00, field.posX, field.posY) // new yellow field
                    _field.position.copy(field.position) // set position
                    this.scene.add(_field)
                    this.board[this.board.indexOf(field)] = _field // replace in array
                    this.validMoveFiels[this.validMoveFiels.indexOf(field)] = _field
                    this.activeField = _field
                }
            }
            else {
                console.log('there');
                this.deactivateField()
            }
        }

    }
    raycasterPiece() {
        this.mouseVector.x = (event.clientX / $(window).width()) * 2 - 1
        this.mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1
        this.raycaster.setFromCamera(this.mouseVector, this.camera);

        var intersects = this.raycaster.intersectObjects(this.pieces); // only pieces

        if (this.activePiece && intersects.length > 0 && intersects[0].object == this.activePiece) {
            console.log("clicked active piece");
            this.deactivatePiece()
            return
        }

        if (this.activePiece) { // change activePiece to normal color
            this.deactivatePiece()
        }

        if (intersects.length > 0 && intersects[0].object.owner == session.username) {
            let piece = intersects[0].object
            console.log("activating");

            this.scene.remove(piece) // delete from scene

            let _piece = new Piece(0xffff00, session.username, piece.posX, piece.posY) // new yellow piece
            this.scene.add(_piece)
            this.pieces[this.pieces.indexOf(piece)] = _piece // replace in array
            this.activePiece = _piece
            this.highlightFields()
        }
    }
    checkMove(field) {
        console.log(`field: x:${field.posX}, y:${field.posY}`);
        // check alredy taken by piece
        if (this.pieces.find(piece => piece.posX == field.posX && piece.posY == field.posY && piece.owner == session.username)) return false

        console.log(`piece: x:${this.activePiece.posX}, y:${this.activePiece.posY}`);
        let dist = Math.sqrt((field.posX - this.activePiece.posX) * (field.posX - this.activePiece.posX) + (field.posY - this.activePiece.posY) * (field.posY - this.activePiece.posY))
        console.log(`dist: ${dist}`);
        if (dist > 0 && dist < 2)
            return true
        return false
    }
    highlightFields() {
        if (!this.activePiece) return
        console.log(this.activePiece);
        // console.log(this.piecesTab);
        let x = parseInt(this.activePiece.posX)
        let y = parseInt(this.activePiece.posY)
        // console.log(x, y);
        this.validMoveFiels = []

        if (session.color == 1) {
            // field 1 
            if (this.piecesTab[x - 1] && this.piecesTab[x - 1][y - 1] === 0) {
                console.log('field 1 ok');
                let piece = this.board.find(piece => piece.posX == x - 1 && piece.posY == y - 1)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 1 bad');
            // field 2 
            if (this.piecesTab[x - 1] && this.piecesTab[x - 1][y + 1] === 0) {
                console.log('field 2 ok');
                let piece = this.board.find(piece => piece.posX == x - 1 && piece.posY == y + 1)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 2 bad');

            // field 1 long
            if (this.piecesTab[x - 1] && this.piecesTab[x - 1][y - 1] === 2 && this.piecesTab[x - 2] && this.piecesTab[x - 2][y - 2] == 0) {
                console.log('field 1 long ok');
                let piece = this.board.find(piece => piece.posX == x - 2 && piece.posY == y - 2)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 1 long bad');
            // field 2 long
            if (this.piecesTab[x - 1] && this.piecesTab[x - 1][y + 1] === 2 && this.piecesTab[x - 2] && this.piecesTab[x - 2][y + 2] == 0) {
                console.log('field 2 long ok');
                let piece = this.board.find(piece => piece.posX == x - 2 && piece.posY == y + 2)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 2 long bad');
        }
        if (session.color == 2) {
            // field 3
            if (this.piecesTab[x + 1] && this.piecesTab[x + 1][y - 1] === 0) {
                console.log('field 3 ok');
                let piece = this.board.find(piece => piece.posX == x + 1 && piece.posY == y - 1)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 3 bad');
            // field 4 
            if (this.piecesTab[x + 1] && this.piecesTab[x + 1][y + 1] === 0) {
                console.log('field 4 ok');
                let piece = this.board.find(piece => piece.posX == x + 1 && piece.posY == y + 1)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 4 bad');
            // field 3 long
            if (this.piecesTab[x + 1] && this.piecesTab[x + 1][y - 1] === 1 && this.piecesTab[x + 2] && this.piecesTab[x + 2][y - 2] == 0) {
                console.log('field 3 long ok');
                let piece = this.board.find(piece => piece.posX == x + 2 && piece.posY == y - 2)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 3 long bad');
            // field 4 long
            if (this.piecesTab[x + 1] && this.piecesTab[x + 1][y + 1] === 1 && this.piecesTab[x + 2] && this.piecesTab[x + 2][y + 2] == 0) {
                console.log('field 4 long ok');
                let piece = this.board.find(piece => piece.posX == x + 2 && piece.posY == y + 2)
                this.validMoveFiels.push(piece)
            }
            else console.log('field 4 long bad');
        }

        // console.log(this.validMoveFiels);

        for (let field of this.validMoveFiels) {
            this.scene.remove(field) // delete from scene
            let _field = new Field(0x00ff00, field.posX, field.posY) // new green field
            _field.position.copy(field.position) // set position
            this.scene.add(_field)
            this.board[this.board.indexOf(field)] = _field // replace in array
            this.validMoveFiels[this.validMoveFiels.indexOf(field)] = _field // replace in array
        }
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
    renderBoard() { // generates 3d gameboard display using this.boardTab array
        this.board.forEach(field => {
            this.scene.remove(field)
        });
        this.board = []
        for (var i in this.boardTab) {
            for (var j in this.boardTab[i]) {
                var field
                if (this.boardTab[i][j] == 1) {
                    field = new Field(0xa59a93, i, j)
                }
                else {
                    field = new Field(0x8c4010, i, j)
                }
                this.scene.add(field)
                this.board.push(field)
            }
        }
    }
    renderPieces() { // generates 3d piecesTab on gameboard using this.piecesTab array
        this.pieces.forEach(piece => {
            this.scene.remove(piece)
        });
        this.pieces = []
        for (var i in this.piecesTab) {
            for (var j in this.piecesTab[i]) {
                if (this.piecesTab[i][j] != 0) {
                    var piece
                    if (this.piecesTab[i][j] == 1) {
                        let owner = (session.color == 1 ? session.username : session.enemy)
                        piece = new Piece(0xff0000, owner, i, j)
                        this.pieces.push(piece)
                    }
                    if (this.piecesTab[i][j] == 2) {
                        let owner = (session.color == 2 ? session.username : session.enemy)
                        piece = new Piece(0x000000, owner, i, j)
                        this.pieces.push(piece)
                    }
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

        this.setRaycaster()

        this.setRenderer(root)

        // this.addAxes()

        this.renderBoard()

        // this.renderPieces()

        // this.enableOrbitControl()

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