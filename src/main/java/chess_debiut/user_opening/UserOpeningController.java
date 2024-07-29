package chess_debiut.user_opening;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
public class UserOpeningController {
    private final UserOpeningService userOpeningService;

    @Autowired
    public UserOpeningController(UserOpeningService userOpeningService) {
        this.userOpeningService = userOpeningService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/opening/stats")
    public List<UserOpening> getOpeningStats(){
        return userOpeningService.getOpeningStats();
    }
}
