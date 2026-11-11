package com.example.timetracker.timeentry;

import com.example.timetracker.timeentry.dto.StartTimerRequest;
import com.example.timetracker.timeentry.dto.TimeEntryResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employees/{employeeId}/timer")
@Tag(name = "Timer")
public class TimerController {

	private final TimerService timerService;

	public TimerController(TimerService timerService) {
		this.timerService = timerService;
	}

	@PostMapping("/start")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(operationId = "startTimer", summary = "Запустить таймер; 409, если уже запущен")
	public TimeEntryResponse startTimer(@PathVariable Long employeeId, @Valid @RequestBody StartTimerRequest request) {
		return timerService.start(employeeId, request);
	}

	@PostMapping("/stop")
	@Operation(operationId = "stopTimer", summary = "Остановить таймер; 409, если не запущен")
	public TimeEntryResponse stopTimer(@PathVariable Long employeeId) {
		return timerService.stop(employeeId);
	}

}
