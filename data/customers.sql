INSERT INTO customers (
    first_name, last_name, email, phone, address, notes, active, created_at, updated_at
) VALUES
    ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'Customer since 2020', true, now(), now()),
    ('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210', '456 Oak St', 'VIP customer', true, now(), now()),
    ('Alice', 'Johnson', 'alice.johnson@example.com', '555-123-4567', '789 Pine St', NULL, true, now(), now()),
    ('Bob', 'Brown', 'bob.brown@example.com', '444-555-6666', '321 Maple St', 'Preferred customer', true, now(), now()),
    ('Charlie', 'Davis', 'charlie.davis@example.com', '222-333-4444', '654 Elm St', 'New customer', true, now(), now());