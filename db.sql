CREATE TABLE users (
    user_id SERIAL NOT NULL PRIMARY KEY,
    user_name VARCHAR(255),
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id SERIAL NOT NULL PRIMARY KEY,
    role_name VARCHAR(255),
    description TEXT
);

CREATE TABLE user_role (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE manufacturers (
    manufacturer_id SERIAL NOT NULL PRIMARY KEY,
    m_name VARCHAR(255)
);

CREATE TABLE status (
    status_id SERIAL NOT NULL PRIMARY KEY,
    status_name VARCHAR(255) NOT NULL UNIQUE,
    status_type VARCHAR(255) NOT NULL
);

CREATE TABLE products (	
    product_id SERIAL NOT NULL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    remaining INTEGER NOT NULL,
    img VARCHAR(255),
    rating_score FLOAT DEFAULT 5,
    status_id INTEGER,
    FOREIGN KEY (status_id) REFERENCES status(status_id)
);

create table reviews (
	product_id integer not null ,
	user_id integer not null,
	reviews_msg varchar(255) not null ,
    rating FLOAT NOT NULL CHECK (rating > 0 AND rating <= 5),
	primary key (product_id,user_id) ,
	foreign key (product_id) references products(product_id),
	foreign key (user_id) references users(user_id)
);

create table orders (
	order_id serial not null primary key,
	total float not null default 0 ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	user_id integer not null ,
	foreign key (user_id) references users(user_id)
);

create table order_details (
	order_id integer not null ,
	product_id integer not null,
	total float not null default 0,
	quantity integer not null default 1,
	primary key (order_id,product_id) ,
	foreign key (order_id) references orders(order_id),
	foreign key (product_id) references products(product_id)
);

create table order_status (
	status_id integer not null,
	order_id integer not null,
	primary key (status_id,order_id) ,
	foreign key (status_id) references status(status_id),
	foreign key (order_id) references orders(order_id)
)

