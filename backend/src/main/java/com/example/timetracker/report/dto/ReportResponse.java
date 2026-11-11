package com.example.timetracker.report.dto;

import java.time.Instant;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ReportResponse(@Schema(requiredMode = REQUIRED) Instant from,
		@Schema(requiredMode = REQUIRED) Instant to, @Schema(requiredMode = REQUIRED) long totalSeconds,
		@Schema(requiredMode = REQUIRED) List<EmployeeTotal> employees) {
}
