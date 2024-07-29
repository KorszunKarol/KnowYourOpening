package chess_debiut.opening;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OpeningController {

    private final OpeningService openingService;

    @Autowired
    public OpeningController(OpeningService openingService) {
        this.openingService = openingService;
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/opening")
    public List<Opening> getAllOpenings(){
        return openingService.getAllOpenings();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/opening/user")
    public List<Opening> getUserOpenings(){
        return openingService.getUserOpenings();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/opening")
    public void addNewOpening(@RequestBody Opening opening){
        openingService.addNewOpening(opening);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/opening/{id}")
    public void deleteOpening(@PathVariable("id") Long openingId){
        openingService.deleteOpening(openingId);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/opening/subscribe/{id}")
    public void subscribeOpening(@PathVariable("id") Long openingId){
        openingService.subscribeOpening(openingId);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/opening/unsub/{id}")
    public void unsubOpening(@PathVariable("id") Long openingId){
        openingService.unsubOpening(openingId);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/opening/{id}")
    public void updateOpening(@PathVariable("id") Long openingId,
                              @RequestParam(required = false) String name,
                              @RequestParam(required = false) String moveSequence,
                              @RequestParam(required = false) String description,
                              @RequestParam(required = false) String startingSide){
        openingService.updateOpening(openingId, name, moveSequence, description, startingSide);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/opening/{nameFrag}")
    public List<Opening> getOpeningsStartingWith(@PathVariable("nameFrag") String nameFrag){
        return openingService.getOpeningsStartingWith(nameFrag);
    }
    @GetMapping("/opening/new/start")
    public OpeningGenerator startGeneratingOpening(){return openingService.startGeneratingOpening();}

    @PutMapping("/opening/new/{move}")
    public OpeningGenerator moveInOpeningGenerator(@PathVariable("move") String move){
        return openingService.moveInOpeningGenerator(move);
    }

    @PostMapping("/opening/new/save")
    public void saveGeneratedOpening(@RequestBody Opening opening){
        openingService.saveGeneratedOpening(opening);
    }

}
