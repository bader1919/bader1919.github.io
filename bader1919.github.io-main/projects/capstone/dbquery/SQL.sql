SELECT * FROM auto

SELECT DISTINCT event_type FROM auto;

-- Count How Many Times Each State/Event Type Appeared
SELECT event_type, COUNT(*) AS event_count
FROM auto
GROUP BY
    event_type
ORDER BY event_count DESC;

SELECT
    attributes,
    MIN(time_fired_ts) AS first_seen,
    MAX(time_fired_ts) AS last_seen
FROM auto
GROUP BY
    context_id;



SELECT
    context_id,
    MIN(time_fired_ts) AS first_seen,
    MAX(time_fired_ts) AS last_seen,
    TIMEDIFF(
        MAX(time_fired_ts),
        MIN(time_fired_ts)
    ) AS duration
FROM auto
GROUP BY
    context_id
HAVING
    DATE(first_seen) = DATE(last_seen);

--5️⃣ Daily Average Event Count
SELECT DATE(FROM_UNIXTIME(time_fired_ts)) AS date, COUNT(*) AS events_per_day
FROM auto
GROUP BY
    date
ORDER BY date DESC;

--1️⃣ Get Total Events
SELECT DATE(time_fired_ts) AS event_date, COUNT(*) AS events_per_day
FROM auto
WHERE
    time_fired_ts >= CURDATE() - INTERVAL 7 DAY
GROUP BY
    event_date
ORDER BY event_date DESC;

--1️⃣ Get Total Events Per Day
SELECT DATE(time_fired_ts) AS event_date, COUNT(*) AS events_per_day
FROM auto
GROUP BY
    event_date
ORDER BY event_date DESC;

--2️⃣ Get Events Per Day and Average Per Hour

SELECT
    DATE(time_fired_ts) AS event_date,
    COUNT(*) AS events_per_day,
    ROUND(COUNT(*) / 24, 2) AS avg_events_per_hour
FROM auto
GROUP BY
    event_date
ORDER BY event_date DESC;

--3️⃣ Get Events Per Day for Each event_type
SELECT
    DATE(time_fired_ts) AS event_date,
    event_type,
    COUNT(*) AS events_per_day
FROM auto
GROUP BY
    event_date,
    event_type
ORDER BY event_date DESC, events_per_day DESC;

--Compare Today’s Events vs. Yesterday
WITH
    daily_events AS (
        SELECT DATE(time_fired_ts) AS event_date, COUNT(*) AS events_per_day
        FROM auto
        GROUP BY
            event_date
    )
SELECT
    event_date,
    events_per_day,
    LAG(events_per_day) OVER (
        ORDER BY event_date
    ) AS previous_day_events,
    events_per_day - LAG(events_per_day) OVER (
        ORDER BY event_date
    ) AS change_from_previous_day
FROM daily_events
ORDER BY event_date DESC;

--Show Percentage Change from Previous Day
WITH
    daily_events AS (
        SELECT DATE(time_fired_ts) AS event_date, COUNT(*) AS events_per_day
        FROM auto
        GROUP BY
            event_date
    )
SELECT
    event_date,
    events_per_day,
    LAG(events_per_day) OVER (
        ORDER BY event_date
    ) AS previous_day_events,
    events_per_day - LAG(events_per_day) OVER (
        ORDER BY event_date
    ) AS change_from_previous_day,
    ROUND(
        (
            (
                events_per_day - LAG(events_per_day) OVER (
                    ORDER BY event_date
                )
            ) / LAG(events_per_day) OVER (
                ORDER BY event_date
            )
        ) * 100,
        2
    ) AS percentage_change
FROM daily_events
ORDER BY event_date DESC;

SELECT context_id, COUNT(*) AS event_count
FROM auto
GROUP BY
    context_id
ORDER BY event_count DESC;

SELECT
    context_parent_id,
    COUNT(*) AS event_count
FROM auto
WHERE
    context_parent_id IS NOT NULL
GROUP BY
    context_parent_id
ORDER BY event_count DESC;

