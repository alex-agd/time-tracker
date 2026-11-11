package com.example.timetracker.report;

import java.time.Instant;

import com.example.timetracker.common.Period;
import com.example.timetracker.report.dto.ReportResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports")
public class ReportController {

	private final ReportService reportService;

	public ReportController(ReportService reportService) {
		this.reportService = reportService;
	}

	@GetMapping("/summary")
	@Operation(operationId = "getReportSummary", summary = "Общее время каждого сотрудника за период [from, to)")
	public ReportResponse getReportSummary(@Parameter(example = "2026-11-01T00:00:00Z") @RequestParam Instant from,
			@Parameter(example = "2026-12-01T00:00:00Z") @RequestParam Instant to) {
		return reportService.summarize(Period.of(from, to));
	}

}
