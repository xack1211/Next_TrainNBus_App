import requests
import json
from datetime import datetime

api = "https://data.etabus.gov.hk/"

routes = requests.get(api + "v1/transport/kmb/route").json()

def searchRoute(route):
    route = route.upper()
    if route in routes["route"]:
        return True
    else:
        return False
    
def searchStop(stop):
    stop = stop.upper()
    stops = requests.get(api + "v1/transport/kmb/stop").json()
    for s in stops["data"]:
        if s["name_en"].upper() == stop or s["name_tc"].upper() == stop:
            return True
    return False

def viewRoute(route, direction, service_type):
    if direction == None:
        direction = "outbound"
    if service_type == None:
        service_type = "1"
    route = route.upper()
    if searchRoute(route,):
        routeInfo = requests.get(api + "v1/transport/kmb/route/{route}/{direction}/{service_type}")
