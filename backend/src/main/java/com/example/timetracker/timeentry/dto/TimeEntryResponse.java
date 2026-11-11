package com.example.timetracker.timeentry.dto;

import java.time.Instant;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record TimeEntryResponse(@Schema(requiredMode = REQUIRED) Long id,
		@Schema(requiredMode = REQUIRED) Long employeeId, @Schema(requiredMode = REQUIRED) String description,
		@Schema(requiredMode = REQUIRED) Instant startedAt,
		@Schema(description = "null, пока таймер запущен") Instant endedAt,
		@Schema(requiredMode = REQUIRED,
				description = "Длительность в секундах; для запущенного таймера — на момент ответа") long durationSeconds) {
}
