package com.example.timetracker.timeentry;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import com.example.timetracker.IntegrationTest;
import com.example.timetracker.common.ConflictException;
import com.example.timetracker.timeentry.dto.StartTimerRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

class ConcurrentTimerTest extends IntegrationTest {

	private static final int ATTEMPTS = 8;

	@Autowired
	private TimerService timerService;

	@Autowired
	private TimeEntryRepository timeEntryRepository;

	@Test
	void parallelStartsCreateExactlyOneRunningEntry() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		CountDownLatch startSignal = new CountDownLatch(1);
		List<Future<Boolean>> results = new ArrayList<>();

		try (ExecutorService executor = Executors.newFixedThreadPool(ATTEMPTS)) {
			for (int i = 0; i < ATTEMPTS; i++) {
				results.add(executor.submit(() -> {
					startSignal.await();
					try {
						timerService.start(employeeId, new StartTimerRequest("Параллельный старт"));
						return true;
					}
					catch (ConflictException ex) {
						return false;
					}
				}));
			}
			startSignal.countDown();

			long succeeded = 0;
			for (Future<Boolean> result : results) {
				if (result.get()) {
					succeeded++;
				}
			}
			assertThat(succeeded).isEqualTo(1);
		}
		assertThat(timeEntryRepository.findAllByEndedAtIsNull()).hasSize(1);
	}

	@Test
	void parallelStopsSucceedExactlyOnce() throws Exception {
		long employeeId = createEmployee("Иван Петров");
		timerService.start(employeeId, new StartTimerRequest("Задача"));
		CountDownLatch startSignal = new CountDownLatch(1);
		List<Future<Boolean>> results = new ArrayList<>();

		try (ExecutorService executor = Executors.newFixedThreadPool(ATTEMPTS)) {
			for (int i = 0; i < ATTEMPTS; i++) {
				results.add(executor.submit(() -> {
					startSignal.await();
					try {
						timerService.stop(employeeId);
						return true;
					}
					catch (ConflictException ex) {
						return false;
					}
				}));
			}
			startSignal.countDown();

			long succeeded = 0;
			for (Future<Boolean> result : results) {
				if (result.get()) {
					succeeded++;
				}
			}
			assertThat(succeeded).isEqualTo(1);
		}
	}

}
