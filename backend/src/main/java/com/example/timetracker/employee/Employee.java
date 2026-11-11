package com.example.timetracker.employee;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "full_name", nullable = false, length = 200)
	private String fullName;

	@Column(name = "position", length = 200)
	private String position;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	protected Employee() {
	}

	public Employee(String fullName, String position, Instant createdAt) {
		this.fullName = fullName;
		this.position = position;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public String getFullName() {
		return fullName;
	}

	public String getPosition() {
		return position;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

}
