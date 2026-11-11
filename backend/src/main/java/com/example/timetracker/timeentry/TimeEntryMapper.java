package com.example.timetracker.timeentry;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

import com.example.timetracker.timeentry.dto.TimeEntryResponse;

import org.springframework.stereotype.Component;

@Component
public class TimeEntryMapper {

	private final Clock clock;

	public TimeEntryMapper(Clock clock) {
		this.clock = clock;
	}

	public TimeEntryResponse toResponse(TimeEntry entry) {
		Instant end = entry.isRunning() ? Instant.now(clock) : entry.getEndedAt();
		long seconds = Math.max(0, Duration.between(entry.getStartedAt(), end).toSeconds());
		return new TimeEntryResponse(entry.getId(), entry.getEmployeeId(), entry.getDescription(),
				entry.getStartedAt(), entry.getEndedAt(), seconds);
	}

}
