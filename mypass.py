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

    post_health_data = {}
    for key in health_data:
        post_health_data[key] = health_data[key]

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
