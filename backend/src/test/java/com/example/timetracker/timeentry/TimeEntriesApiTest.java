package com.example.timetracker.timeentry;

import java.time.Duration;

import com.example.timetracker.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

class TimeEntriesApiTest extends IntegrationTest {

	@Test
	void returnsEntriesOfEmployeeOverlappingPeriodNewestFirst() throws Exception {
		long ivan = createEmployee("Иван Петров");
		long maria = createEmployee("Мария Соколова");
		startTimer(ivan, "Утро");
		clock.advance(Duration.ofHours(1));
		stopTimer(ivan);
		startTimer(ivan, "День");
		startTimer(maria, "Чужая задача");
		clock.advance(Duration.ofHours(1));
		stopTimer(ivan);

		assertThat(mvc.get()
			.uri("/api/time-entries?employeeId={id}&from={from}&to={to}", ivan, "2026-11-10T00:00:00Z",
					"2026-11-11T00:00:00Z"))
			.hasStatusOk()
			.bodyJson()
			.satisfies(json -> {
				json.assertThat().extractingPath("$.length()").isEqualTo(2);
				json.assertThat().extractingPath("$[0].description").isEqualTo("День");
				json.assertThat().extractingPath("$[1].description").isEqualTo("Утро");
			});
	}

	@Test
	void emptyPeriodReturnsEmptyList() throws Exception {
		createEmployee("Иван Петров");

		assertThat(mvc.get().uri("/api/time-entries?from={from}&to={to}", "2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z"))
			.hasStatusOk()
			.bodyJson()
			.isEqualTo("[]");
	}

	@Test
	void unknownEmployeeReturnsNotFound() {
		assertThat(mvc.get()
			.uri("/api/time-entries?employeeId=42&from={from}&to={to}", "2026-11-10T00:00:00Z", "2026-11-11T00:00:00Z"))
			.hasStatus(HttpStatus.NOT_FOUND);
	}

}
