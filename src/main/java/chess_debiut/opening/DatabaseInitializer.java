package chess_debiut.opening;
import chess_debiut.user.User;
import chess_debiut.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DatabaseInitializer {

    @Autowired
    private OpeningRepository openingRepository;
    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        User user = new User();
        user.setId(420);
        user.setUsername("admin");
        user.setPassword("Losowe hasło i tak nikt tego konta nie użyje");
        Optional<User> optional = userRepository.getUserByUsername(user.getUsername());
        User openingOwner;
        if (optional.isPresent()){
            openingOwner = optional.get();
        } else {
            userRepository.save(user);
            openingOwner = user;
        }

        List<String> basicOpenings = Arrays.asList("*Ruy Lopez*", "*Sicilian Defense*", "*French Defense*", "*Caro-Kann Defense*");
        List<String> moveSequences = Arrays.asList("e2-e4e7-e5g1-f3b8-c6f1-b5",
                                                    "e2-e4c7-c5g1-f3d7-d6d2-d4c5-d4f3-d4",
                                                    "e2-e4e7-e6d2-d4d7-d5b1-c3g8-f6c1-g5f8-e7e4-e5f6-d7h2-h4e7-g5h4-g5",
                                                    "e2-e4c7-c6d2-d4d7-d5e4-e5c8-f5h2-h4h7-h6g2-g4");
        for (String openingName : basicOpenings) {
            if (!openingRepository.existsByName(openingName)) {
                Opening opening = new Opening();
                opening.setName(openingName);
                opening.setPlayerSide("white");
                opening.setMoveSequence(moveSequences.get(basicOpenings.indexOf(openingName)));
                opening.setCreatedBy(openingOwner);
                LocalDate date = LocalDate.now();
                opening.setCreationDate(date);
                openingRepository.save(opening);
            }
        }
    }
}
