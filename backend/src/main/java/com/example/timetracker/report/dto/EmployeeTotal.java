package com.example.timetracker.report.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record EmployeeTotal(@Schema(requiredMode = REQUIRED) Long employeeId,
		@Schema(requiredMode = REQUIRED) String fullName, String position,
		@Schema(requiredMode = REQUIRED) long totalSeconds, @Schema(requiredMode = REQUIRED) long entriesCount) {
}