WITH
    combined_events AS (
        SELECT
            context_id,
            context_parent_id,
            event_type,
            time_fired_ts,
            DATE(time_fired_ts) AS event_date,
            HOUR(time_fired_ts) AS event_hour
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
    )
SELECT
    ce.context_id,
    ce.context_parent_id,
    ce.event_date,
    ce.event_hour,
    COUNT(ce.event_type) AS event_count, -- Total number of events in the group per hour
    MIN(ce.time_fired_ts) AS first_event_time, -- Earliest event time per hour
    MAX(ce.time_fired_ts) AS last_event_time, -- Latest event time per hour
    ROUND(
        TIMESTAMPDIFF(
            SECOND,
            MIN(ce.time_fired_ts),
            MAX(ce.time_fired_ts)
        ) / 60,
        3
    ) AS time_difference_minutes -- Difference between first and last event per hour
FROM combined_events ce
GROUP BY
    ce.context_id,
    ce.context_parent_id,
    ce.event_date,
    ce.event_hour
ORDER BY ce.event_date DESC, ce.event_hour DESC, time_difference_minutes DESC;

WITH
    event_counts AS (
        SELECT
            context_parent_id,
            event_type,
            COUNT(*) AS event_count
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
        GROUP BY
            context_parent_id,
            event_type
    )
SELECT
    ec1.context_parent_id,
    COALESCE(ec1.event_count, 0) AS automation_count, -- Count of automations
    COALESCE(ec2.event_count, 0) AS call_service_count, -- Count of call_service events
    COALESCE(ec3.event_count, 0) AS state_change_count -- Count of state_changed events
FROM
    event_counts ec1
    LEFT JOIN event_counts ec2 ON ec1.context_parent_id = ec2.context_parent_id
    AND ec2.event_type = 'call_service'
    LEFT JOIN event_counts ec3 ON ec1.context_parent_id = ec3.context_parent_id
    AND ec3.event_type = 'state_changed'
WHERE
    ec1.event_type = 'automation_triggered'
ORDER BY automation_count DESC;

WITH
    event_summary AS (
        SELECT
            event_type,
            attributes,
            context_id,
            context_parent_id,
            COUNT(*) AS event_count,
            MIN(time_fired_ts) AS first_event_time,
            MAX(time_fired_ts) AS last_event_time,
            TIMESTAMPDIFF(
                SECOND,
                MIN(time_fired_ts),
                MAX(time_fired_ts)
            ) AS duration_seconds
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
        GROUP BY
            event_type,
            attributes,
            context_id,
            context_parent_id
    )
SELECT
    event_type,
    attributes,
    COUNT(DISTINCT context_id) AS unique_event_chains, -- Count of unique event chains
    SUM(event_count) AS total_events, -- Total number of events for this type & attribute
    MIN(first_event_time) AS first_event_time, -- Earliest event time in the group
    MAX(last_event_time) AS last_event_time, -- Latest event time in the group
    ROUND(SUM(duration_seconds) / 60, 3) AS total_duration_minutes -- Convert to minutes for easier analysis
FROM event_summary
GROUP BY
    event_type,
    attributes
ORDER BY event_type, total_events DESC;

WITH
    event_summary AS (
        SELECT
            event_type,
            attributes,
            context_id,
            context_parent_id,
            COUNT(*) AS event_count,
            MIN(time_fired_ts) AS first_event_time,
            MAX(time_fired_ts) AS last_event_time,
            TIMESTAMPDIFF(
                SECOND,
                MIN(time_fired_ts),
                MAX(time_fired_ts)
            ) AS duration_seconds
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
        GROUP BY
            event_type,
            attributes,
            context_id,
            context_parent_id
    )
SELECT
    event_type,
    attributes,
    COUNT(DISTINCT context_id) AS unique_event_chains, -- Count of unique event chains
    SUM(event_count) AS total_events, -- Total number of events for this type & attribute
    MIN(first_event_time) AS first_event_time, -- Earliest event time in the group
    MAX(last_event_time) AS last_event_time, -- Latest event time in the group
    ROUND(SUM(duration_seconds) / 60, 3) AS total_duration_minutes -- Convert to minutes for easier analysis
