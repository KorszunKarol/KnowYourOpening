package chess_debiut.user;

import chess_debiut.jwt.JwtUtils;
import chess_debiut.opening.Opening;
import chess_debiut.opening.OpeningRepository;
import chess_debiut.user_opening.UserOpening;
import chess_debiut.user_opening.UserOpeningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OpeningRepository openingRepository;
    @Autowired
    private UserOpeningRepository userOpeningRepository;
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                            loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User userDetails = (User) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);
        List<String> roles = new ArrayList<>();
        LoginResponse response = new LoginResponse(jwtToken, userDetails.getUsername(), roles);
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<String> addNewOpening(@RequestBody User user) {
        Optional<User> optional = userRepository.getUserByUsername(user.getUsername());
        if (optional.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("That username is taken.");
        }
        userRepository.save(user);
        List<String> basicOpenings = Arrays.asList("*Ruy Lopez*", "*Sicilian Defense*", "*French Defense*", "*Caro-Kann Defense*");
        for (String opening: basicOpenings) {
            Opening newOpening = openingRepository.getOpeningByName(opening);
            UserOpening userOpening = new UserOpening();
            userOpening.setUser(user);
            userOpening.setOpening(newOpening);
            userOpeningRepository.save(userOpening);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Successful registration!");
    }


    @GetMapping("/user")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}