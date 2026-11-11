package com.example.timetracker.timeentry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StartTimerRequest(
		@NotBlank(message = "Опишите задачу") @Size(max = 500, message = "Не длиннее 500 символов") String description) {
}
