package com.example.timetracker.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateEmployeeRequest(
		@NotBlank(message = "Укажите ФИО") @Size(max = 200, message = "Не длиннее 200 символов") String fullName,
		@Size(max = 200, message = "Не длиннее 200 символов") String position) {
}
