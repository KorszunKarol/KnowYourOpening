package chess_debiut.game;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class GameController {
    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) { this.gameService = gameService; }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/game/new")
    public Game startNewGame(){
        return gameService.startNewGame();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/game/new/{id}")
    public Game startNewGame(@PathVariable("id") Long openingId){
        return gameService.startNewGame(openingId);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/game/{move}")
    public Game moveResponse(@PathVariable("move") String move){
        return gameService.moveResponse(move);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/game/mistake")
    public Game playerMadeMistake(){return gameService.playerMadeMistake();}
}
