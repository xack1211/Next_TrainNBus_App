import requests
import json
from datetime import datetime

api = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php"
lines = ["AEL", "TCL", "TML", "TKL", "EAL", "SIL", "TWL", "ISL", "KTL", "DRL"]
lang = ["EN", "TC"]
directions = ["UP", "DOWN"]

def getETA(line, station, direction, lang):
    enquiry = api + "?line=" + line + "&sta=" + station + "&lang=" + lang
    response = requests.get(enquiry).json()
    for i in range(4):
        currentTime = datetime.strptime(response["data"][line+"-"+station]["curr_time"], "%Y-%m-%d %H:%M:%S")
        etaTime = datetime.strptime(response["data"][line+"-"+station][direction][i]["time"], "%Y-%m-%d %H:%M:%S")
        diff = (etaTime - currentTime)
        re = str(diff.seconds // 60) + " mins | " + etaTime.strftime("%H:%M:%S")
        return re

