# Folder Structure for express application
```
-server.ts
    actual server initalization

database-services
    -contains services for various collections of nosql db such as login/register, userdata, orders etc
    -file example : main.db.ts => /FILE-PURPOSE/database

interfaces
    -contains interfaces for various functions classes for easily understandability
    -file example : auth.if.ts => /FILE-PURPOSE/INTERFACE

middlewares
    -contains shareable middleware services for various routers

services
    -contains main business logic for enterprise application
    :nested structure 
        /authentication
            -authentication.s.ts
            -authentication.r.ts
        /payment
            -payment.s.ts
            -payment.r.ts

utils
    -contains helper file(s)

.env
    -environment variable

```