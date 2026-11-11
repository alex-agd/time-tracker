package com.example.timetracker.timeentry;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

	@Query("select t from TimeEntry t where t.employee.id = :employeeId and t.endedAt is null")
	Optional<TimeEntry> findRunningByEmployeeId(@Param("employeeId") Long employeeId);

	/** Блокирует строку, чтобы параллельные остановки не перезаписали ended_at друг друга. */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select t from TimeEntry t where t.employee.id = :employeeId and t.endedAt is null")
	Optional<TimeEntry> findRunningByEmployeeIdForUpdate(@Param("employeeId") Long employeeId);

	List<TimeEntry> findAllByEndedAtIsNull();

	@Query("""
			select t from TimeEntry t
			where t.startedAt < :to
			  and (t.endedAt is null or t.endedAt > :from)
			  and (:employeeId is null or t.employee.id = :employeeId)
			order by t.startedAt desc
			""")
	List<TimeEntry> findOverlapping(@Param("employeeId") Long employeeId, @Param("from") Instant from,
			@Param("to") Instant to);

}
