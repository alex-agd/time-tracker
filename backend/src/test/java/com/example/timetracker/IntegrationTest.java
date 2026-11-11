package com.example.timetracker;

import java.time.Instant;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@SpringBootTest
@AutoConfigureMockMvc
@Import({ TestcontainersConfiguration.class, IntegrationTest.ClockConfiguration.class })
public abstract class IntegrationTest {

	protected static final Instant NOW = Instant.parse("2026-11-10T09:00:00Z");

	@Autowired
	protected MockMvcTester mvc;

	@Autowired
	protected MutableClock clock;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@BeforeEach
	void resetState() {
		jdbcTemplate.execute("TRUNCATE time_entry, employee RESTART IDENTITY CASCADE");
		clock.set(NOW);
	}

	protected long createEmployee(String fullName) throws Exception {
		MvcTestResult result = mvc.post()
			.uri("/api/employees")
			.contentType(MediaType.APPLICATION_JSON)
			.content("""
					{"fullName": "%s", "position": "Инженер"}
					""".formatted(fullName))
			.exchange();
		return ((Number) JsonPath.read(result.getResponse().getContentAsString(), "$.id"))
			.longValue();
	}

	protected MvcTestResult startTimer(long employeeId, String description) {
		return mvc.post()
			.uri("/api/employees/{id}/timer/start", employeeId)
			.contentType(MediaType.APPLICATION_JSON)
			.content("""
					{"description": "%s"}
					""".formatted(description))
			.exchange();
	}

	protected MvcTestResult stopTimer(long employeeId) {
		return mvc.post().uri("/api/employees/{id}/timer/stop", employeeId).exchange();
	}

	@TestConfiguration(proxyBeanMethods = false)
	static class ClockConfiguration {

		@Bean
		@Primary
		MutableClock testClock() {
			return new MutableClock(NOW);
		}

	}

}
