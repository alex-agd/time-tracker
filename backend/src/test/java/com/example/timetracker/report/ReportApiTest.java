package com.example.timetracker.report;

import java.time.Duration;

import com.example.timetracker.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

import static org.assertj.core.api.Assertions.assertThat;

class ReportApiTest extends IntegrationTest {

	private static final String DAY_FROM = "2026-11-10T00:00:00Z";

	private static final String DAY_TO = "2026-11-11T00:00:00Z";

	@Test
	void emptyReportWithoutEmployees() {
		assertThat(report(DAY_FROM, DAY_TO)).hasStatusOk().bodyJson().satisfies(json -> {
			json.assertThat().extractingPath("$.totalSeconds").isEqualTo(0);
			json.assertThat().extractingPath("$.employees").asArray().isEmpty();
		});
	}

	@Test
	void emptyPeriodReturnsEmployeesWithZeroTotals() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		startTimer(employeeId, "Задача");
		clock.advance(Duration.ofHours(1));
		stopTimer(employeeId);

		assertThat(report("2026-10-01T00:00:00Z", "2026-10-02T00:00:00Z")).hasStatusOk()
			.bodyJson()
			.satisfies(json -> {
				json.assertThat().extractingPath("$.totalSeconds").isEqualTo(0);
				json.assertThat().extractingPath("$.employees[0].totalSeconds").isEqualTo(0);
				json.assertThat().extractingPath("$.employees[0].entriesCount").isEqualTo(0);
			});
	}

	@Test
	void entryCrossingPeriodBoundaryIsClipped() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		startTimer(employeeId, "09:00–11:00");
		clock.advance(Duration.ofHours(2));
		stopTimer(employeeId);

		assertThat(report("2026-11-10T10:00:00Z", DAY_TO)).hasStatusOk()
			.bodyJson()
			.satisfies(json -> {
				json.assertThat().extractingPath("$.totalSeconds").isEqualTo(3600);
				json.assertThat().extractingPath("$.employees[0].entriesCount").isEqualTo(1);
			});
	}

	@Test
	void runningTimerIsCountedUntilNow() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		startTimer(employeeId, "Ещё идёт");
		clock.advance(Duration.ofMinutes(45));

		assertThat(report(DAY_FROM, DAY_TO)).hasStatusOk()
			.bodyJson()
			.extractingPath("$.employees[0].totalSeconds")
			.isEqualTo(2700);
	}

	@Test
	void totalsAreSummedPerEmployee() throws Exception {
		long ivan = createEmployee("Иван Петров");
		long maria = createEmployee("Мария Соколова");

		startTimer(ivan, "Задача 1");
		clock.advance(Duration.ofMinutes(30));
		stopTimer(ivan);
		startTimer(ivan, "Задача 2");
		startTimer(maria, "Задача 3");
		clock.advance(Duration.ofMinutes(15));
		stopTimer(ivan);
		stopTimer(maria);

		assertThat(report(DAY_FROM, DAY_TO)).hasStatusOk().bodyJson().satisfies(json -> {
			json.assertThat().extractingPath("$.totalSeconds").isEqualTo(3600);
			json.assertThat().extractingPath("$.employees[0].fullName").isEqualTo("Иван Петров");
			json.assertThat().extractingPath("$.employees[0].totalSeconds").isEqualTo(2700);
			json.assertThat().extractingPath("$.employees[0].entriesCount").isEqualTo(2);
			json.assertThat().extractingPath("$.employees[1].totalSeconds").isEqualTo(900);
		});
	}

	@Test
	void invalidPeriodIsRejected() {
		assertThat(report(DAY_TO, DAY_FROM)).hasStatus(HttpStatus.BAD_REQUEST);
		assertThat(mvc.get().uri("/api/reports/summary?from=вчера&to=" + DAY_TO))
			.hasStatus(HttpStatus.BAD_REQUEST);
		assertThat(report("2020-01-01T00:00:00Z", DAY_TO)).hasStatus(HttpStatus.BAD_REQUEST)
			.bodyJson()
			.extractingPath("$.detail")
			.isEqualTo("Период не может быть длиннее 366 дней");
	}

	private MvcTestResult report(String from, String to) {
		return mvc.get().uri("/api/reports/summary?from={from}&to={to}", from, to).exchange();
	}

}
