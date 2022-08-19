-- rename tables "drinks", "coins"
CREATE TABLE inventory (
    id serial,
    drink_name text,
    quantity int
);

CREATE TABLE coins_deposited (
    id serial,
    coins int
);

