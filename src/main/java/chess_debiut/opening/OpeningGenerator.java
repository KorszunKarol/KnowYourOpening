package chess_debiut.opening;

import chess_debiut.game.Piece;
import chess_debiut.game.PositionGenerator;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OpeningGenerator {
    private List<Piece> pieces;
    private String sequence;

    public OpeningGenerator(){
        this.pieces = PositionGenerator.startingPosition();
        this.sequence ="";
    }

    public void updatePosition(String move){
        makeMove(move, pieces);
    }

    public static void makeMove(String move, List<Piece> pieces) {
        String fromWhere = move.substring(0, 2);
        String toWhere = move.substring(3, 5);
        int index = 0;
        int index_to_remove = -1;
        boolean piece_moved = false;
        for (Piece piece : pieces) {
            piece.setMovedLast(false);
            if (piece.getPosition().equals(toWhere)){
                index_to_remove = index;
            }
            if (piece.getPosition().equals(fromWhere) && piece.getPossibleMoves().contains(toWhere)){
                piece.pieceMoved(toWhere);
                piece_moved = true;
            }
            index = index + 1;
        }
        if (!piece_moved){
            throw new IllegalStateException("No piece has moved");
        }
        if (index_to_remove > -1){
            pieces.remove(index_to_remove);
        }
        PositionGenerator.calculatePossibleMoves(pieces);
    }

}
