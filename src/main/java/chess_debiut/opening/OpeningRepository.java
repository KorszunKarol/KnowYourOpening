package chess_debiut.opening;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OpeningRepository extends JpaRepository<Opening, Long> {

    @Query("SELECT o FROM Opening o WHERE o.name LIKE %:nameFrag%")
    Optional<Opening> findOpeningStartingWith(String nameFrag);
    Optional<Opening> findOpeningById(Long id);

    boolean existsByName(String openingName);
    Opening getOpeningByName(String name);
}
