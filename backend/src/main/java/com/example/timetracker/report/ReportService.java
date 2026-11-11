package com.example.timetracker.report;

import java.time.Clock;
import java.time.Instant;
import java.util.List;

import com.example.timetracker.common.Period;
import com.example.timetracker.report.dto.EmployeeTotal;
import com.example.timetracker.report.dto.ReportResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

	private final ReportRepository reportRepository;

	private final Clock clock;

	public ReportService(ReportRepository reportRepository, Clock clock) {
		this.reportRepository = reportRepository;
		this.clock = clock;
	}

	@Transactional(readOnly = true)
	public ReportResponse summarize(Period period) {
		List<EmployeeTotal> employees = reportRepository.summarize(period.from(), period.to(), Instant.now(clock))
			.stream()
			.map(row -> new EmployeeTotal(row.getEmployeeId(), row.getFullName(), row.getPosition(),
					row.getTotalSeconds(), row.getEntriesCount()))
			.toList();
		long total = employees.stream().mapToLong(EmployeeTotal::totalSeconds).sum();
		return new ReportResponse(period.from(), period.to(), total, employees);
	}

}
