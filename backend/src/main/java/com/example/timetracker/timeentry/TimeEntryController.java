package com.example.timetracker.timeentry;

import java.time.Instant;
import java.util.List;

import com.example.timetracker.common.Period;
import com.example.timetracker.timeentry.dto.TimeEntryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/time-entries")
@Tag(name = "TimeEntries")
public class TimeEntryController {

	private final TimeEntryService timeEntryService;

	public TimeEntryController(TimeEntryService timeEntryService) {
		this.timeEntryService = timeEntryService;
	}

	@GetMapping
	@Operation(operationId = "getTimeEntries", summary = "Записи, пересекающиеся с периодом [from, to)")
	public List<TimeEntryResponse> getTimeEntries(@RequestParam(required = false) Long employeeId,
			@Parameter(example = "2026-11-01T00:00:00Z") @RequestParam Instant from,
			@Parameter(example = "2026-12-01T00:00:00Z") @RequestParam Instant to) {
		return timeEntryService.findInPeriod(employeeId, Period.of(from, to));
	}

}
