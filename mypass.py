import re
import requests
import time
import json
import sys
from des import str_enc
from data import users


def mypass_main(username, password):
    session = requests.session()

    session.trust_env = False

    redirect_login_page = session.get(
        "https://enroll.scut.edu.cn/door/index.html")
    lt_pattern = re.compile(r'<input.+name="lt"\s+value="([^"]+)"')
    lt = re.search(lt_pattern, redirect_login_page.text).group(1)

    login_post_param = {
        'ul': len(username),
        'pl': len(password),
        'lt': lt,
        'rsa': str_enc(username + password + lt, '1', '2', '3'),
        'execution': 'e1s1',
        '_eventId': 'submit'
    }

    login = session.post(
        url="https://sso.scut.edu.cn/cas/login" +
        "?service=https%3A%2F%2Fenroll.scut.edu.cn%2Fdoor%2Fhealth%2Fh5%2Fhealth.html'",
        data=login_post_param
    )

    health_data_res = session.get(
        "https://enroll.scut.edu.cn/door/health/h5/get")

    health_data = json.loads(health_data_res.text)['data']['healthRptInfor']

    post_health_data = {
        "dRptDate": health_data["dRptDate"],
        "sPersonName": health_data["sPersonName"],
        "sPersonCode": health_data["sPersonCode"],
        "sPhone": health_data["sPhone"],
        "sParentPhone": health_data["sParentPhone"],
        "iIsGangAoTai": health_data["iIsGangAoTai"],
        "iIsOversea": health_data["iIsOversea"],
        "sHomeProvName": health_data["sHomeProvName"],
        "sHomeProvCode": health_data["sHomeProvCode"],
        "sHomeCityName": health_data["sHomeCityName"],
        "sHomeCityCode": health_data["sHomeCityCode"],
        "sHomeCountyName": health_data["sHomeCountyName"],
        "sHomeCountyCode": health_data["sHomeCountyCode"],
        "sHomeAddr": health_data["sHomeAddr"],
        "iSelfState": health_data["iSelfState"],
        "iFamilyState": health_data["iFamilyState"],
        "sNowProvName": health_data["sNowProvName"],
        "sNowProvCode": health_data["sNowProvCode"],
        "sNowCityName": health_data["sNowCityName"],
        "sNowCityCode": health_data["sNowCityCode"],
        "sNowCountyName": health_data["sNowCountyName"],
        "sNowCountyCode": health_data["sNowCountyCode"],
        "sNowAddr": health_data["sNowAddr"],
        "iNowGoRisks": health_data["iNowGoRisks"],
        "iRctRisks": health_data["iRctRisks"],
        "iRctKey": health_data["iRctKey"],
        "iRctOut": health_data["iRctOut"],
        "iRctTouchKeyMan": health_data["iRctTouchKeyMan"],
        "iRctTouchBackMan": health_data["iRctTouchBackMan"],
        "iRctTouchDoubtMan": health_data["iRctTouchDoubtMan"],
        "iVaccinState": health_data["iVaccinState"],
        "iHealthCodeState": health_data["iHealthCodeState"],
        "iRptState": "0",
        "sVaccinFactoryName": health_data["sVaccinFactoryName"],
        "sVaccinFactoryCode": health_data["sVaccinFactoryCode"],
        "iVaccinType": health_data["iVaccinType"],
        "dVaccin1Date": health_data["dVaccin1Date"],
        "sDegreeCode": health_data["sDegreeCode"],
        "iSex": health_data["iSex"],
        "sCollegeName": health_data["sCollegeName"],
        "sCampusName": health_data["sCampusName"],
        "sDormBuild": health_data["sDormBuild"],
        "sDormRoom": health_data["sDormRoom"],
        "sMajorName": health_data["sMajorName"],
        "sClassName": health_data["sClassName"],
        "iInSchool": health_data["iInSchool"]
    }

    add_data = session.post(
        url='https://enroll.scut.edu.cn/door/health/h5/add',
        data=post_health_data
    )

    with open(sys.path[0] + '/mypasslog', 'a') as f:
        f.write(time.strftime("%Y-%m-%d %H:%M:%S",
                time.localtime()) + ": " + "\n")
        f.write("username: " + username + "\n")
        f.write("result: " + add_data.text + '\n')


def main():
    for user in users:
        mypass_main(user["username"], user["password"])


if __name__ == '__main__':
    main()
