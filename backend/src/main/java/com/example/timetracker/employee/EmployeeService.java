package com.example.timetracker.employee;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.example.timetracker.common.NotFoundException;
import com.example.timetracker.employee.dto.CreateEmployeeRequest;
import com.example.timetracker.employee.dto.EmployeeResponse;
import com.example.timetracker.timeentry.TimeEntry;
import com.example.timetracker.timeentry.TimeEntryMapper;
import com.example.timetracker.timeentry.TimeEntryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class EmployeeService {

	private final EmployeeRepository employeeRepository;

	private final TimeEntryRepository timeEntryRepository;

	private final TimeEntryMapper timeEntryMapper;

	private final Clock clock;

	public EmployeeService(EmployeeRepository employeeRepository, TimeEntryRepository timeEntryRepository,
			TimeEntryMapper timeEntryMapper, Clock clock) {
		this.employeeRepository = employeeRepository;
		this.timeEntryRepository = timeEntryRepository;
		this.timeEntryMapper = timeEntryMapper;
		this.clock = clock;
	}

	@Transactional
	public EmployeeResponse create(CreateEmployeeRequest request) {
		String position = StringUtils.hasText(request.position()) ? request.position().strip() : null;
		Employee employee = employeeRepository
			.save(new Employee(request.fullName().strip(), position, Instant.now(clock)));
		return toResponse(employee, null);
	}

	@Transactional(readOnly = true)
	public List<EmployeeResponse> findAll() {
		Map<Long, TimeEntry> runningByEmployee = timeEntryRepository.findAllByEndedAtIsNull()
			.stream()
			.collect(Collectors.toMap(TimeEntry::getEmployeeId, Function.identity()));
		return employeeRepository.findAllByOrderByFullNameAsc()
			.stream()
			.map(employee -> toResponse(employee, runningByEmployee.get(employee.getId())))
			.toList();
	}

	@Transactional(readOnly = true)
	public Employee getExisting(Long id) {
		return employeeRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("Сотрудник с id=" + id + " не найден"));
	}

	private EmployeeResponse toResponse(Employee employee, TimeEntry activeEntry) {
		return new EmployeeResponse(employee.getId(), employee.getFullName(), employee.getPosition(),
				employee.getCreatedAt(), activeEntry == null ? null : timeEntryMapper.toResponse(activeEntry));
	}

}
