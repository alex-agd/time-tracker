package com.example.timetracker.employee.dto;

import java.time.Instant;

import com.example.timetracker.timeentry.dto.TimeEntryResponse;
import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record EmployeeResponse(@Schema(requiredMode = REQUIRED) Long id,
		@Schema(requiredMode = REQUIRED) String fullName, String position,
		@Schema(requiredMode = REQUIRED) Instant createdAt,
		@Schema(description = "Запущенный таймер, если есть") TimeEntryResponse activeEntry) {
}
