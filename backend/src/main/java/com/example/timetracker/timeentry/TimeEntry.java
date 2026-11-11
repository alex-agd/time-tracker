package com.example.timetracker.timeentry;

import java.time.Instant;

import com.example.timetracker.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "time_entry")
public class TimeEntry {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false, updatable = false)
	private Employee employee;

	@Column(name = "description", nullable = false, length = 500)
	private String description;

	@Column(name = "started_at", nullable = false, updatable = false)
	private Instant startedAt;

	@Column(name = "ended_at")
	private Instant endedAt;

	protected TimeEntry() {
	}

	public TimeEntry(Employee employee, String description, Instant startedAt) {
		this.employee = employee;
		this.description = description;
		this.startedAt = startedAt;
	}

	public void stop(Instant at) {
		if (endedAt != null) {
			throw new IllegalStateException("Запись уже остановлена");
		}
		// Защита от перевода часов назад: длительность не может стать отрицательной
		this.endedAt = at.isBefore(startedAt) ? startedAt : at;
	}

	public boolean isRunning() {
		return endedAt == null;
	}

	public Long getId() {
		return id;
	}

	public Long getEmployeeId() {
		return employee.getId();
	}

	public String getDescription() {
		return description;
	}

	public Instant getStartedAt() {
		return startedAt;
	}

	public Instant getEndedAt() {
		return endedAt;
	}

}
