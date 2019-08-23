package tr.com.astair.astair.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tr.com.astair.astair.model.Rooms;
import java.util.List;

public interface RoomsRepository extends JpaRepository<Rooms, Long> {
    @Query(nativeQuery = true, value = "select * from rooms")
    List<Rooms> getAllRooms();

}