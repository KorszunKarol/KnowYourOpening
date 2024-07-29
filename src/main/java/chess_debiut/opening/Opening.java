package chess_debiut.opening;


import chess_debiut.user.User;
import chess_debiut.user_opening.UserOpening;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table
@Data
@JsonSerialize(using = OpeningSerializer.class)
public class Opening {
    @Id
    @SequenceGenerator(
            name = "opening_sequence",
            sequenceName = "opening_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "opening_sequence"
    )
    Long id;
    String name;
    String moveSequence;
    String description;
    String playerSide;
    LocalDate creationDate;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User createdBy;

    @OneToMany(mappedBy = "opening", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserOpening> userOpenings = new HashSet<>();

    public Opening() {
    }

    public Opening(Long id,
                   String name,
                   String moveSequence,
                   String description,
                   String playerSide,
                   LocalDate creationDate,
                   User user) {
        this.id = id;
        this.name = name;
        this.moveSequence = moveSequence;
        this.description = description;
        this.playerSide = playerSide;
        this.creationDate = creationDate;
        this.createdBy = user;
    }

    public Opening(String name,
                   String moveSequence,
                   String description,
                   String playerSide) {
        this.name = name;
        this.moveSequence = moveSequence;
        this.description = description;
        this.playerSide = playerSide;
    }

    public static void makePlayerMoveLast(Opening opening){
        String moveSequence = opening.getMoveSequence();
        if((opening.getPlayerSide().equals("white") && moveSequence.length()%10 == 0)
        || (opening.getPlayerSide().equals("black") && moveSequence.length()%10 == 5)){
            String correctSequence = moveSequence.substring(0, moveSequence.length()-5);
            opening.setMoveSequence(correctSequence);
        }
    }
}
