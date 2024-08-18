# README

### Running:
```console
$ docker compose up
```

### Endpoints:
```
POST /webhook/checkout-abandoned/  # webhook for abandoned checkouts
POST /webhook/order-placed/        # webhook for orders placed

GET  /api/messages?page=1  # get all msgs sent to customers (paginated)
GET  /api/orders?page=1    # get orders placed through these messages (paginated)

GET  /api/message_schedule/  # get current msg schedule
POST /api/message_schedule/  # set new msg schedule
```
