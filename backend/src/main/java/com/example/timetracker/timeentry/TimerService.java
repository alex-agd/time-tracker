package com.example.timetracker.timeentry;

import java.time.Clock;
import java.time.Instant;

import com.example.timetracker.common.ConflictException;
import com.example.timetracker.employee.Employee;
import com.example.timetracker.employee.EmployeeService;
import com.example.timetracker.timeentry.dto.StartTimerRequest;
import com.example.timetracker.timeentry.dto.TimeEntryResponse;

import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TimerService {

	private static final Logger log = LoggerFactory.getLogger(TimerService.class);

	private static final String ONE_RUNNING_CONSTRAINT = "time_entry_one_running_uq";

	private static final String ALREADY_RUNNING = "У сотрудника уже запущен таймер — сначала остановите его";

	private final TimeEntryRepository timeEntryRepository;

	private final EmployeeService employeeService;

	private final TimeEntryMapper mapper;

	private final Clock clock;

	public TimerService(TimeEntryRepository timeEntryRepository, EmployeeService employeeService,
			TimeEntryMapper mapper, Clock clock) {
		this.timeEntryRepository = timeEntryRepository;
		this.employeeService = employeeService;
		this.mapper = mapper;
		this.clock = clock;
	}

	@Transactional
	public TimeEntryResponse start(Long employeeId, StartTimerRequest request) {
		Employee employee = employeeService.getExisting(employeeId);
		if (timeEntryRepository.findRunningByEmployeeId(employeeId).isPresent()) {
			throw new ConflictException(ALREADY_RUNNING);
		}
		try {
			TimeEntry entry = timeEntryRepository
				.saveAndFlush(new TimeEntry(employee, request.description().strip(), Instant.now(clock)));
			log.info("Timer started: employeeId={}, entryId={}", employeeId, entry.getId());
			return mapper.toResponse(entry);
		}
		catch (DataIntegrityViolationException ex) {
			// Параллельный запрос успел запустить таймер между проверкой и вставкой — ловит частичный уникальный индекс
			if (violates(ex, ONE_RUNNING_CONSTRAINT)) {
				throw new ConflictException(ALREADY_RUNNING);
			}
			throw ex;
		}
	}

	@Transactional
	public TimeEntryResponse stop(Long employeeId) {
		employeeService.getExisting(employeeId);
		TimeEntry entry = timeEntryRepository.findRunningByEmployeeIdForUpdate(employeeId)
			.orElseThrow(() -> new ConflictException("У сотрудника нет запущенного таймера"));
		entry.stop(Instant.now(clock));
		log.info("Timer stopped: employeeId={}, entryId={}", employeeId, entry.getId());
		return mapper.toResponse(entry);
	}

	private static boolean violates(DataIntegrityViolationException ex, String constraintName) {
		return ex.getCause() instanceof ConstraintViolationException violation
				&& constraintName.equals(violation.getConstraintName());
	}

}
