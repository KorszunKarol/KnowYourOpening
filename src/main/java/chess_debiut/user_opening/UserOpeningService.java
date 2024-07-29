package chess_debiut.user_opening;

import chess_debiut.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserOpeningService {
    private final UserOpeningRepository userOpeningRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserOpeningService(UserOpeningRepository userOpeningRepository, UserRepository userRepository) {
        this.userOpeningRepository = userOpeningRepository;
        this.userRepository = userRepository;
    }

    public List<UserOpening> getOpeningStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userOpeningRepository.findByUser(userRepository.getUserByUsername(username).get());
    }
}
