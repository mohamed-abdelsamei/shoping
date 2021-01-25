#Retail


    - src
    ---- controllers
    ---- models
    ---- middlewares
    ---- routes
    ---- utils
    ---- config
    ---- validation   define request schema, validate body


## POST /api/user 
register

    {
        "name": "user",
        "email":"user@shop.com",
        "password":123456
    }

## POST /api/user/login

    {
        "email":"user@shop.com",
        "password": 123456
    }

## POST /api/order
    {
        "products": [
            {
                "id": "600e1eeee9074ea699cf3822",
                "quantity": 2
            }
        ]
    }