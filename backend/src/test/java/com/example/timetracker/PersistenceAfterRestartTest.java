package com.example.timetracker;

import java.time.Duration;
import java.time.Instant;

import com.example.timetracker.employee.EmployeeService;
import com.example.timetracker.employee.dto.CreateEmployeeRequest;
import com.example.timetracker.employee.dto.EmployeeResponse;
import com.example.timetracker.timeentry.TimeEntryService;
import com.example.timetracker.timeentry.TimerService;
import com.example.timetracker.timeentry.dto.StartTimerRequest;
import com.example.timetracker.common.Period;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Поднимает приложение, пишет данные, останавливает его и поднимает заново на той же БД.
 */
class PersistenceAfterRestartTest {

	private static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer(
			TestcontainersConfiguration.POSTGRES_IMAGE);

	@BeforeAll
	static void startDatabase() {
		POSTGRES.start();
	}

	@AfterAll
	static void stopDatabase() {
		POSTGRES.stop();
	}

	@Test
	void dataSurvivesApplicationRestart() {
		long employeeId;
		try (ConfigurableApplicationContext first = startApplication()) {
			EmployeeResponse employee = first.getBean(EmployeeService.class)
				.create(new CreateEmployeeRequest("Иван Петров", "Инженер"));
			employeeId = employee.id();
			first.getBean(TimerService.class).start(employeeId, new StartTimerRequest("До перезапуска"));
			first.getBean(TimerService.class).stop(employeeId);
		}

		try (ConfigurableApplicationContext second = startApplication()) {
			assertThat(second.getBean(EmployeeService.class).findAll()).extracting(EmployeeResponse::fullName)
				.containsExactly("Иван Петров");
			assertThat(second.getBean(TimeEntryService.class)
				.findInPeriod(employeeId, Period.of(Instant.now().minus(Duration.ofDays(1)), Instant.now().plusSeconds(60))))
				.singleElement()
				.satisfies(entry -> {
					assertThat(entry.description()).isEqualTo("До перезапуска");
					assertThat(entry.endedAt()).isNotNull();
				});
		}
	}

	private static ConfigurableApplicationContext startApplication() {
		return new SpringApplicationBuilder(TimeTrackerApplication.class).web(WebApplicationType.NONE)
			.run("--spring.datasource.url=" + POSTGRES.getJdbcUrl(),
					"--spring.datasource.username=" + POSTGRES.getUsername(),
					"--spring.datasource.password=" + POSTGRES.getPassword());
	}

}
