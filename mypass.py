import re
import requests
import json
from des import str_enc


def mypass_main(username, password):
    session = requests.session()

    redirect_login_page = session.get("https://enroll.scut.edu.cn/door/index.html")
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
        url="https://sso.scut.edu.cn/" +
            "cas/login?service=https%3A%2F%2F" +
            "enroll.scut.edu.cn%2Fdoor%2Fhealth%2Fh5%2Fhealth.html",
        data=login_post_param
    )

    mypass_page = session.get("https://enroll.scut.edu.cn/door/health/h5/health.html")

    # mypass_data = session.get("https://enroll.scut.edu.cn/door/health/h5/get")
    add_data = session.post("https://enroll.scut.edu.cn/door/health/h5/oneKeyAdd", data={})

    print(add_data.text)


def main():
    with open('./data.json', 'r') as f:
        data = json.load(f)
        for value in data:
            mypass_main(value['username'], value['password'])


if __name__ == '__main__':
    main()
