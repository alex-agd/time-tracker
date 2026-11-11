-- Вымышленные данные для демо, подключаются только через FLYWAY_LOCATIONS
INSERT INTO employee (full_name, position)
VALUES ('Иван Петров', 'Backend-разработчик'),
       ('Мария Соколова', 'Frontend-разработчик'),
       ('Алексей Смирнов', 'QA-инженер');

INSERT INTO time_entry (employee_id, description, started_at, ended_at)
SELECT e.id, v.description, date_trunc('day', now()) - v.day_offset + v.start_at, date_trunc('day', now()) - v.day_offset + v.end_at
FROM (VALUES ('Иван Петров', 'Ревью API отчётов', INTERVAL '1 day', INTERVAL '9 hours', INTERVAL '11 hours 30 minutes'),
             ('Иван Петров', 'Миграции БД', INTERVAL '1 day', INTERVAL '12 hours', INTERVAL '15 hours'),
             ('Мария Соколова', 'Вёрстка страницы отчёта', INTERVAL '1 day', INTERVAL '10 hours', INTERVAL '13 hours 15 minutes'),
             ('Алексей Смирнов', 'Регресс таймера', INTERVAL '2 days', INTERVAL '9 hours 30 minutes', INTERVAL '12 hours'))
         AS v(full_name, description, day_offset, start_at, end_at)
         JOIN employee e ON e.full_name = v.full_name;
