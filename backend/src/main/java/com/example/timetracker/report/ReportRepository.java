package com.example.timetracker.report;

import java.time.Instant;
import java.util.List;

import com.example.timetracker.employee.Employee;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends Repository<Employee, Long> {

	/**
	 * Записи обрезаются по границам периода, запущенный таймер считается до :now. FILTER обязателен:
	 * GREATEST/LEAST в Postgres игнорируют NULL, и без него сотрудник без записей получает весь период.
	 */
	@Query(nativeQuery = true, value = """
			SELECT e.id        AS employeeId,
			       e.full_name AS fullName,
			       e.position  AS position,
			       CAST(COALESCE(FLOOR(SUM(EXTRACT(EPOCH FROM
			           LEAST(COALESCE(t.ended_at, :now), :to) - GREATEST(t.started_at, :from)))
			           FILTER (WHERE t.id IS NOT NULL)), 0) AS BIGINT) AS totalSeconds,
			       COUNT(t.id) AS entriesCount
			FROM employee e
			LEFT JOIN time_entry t
			       ON t.employee_id = e.id
			      AND t.started_at < :to
			      AND COALESCE(t.ended_at, :now) > :from
			GROUP BY e.id, e.full_name, e.position
			ORDER BY e.full_name
			""")
	List<EmployeeTotalView> summarize(@Param("from") Instant from, @Param("to") Instant to,
			@Param("now") Instant now);

}
