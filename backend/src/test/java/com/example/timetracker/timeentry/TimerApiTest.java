package com.example.timetracker.timeentry;

import java.time.Duration;

import com.example.timetracker.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

class TimerApiTest extends IntegrationTest {

	@Test
	void startAndStopTimerRecordsDuration() throws Exception {
		long employeeId = createEmployee("Иван Петров");

		assertThat(startTimer(employeeId, "  Ревью кода  ")).hasStatus(HttpStatus.CREATED)
			.bodyJson()
			.satisfies(json -> {
				json.assertThat().extractingPath("$.description").isEqualTo("Ревью кода");
				json.assertThat().extractingPath("$.endedAt").isNull();
			});

		clock.advance(Duration.ofMinutes(90));

		assertThat(stopTimer(employeeId)).hasStatusOk()
			.bodyJson()
			.satisfies(json -> {
				json.assertThat().extractingPath("$.endedAt").isEqualTo("2026-11-10T10:30:00Z");
				json.assertThat().extractingPath("$.durationSeconds").isEqualTo(5400);
			});
	}

	@Test
	void secondStartWhileRunningReturnsConflict() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		assertThat(startTimer(employeeId, "Первая задача")).hasStatus(HttpStatus.CREATED);

		assertThat(startTimer(employeeId, "Вторая задача")).hasStatus(HttpStatus.CONFLICT)
			.bodyJson()
			.extractingPath("$.detail")
			.asString()
			.contains("уже запущен");

		assertThat(mvc.get().uri("/api/employees")).hasStatusOk()
			.bodyJson()
			.extractingPath("$[0].activeEntry.description")
			.isEqualTo("Первая задача");
	}

	@Test
	void timerCanBeStartedAgainAfterStop() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		startTimer(employeeId, "Задача 1");
		clock.advance(Duration.ofMinutes(10));
		stopTimer(employeeId);

		assertThat(startTimer(employeeId, "Задача 2")).hasStatus(HttpStatus.CREATED);
	}

	@Test
	void stopWithoutRunningTimerReturnsConflict() throws Exception {
		long employeeId = createEmployee("Иван Петров");

		assertThat(stopTimer(employeeId)).hasStatus(HttpStatus.CONFLICT);
	}

	@Test
	void startForUnknownEmployeeReturnsNotFound() {
		assertThat(startTimer(999, "Задача")).hasStatus(HttpStatus.NOT_FOUND);
	}

	@Test
	void blankDescriptionIsRejected() throws Exception {
		long employeeId = createEmployee("Иван Петров");

		assertThat(startTimer(employeeId, "   ")).hasStatus(HttpStatus.BAD_REQUEST)
			.bodyJson()
			.extractingPath("$.errors.description")
			.isEqualTo("Опишите задачу");
	}

}