FROM event_summary
GROUP BY
    event_type,
    attributes
ORDER BY event_type, total_events DESC;

WITH
    event_summary AS (
        SELECT
            event_type,
            attributes,
            COUNT(DISTINCT context_id) AS unique_event_chains, -- Unique automation chains
            COUNT(DISTINCT context_parent_id) AS unique_triggers, -- Unique parent triggers
            COUNT(*) AS total_events, -- Total occurrences
            MIN(time_fired_ts) AS first_event_time, -- First event timestamp
            MAX(time_fired_ts) AS last_event_time -- Last event timestamp
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
        GROUP BY
            event_type,
            attributes
    )
SELECT
    event_type,
    attributes,
    unique_event_chains,
    unique_triggers,
    total_events,
    first_event_time,
    last_event_time
FROM event_summary
ORDER BY event_type, total_events DESC;

WITH
    event_sequence AS (
        SELECT
            context_id,
            event_type,
            time_fired_ts,
            ROW_NUMBER() OVER (
                PARTITION BY
                    context_id
                ORDER BY time_fired_ts
            ) AS event_order
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
    )
SELECT
    e1.context_id,
    e1.event_type AS first_event,
    e1.time_fired_ts AS first_time,
    e2.event_type AS second_event,
    e2.time_fired_ts AS second_time,
    TIMESTAMPDIFF(
        SECOND,
        e1.time_fired_ts,
        e2.time_fired_ts
    ) AS time_to_call_service,
    e3.event_type AS third_event,
    e3.time_fired_ts AS third_time,
    TIMESTAMPDIFF(
        SECOND,
        e2.time_fired_ts,
        e3.time_fired_ts
    ) AS time_to_state_change,
    TIMESTAMPDIFF(
        SECOND,
        e1.time_fired_ts,
        e3.time_fired_ts
    ) AS total_time_taken
FROM
    event_sequence e1
    JOIN event_sequence e2 ON e1.context_id = e2.context_id
    AND e1.event_order + 1 = e2.event_order
    JOIN event_sequence e3 ON e2.context_id = e3.context_id
    AND e2.event_order + 1 = e3.event_order
WHERE
    e1.event_type = 'automation_triggered'
    AND e2.event_type = 'call_service'
    AND e3.event_type = 'state_changed'
ORDER BY e1.time_fired_ts;

WITH
    event_sequence AS (
        SELECT
            context_id,
            event_type,
            time_fired_ts,
            ROW_NUMBER() OVER (
                PARTITION BY
                    context_id
                ORDER BY time_fired_ts
            ) AS event_order
        FROM auto
        WHERE
            event_type IN (
                'automation_triggered',
                'call_service',
                'state_changed'
            )
    )
SELECT
    e1.context_id,
    e1.event_type AS first_event,
    e1.time_fired_ts AS first_time,
    e2.event_type AS second_event,
    e2.time_fired_ts AS second_time,
    ROUND(
        TIMESTAMPDIFF(
            MICROSECOND,
            e1.time_fired_ts,
            e2.time_fired_ts
        ) / 1000000,
        3
    ) AS time_to_call_service_seconds,
    e3.event_type AS third_event,
    e3.time_fired_ts AS third_time,
    ROUND(
        TIMESTAMPDIFF(
            MICROSECOND,
            e2.time_fired_ts,
            e3.time_fired_ts
        ) / 1000000,
        3
    ) AS time_to_state_change_seconds,
    ROUND(
        TIMESTAMPDIFF(
            MICROSECOND,
            e1.time_fired_ts,
            e3.time_fired_ts
        ) / 1000000,
        3
    ) AS total_time_taken_seconds
FROM
    event_sequence e1
    JOIN event_sequence e2 ON e1.context_id = e2.context_id
    AND e1.event_order + 1 = e2.event_order
    JOIN event_sequence e3 ON e2.context_id = e3.context_id
    AND e2.event_order + 1 = e3.event_order
WHERE
    e1.event_type = 'automation_triggered'
    AND e2.event_type = 'call_service'
    AND e3.event_type = 'state_changed'
ORDER BY e1.time_fired_ts;
