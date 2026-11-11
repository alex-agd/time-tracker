package com.example.timetracker.report;

public interface EmployeeTotalView {

	Long getEmployeeId();

	String getFullName();

	String getPosition();

	long getTotalSeconds();

	long getEntriesCount();

}
