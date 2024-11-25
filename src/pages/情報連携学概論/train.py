# from urllib import request
# import json

# TOEI_TRAIN_API = 'https://api-public.odpt.org/api/v4/odpt:Train?odpt:operator=odpt.Operator:Toei'

# with request.urlopen(TOEI_TRAIN_API) as res:
    # result = json.loads(res.read().decode('utf-8'))

# print(len(result))



# from urllib import request
# import json

# DOCOMO_BIKE_API = 'https://api-public.odpt.org/api/v4/gbfs/docomo-cycle/station_information.json'

# with request.urlopen(DOCOMO_BIKE_API) as res:
    # result = json.loads(res.read().decode('utf-8'))

# print(len(result['data']['stations']))


from urllib import request
import json

DOCOMO_BIKE_API = 'https://api-public.odpt.org/api/v4/gbfs/docomo-cycle/station_information.json'

with request.urlopen(DOCOMO_BIKE_API) as res:
    result = json.loads(res.read().decode('utf-8'))

min = 90
for station in result['data']['stations']:
    if station['lat'] < min:
        min = station['lat']
        min_name = station['name']

print(min_name)
