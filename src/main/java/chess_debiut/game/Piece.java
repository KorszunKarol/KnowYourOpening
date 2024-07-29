package chess_debiut.game;

import java.util.List;

public class Piece {
    private String type;
    private String position;
    private String color;
    private List<String> possibleMoves;
    private int timesMoved;
    private boolean movedLast;

    public Piece() {
    }

    public Piece(String type, String position, String color, List<String> possibleMoves) {
        this.type = type;
        this.position = position;
        this.color = color;
        this.possibleMoves = possibleMoves;
        this.timesMoved = 0;
        this.movedLast = false;
    }

    public Piece(String type, String position, String color) {
        this.type = type;
        this.position = position;
        this.color = color;
        this.timesMoved = 0;
        this.movedLast = false;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<String> getPossibleMoves() {
        return possibleMoves;
    }

    public void setPossibleMoves(List<String> possibleMoves) {
        this.possibleMoves = possibleMoves;
    }

    public int getTimesMoved() {
        return timesMoved;
    }

    public void setTimesMoved(int timesMoved) {
        this.timesMoved = timesMoved;
    }

    public void pieceMoved(String toWhere) {
        this.timesMoved += 1;
        this.movedLast = true;
        this.setPosition(toWhere);
    }

    public void anotherPieceMoved() {
        this.movedLast = false;
    }

    public boolean getMovedLast() {
        return movedLast;
    }

    public void setMovedLast(boolean movedLast) {
        this.movedLast = movedLast;
    }
}
