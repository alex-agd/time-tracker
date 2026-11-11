package com.example.timetracker.timeentry;

import java.util.List;

import com.example.timetracker.common.Period;
import com.example.timetracker.employee.EmployeeService;
import com.example.timetracker.timeentry.dto.TimeEntryResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TimeEntryService {

	private final TimeEntryRepository timeEntryRepository;

	private final EmployeeService employeeService;

	private final TimeEntryMapper mapper;

	public TimeEntryService(TimeEntryRepository timeEntryRepository, EmployeeService employeeService,
			TimeEntryMapper mapper) {
		this.timeEntryRepository = timeEntryRepository;
		this.employeeService = employeeService;
		this.mapper = mapper;
	}

	@Transactional(readOnly = true)
	public List<TimeEntryResponse> findInPeriod(Long employeeId, Period period) {
		if (employeeId != null) {
			employeeService.getExisting(employeeId);
		}
		return timeEntryRepository.findOverlapping(employeeId, period.from(), period.to())
			.stream()
			.map(mapper::toResponse)
			.toList();
	}

}
