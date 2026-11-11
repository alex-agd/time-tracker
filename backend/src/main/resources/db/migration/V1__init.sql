CREATE TABLE employee
(
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name  VARCHAR(200) NOT NULL,
    position   VARCHAR(200),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE time_entry
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id BIGINT       NOT NULL REFERENCES employee (id) ON DELETE CASCADE,
    description VARCHAR(500) NOT NULL,
    started_at  TIMESTAMPTZ  NOT NULL,
    ended_at    TIMESTAMPTZ,
    CONSTRAINT time_entry_period_chk CHECK (ended_at IS NULL OR ended_at >= started_at)
);

-- Не больше одного запущенного таймера на сотрудника, даже при гонке параллельных запросов
CREATE UNIQUE INDEX time_entry_one_running_uq ON time_entry (employee_id) WHERE ended_at IS NULL;

CREATE INDEX time_entry_employee_started_idx ON time_entry (employee_id, started_at);
