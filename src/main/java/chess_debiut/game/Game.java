package chess_debiut.game;

import chess_debiut.opening.Opening;
import chess_debiut.opening.OpeningGenerator;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Game {
    private Opening opening;
    private String onMove;
    private Long moveNumber;
    private String sequence;
    private boolean check;
    private boolean checkmate;
    private String winner;
    private boolean madeMistake;
    private String nextMove;
    private List<Piece> pieces;


    // create all pieces on their positions and set attributes
    public Game() {
        this.onMove = "White";
        this.moveNumber = 1L;
        this.sequence = "";
        this.check = false;
        this.checkmate = false;
        this.winner = null;
        this.pieces = PositionGenerator.startingPosition();
        this.madeMistake = false;
        this.nextMove = "";
    }

    public Game(Opening opening,
                String onMove,
                Long moveNumber,
                String sequence,
                String winner,
                List<Piece> pieces) {
        this.opening = opening;
        this.onMove = onMove;
        this.moveNumber = moveNumber;
        this.sequence = sequence;
        this.check = false;
        this.checkmate = false;
        this.winner = winner;
        this.pieces = pieces;
        this.madeMistake = false;
    }

    public void setFinalWinner(boolean mistake){
        if (mistake){
            this.setWinner("Computer");
        } else {
            this.setWinner("Player");
        }
    }

    public void updatePositions(String move) {
        OpeningGenerator.makeMove(move, pieces);
    }
}
