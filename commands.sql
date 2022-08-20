CREATE TABLE machine_inventory (
    id serial,
    drink_name text,
    quantity int
);

CREATE TABLE deposit (
    id serial,
    coin_type text,
    balance decimal(6,2)
);

CREATE TABLE user_inventory (
    id serial,
    drink_name text,
    quantity int
);
