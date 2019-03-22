class Game {
    constructor() {
        this.board = this.generateBoard()
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
    
}