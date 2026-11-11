package com.example.timetracker.employee;

import java.util.List;

import com.example.timetracker.employee.dto.CreateEmployeeRequest;
import com.example.timetracker.employee.dto.EmployeeResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employees")
public class EmployeeController {

	private final EmployeeService employeeService;

	public EmployeeController(EmployeeService employeeService) {
		this.employeeService = employeeService;
	}

	@GetMapping
	@Operation(operationId = "getEmployees", summary = "Список сотрудников с активными таймерами")
	public List<EmployeeResponse> getEmployees() {
		return employeeService.findAll();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(operationId = "createEmployee", summary = "Добавить сотрудника")
	public EmployeeResponse createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
		return employeeService.create(request);
	}

}
