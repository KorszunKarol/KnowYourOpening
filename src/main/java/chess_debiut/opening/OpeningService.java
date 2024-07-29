package chess_debiut.opening;

import chess_debiut.game.Game;
import chess_debiut.user.User;
import chess_debiut.user.UserRepository;
import chess_debiut.user_opening.UserOpening;
import chess_debiut.user_opening.UserOpeningRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OpeningService {
    private final OpeningRepository openingRepository;

    private final UserOpeningRepository userOpeningRepository;

    private final UserRepository userRepository;
    private ConcurrentHashMap<String, OpeningGenerator> userOpeningGenerator = new ConcurrentHashMap<>();
    @Autowired
    public OpeningService(OpeningRepository openingRepository, UserOpeningRepository userOpeningRepository, UserRepository userRepository) {
        this.openingRepository = openingRepository;
        this.userOpeningRepository = userOpeningRepository;
        this.userRepository = userRepository;
    }

    public List<Opening> getAllOpenings() {
        return openingRepository.findAll();
    }

    public void addNewOpening(Opening opening) {
        if (!validMoveSequence(opening)) {
            throw new InvalidParameterException("Invalid move sequence!");
        };
        LocalDate date = LocalDate.now();
        opening.setCreationDate(date);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.getUserByUsername(username).get();
        opening.setCreatedBy(currentUser);
        Opening.makePlayerMoveLast(opening);
        openingRepository.save(opening);
        UserOpening userOpening = new UserOpening();
        userOpening.setOpening(opening);
        userOpening.setUser(currentUser);
        userOpeningRepository.save(userOpening);
    }

    private boolean validMoveSequence(Opening opening) {
        Game game = new Game();
        String moveSequence = opening.getMoveSequence();
        while (!moveSequence.isEmpty()){
            try {
                String move = moveSequence.substring(0, 5);
                game.updatePositions(move);
                moveSequence = moveSequence.substring(5);
            } catch (Exception e){
                return false;
            }
        }
        return true;
    }

    public void deleteOpening(Long openingId) {
        if (!openingRepository.existsById(openingId)){
            throw new IllegalStateException(
                    "Opening with id " + openingId + " does not exist."
            );
        }
        Opening opening = openingRepository.findOpeningById(openingId).get();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (opening.getCreatedBy().getUsername().equals(username)) {
            openingRepository.deleteById(openingId);
        } else {
            throw new IllegalStateException("You can't delete opening that you didn't create.");
        }
    }

    @Transactional
    public void updateOpening(Long openingId,
                              String name,
                              String moveSequence,
                              String description,
                              String playerSide) {
        Opening opening = openingRepository
                .findById(openingId).orElseThrow(() ->
                        new IllegalStateException(
                                "Opening with id " + openingId + " does not exist"));
        if (name != null && !name.isEmpty() && !Objects.equals(opening.getName(), name)) {
            opening.setName(name);
        }
        if (moveSequence != null && !moveSequence.isEmpty() && !Objects.equals(opening.getMoveSequence(), moveSequence)) {
            opening.setMoveSequence(moveSequence);
        }
        if (description != null && !description.isEmpty() && !Objects.equals(opening.getDescription(), description)) {
            opening.setDescription(description);
        }
        if (playerSide != null && !playerSide.isEmpty() && !Objects.equals(opening.getPlayerSide(), playerSide)) {
            opening.setPlayerSide(playerSide);
        }

    }

    public List<Opening> getOpeningsStartingWith(String nameFrag) {
        Optional<Opening> openingStartingWith = openingRepository.findOpeningStartingWith(nameFrag);
        return openingStartingWith.map(List::of).orElse(List.of());

    }

    public List<Opening> getUserOpenings() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.getUserByUsername(username).get();
        List<UserOpening> userSubscriptions = userOpeningRepository.findByUser(currentUser);
        List<Opening> openings = new ArrayList<>();
        for (UserOpening userOpening: userSubscriptions){
            openings.add(userOpening.getOpening());
        }
        return openings;
    }

    public Optional<Opening> findOpeningById(Long openingID){
        return openingRepository.findOpeningById(openingID);
    }

    public void subscribeOpening(Long openingId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.getUserByUsername(username).get();
        if (!openingRepository.existsById(openingId)){
            throw new IllegalStateException(
                    "Opening with id " + openingId + " does not exist.");
        }
        Opening opening = openingRepository.findOpeningById(openingId).get();
        Optional<UserOpening> optional = userOpeningRepository.findByUserAndOpening(currentUser, opening);
        if (optional.isPresent()){
            return;
        }
        UserOpening userOpening = new UserOpening();
        userOpening.setUser(currentUser);
        userOpening.setOpening(opening);
        userOpeningRepository.save(userOpening);
    }

    public void unsubOpening(Long openingId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.getUserByUsername(username).get();
        List<UserOpening> userSubscriptions = userOpeningRepository.findByUser(currentUser);
        Integer relationToDeleteID = null;
        for (UserOpening userOpening : userSubscriptions){
            if (userOpening.getOpening().getId().equals(openingId)){
                relationToDeleteID = userOpening.getID();
                break;
            }
        }
        if (relationToDeleteID != null) {
            userOpeningRepository.deleteById(relationToDeleteID);
        }
    }

    public OpeningGenerator startGeneratingOpening() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        OpeningGenerator openingGenerator = new OpeningGenerator();
        userOpeningGenerator.put(username, openingGenerator);
        return openingGenerator;
    }

    public OpeningGenerator moveInOpeningGenerator(String move) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        OpeningGenerator openingGenerator = userOpeningGenerator.get(username);
        openingGenerator.updatePosition(move);
        openingGenerator.setSequence(openingGenerator.getSequence()+move);
        return openingGenerator;
    }

    public void saveGeneratedOpening(Opening opening) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        OpeningGenerator openingGenerator = userOpeningGenerator.get(username);
        if (openingGenerator.getSequence().isEmpty()){
            return;                                       // maybe throw exception
        }
        opening.setMoveSequence(openingGenerator.getSequence());
        addNewOpening(opening);
        userOpeningGenerator.remove(username);
    }

}
