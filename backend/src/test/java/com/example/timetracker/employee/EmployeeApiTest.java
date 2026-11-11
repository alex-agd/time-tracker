package com.example.timetracker.employee;

import com.example.timetracker.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;

class EmployeeApiTest extends IntegrationTest {

	@Test
	void createdEmployeesAreListedAlphabetically() throws Exception {
		createEmployee("Мария Соколова");
		createEmployee("Алексей Смирнов");

		assertThat(mvc.get().uri("/api/employees")).hasStatusOk().bodyJson().satisfies(json -> {
			json.assertThat().extractingPath("$[0].fullName").isEqualTo("Алексей Смирнов");
			json.assertThat().extractingPath("$[1].fullName").isEqualTo("Мария Соколова");
			json.assertThat().extractingPath("$[0].activeEntry").isNull();
		});
	}

	@Test
	void blankFullNameIsRejected() {
		assertThat(mvc.post()
			.uri("/api/employees")
			.contentType(MediaType.APPLICATION_JSON)
			.content("""
					{"fullName": "  "}
					"""))
			.hasStatus(HttpStatus.BAD_REQUEST)
			.bodyJson()
			.extractingPath("$.errors.fullName")
			.isEqualTo("Укажите ФИО");
	}

	@Test
	void emptyPositionIsStoredAsNull() {
		assertThat(mvc.post()
			.uri("/api/employees")
			.contentType(MediaType.APPLICATION_JSON)
			.content("""
					{"fullName": "Иван Петров", "position": ""}
					"""))
			.hasStatus(HttpStatus.CREATED)
			.bodyJson()
			.extractingPath("$.position")
			.isNull();
	}

}
