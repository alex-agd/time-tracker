package com.example.timetracker.common;

import java.time.Duration;
import java.time.Instant;

public record Period(Instant from, Instant to) {

	static final Duration MAX_LENGTH = Duration.ofDays(366);

	public static Period of(Instant from, Instant to) {
		if (from == null || to == null) {
			throw new BadRequestException("Параметры from и to обязательны");
		}
		if (!from.isBefore(to)) {
			throw new BadRequestException("Начало периода должно быть раньше конца");
		}
		if (Duration.between(from, to).compareTo(MAX_LENGTH) > 0) {
			throw new BadRequestException("Период не может быть длиннее 366 дней");
		}
		return new Period(from, to);
	}

}
