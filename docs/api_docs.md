### Please note that until ConfigDN 1.0 releases, breaking API changes might occur in small version changes. We will try to keep these docs up to date 

```
BASE_API = https://cdn.configdn.com/public_api/v1/
Authorization = ABCXYZ
```

To get your auth token, you can vist the web UI, and the API key will be displayed at the bottom.



#### Get Config

GET: `$BASE_API + "/get_config/" `

Headers: `Authorization : $Authorization `


Response:

```json

    "s": true,
    "d": {
        "flag1": {
            "v": "abcxyz"
        },
        "flag2": {
            "v": ["abcxyz"]
        }

   }
```

The response JSON's `d` value holds all the data. `flag1` is an example flag, and the value of it is held within `v`. `flag2` in this example has an array for it's value.