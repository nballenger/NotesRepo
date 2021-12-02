# Notes on Essential SQLAlchemy, 2nd Ed.

# Chapter 1: Schemas and Types

```Python
from datetime import datetime

from sqlalchemy import (MetaData, Table, Column, Integer, Numeric, String,
                        DateTime, ForeignKey, create_engine)
metadata = MetaData()

cookies = Table('cookies', metadata,
    Column('cookie_id', Integer(), primary_key=True),
    Column('cookie_name', String(50), index=True),
    Column('cookie_recipe_url', String(255)),
    Column('cookie_sku', String(55)),
    Column('quantity', Integer()),
    Column('unit_cost', Numeric(12, 2))
)

users = Table('users', metadata,
    Column('user_id', Integer(), primary_key=True),
    Column('customer_number', Integer(), autoincrement=True),
    Column('username', String(15), nullable=False, unique=True),
    Column('email_address', String(255), nullable=False),
    Column('phone', String(20), nullable=False),
    Column('password', String(25), nullable=False),
    Column('created_on', DateTime(), default=datetime.now),
    Column('updated_on', DateTime(), default=datetime.now, onupdate=datetime.now)
)

orders = Table('orders', metadata,
    Column('order_id', Integer(), primary_key=True),
    Column('user_id', ForeignKey('users.user_id'))
)

line_items = Table('line_items', metadata,
    Column('line_items_id', Integer(), primary_key=True),
    Column('order_id', ForeignKey('orders.order_id')),
    Column('cookie_id', ForeignKey('cookies.cookie_id')),
    Column('quantity', Integer()),
    Column('extended_cost', Numeric(12, 2))
)

engine = create_engine('sqlite:///:memory:')
metadata.create_all(engine)
```

# Chapter 2: Working with Data via SQLAlchemy Core

```Python


```

# Chapter 3: Exceptions and Transactions

## Exceptions

### AttributeError

* When you try to access an attribute that doesn't exist
* Often when trying to access a column on a `ResultProxy` that isn't there

    ```Python
    from sqlalchemy import select, insert

    ins = insert(users).values(
        username="cookiemon",
        email_address="mon@cookie.com",
        phone="123456",
        password="password"
    )
    result = connection.execute(ins)

    s = select([users.c.username])
    results = connection.execute(s)
    for result in results:
        print(result.username)
        print(result.password)      # triggers AttributeError
    ```

### IntegrityError

* When you try to do something that violates constraints on a Column or Table
* Often around uniqueness with a subsequent insert or update

    ```Python
    s = elect([users.c.username])
    connection.execute(s).fetchall()

    ins = insert(users).values(
        username="cookiemon",
        email_address="damon@cookie.com",
        phone="123456",
        password="password"
    )
    result = connection.execute(ins)    # raises IntegrityError on username uniqueness
    ```

### Handling Errors

Use try/catch blocks.

## Transactions

# Chapter 4: Testing

Covers how to do functional tests against a database, how to mock out SQLAlchemy queries and connections.

## Testing with a Test Database

Example of a DataAccessLayer class that initializes with no engine/connection:

```Python
from datetime import datetime
from sqlalchemy import (MetaData, Table, Column, Integer, Numeric, String,
                        DateTime, ForeignKey, Boolean, create_engine)

class DataAccessLayer:
    connect = None
    engine = None
    conn_string = None
    metadata = MetaData()
    cookies = Table('cookies', metadata,
        Column('cookie_id', Integer(), primary_key=True),
        ...
    )

    def db_init(self, conn_string):
        self.engine = create_engine(conn_string or self.conn_string)
        self.metadata.create_all(self.engine)
        self.connection = self.engine.connect()

dal = DataAccessLayer()
```

Using the above in an `app.py` file:

```Python
from db import dal
from sqlalchemy.sql import select

def get_orders_by_customer(cust_name, shipped=None, details=False):
    columns = [dal.orders.c.order_id, dal.users.c.username, dal.users.c.phone]
    joins = dal.users.join(dal.orders)

    if details:
        columns.extend([dal.cookies.c.cookie_name,
                        dal.line_items.c.quantity,
                        dal.line_items.c.extended_cost])
        joins = joins.join(dal.line_items).join(dal.cookies)

    cust_orders = select(columns)
    cust_orders = cust_orders.select_from(joins).where(
        dal.users.c.username == cust_name)

    if shipped is not None:
        cust_orders = cust_orders.where(dal.orders.c.shipped == shipped)

    return dal.connection.execute(cust_orders).fetchall()
```

# Chapter 6: Defining Schema with SQLAlchemy ORM

## Defining Tables via ORM Classes

* A class for use with the ORM must do four things:
    * Inherit from `declarative_base`
    * Contain `__tablename__`
    * Contain one or more attributes as `Column` objects
    * Ensure 1+ attributes constitute a primary key
* In declarative classes, you don't declare the column name as the first argument to the `Column` constructor--it will be set to the attribute name it's assigned to
* Cookie class defined as an ORM class:

    ```Python
    from sqlalchemy import Table, Column, Integer, Numeric, String
    from sqlalchemy.ext.declarative import declarative_base

    Base = declarative_base()

    class Cookie(Base):
        __tablename__ = 'cookies'

        cookie_id = Column(Integer(), primary_key=True)
        cookie_name = Column(String(50), index=True)
        cookie_recipe_url = Column(String(255))
        cookie_sku = Column(String(55))
        quantity = Column(Integer())
        unit_cost = Column(Numeric(12, 2))
    ```

* In the ORM you define keys/constraints/indexes in the `__table_args__` class attribute:

    ```Python
    class SomeDataClass(Base):
        __tablename__ = 'somedatatable'
        __table_args__ = (
            ForeignKeyConstraint(['id'], ['other_table.id']),
            CheckConstraint(unit_cost >= 0.00, name='unit_cost_positive')
        )
    ```

## Relationships

A table with a relationship:

```Python
from sqlalchemy import ForeignKey, Boolean
from sqlalchemy.orm import relationship, backref

class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), ForeignKey('users.user_id'))
    shipped = Column(Boolean(), default=False)

    user = relationship("User", backref=backref('orders', order_by=order_id))
```

# Chapter 7: Working with Data via SQLAlchemy ORM

## The Session

* Wraps a db connection via an engine
* Provides an identity map for objects you load via the session, or associate with the session
* Also wraps a transaction, which is open until the session si committed or rolled back
* To create a new session you get `sessionmaker`
* The `sessionmaker` factory should be used just once in your app global scope, and treated like a configuration setting

    ```Python
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    engine = create_engine('sqlite:///:memory:')

    Session = sessionmaker(bind=engine)

    session = Session()
    ```

* The `session` won't actually connect to the db until given instructions requiring it to
* You can create data by attaching it to the session and then committing the session

    ```Python
    cc_cookie = Cookie(cookie_name='chocolate chip', ...)
    session.add(cc_cookie)
    session.commit()
    ```

* When the instance of `Cookie` is created and added to the session, nothing is sent
* When commit is called, this happens:
    * A transaction is started
    * An INSERT is execute
    * The transaction is committed
