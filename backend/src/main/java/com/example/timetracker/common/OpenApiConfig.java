package com.example.timetracker.common;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class OpenApiConfig {

	@Bean
	OpenAPI timeTrackerOpenApi() {
		return new OpenAPI().info(new Info().title("Time Tracker API")
			.version("1.0")
			.description("Учёт рабочего времени сотрудников"));
	}

}
