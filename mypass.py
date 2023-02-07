from datetime import date, datetime
import re
import requests
import time
import json
import sys
from des import str_enc
from data import users


class MyPass:
    def __init__(self, username: str, password: str) -> None:
        self.session = requests.session()
        self.session.trust_env = False
        self.username = username
        self.password = password

    def login(self):
        redirect_login_page = self.session.get(
            "https://enroll.scut.edu.cn/door/index.html"
        )
        lt_pattern = re.compile(r'<input.+name="lt"\s+value="([^"]+)"')
        lt = re.search(lt_pattern, redirect_login_page.text).group(1)

        login_post_param = {
            "ul": len(self.username),
            "pl": len(self.password),
            "lt": lt,
            "rsa": str_enc(self.username + self.password + lt, "1", "2", "3"),
            "execution": "e1s1",
            "_eventId": "submit",
        }

        self.session.post(
            url="https://sso.scut.edu.cn/cas/login"
            + "?service=https%3A%2F%2Fenroll.scut.edu.cn%2Fdoor%2Fhealth%2Fh5%2Fhealth.html'",
            data=login_post_param,
        )

    def get_health_data(self):
        health_data_res = self.session.get(
            "https://enroll.scut.edu.cn/door/health/h5/get"
        )
        self.health_data = json.loads(health_data_res.text)["data"]["healthRptInfor"]
        self.last_submit_date = self.health_data["dRptDate"]

    @property
    def is_continuous(self):
        """
        判断是否连续填报（上次填报是30天内）
        """
        today = date.today()
        last_date = datetime.strptime(self.last_submit_date, "%Y-%m-%d").date()
        return (today - last_date).days <= 30

    def post_health_data(self):
        post_health_data = {}
        for key in self.health_data:
            post_health_data[key] = self.health_data[key]

        add_data = self.session.post(
            url="https://enroll.scut.edu.cn/door/health/h5/add", data=post_health_data
        )
        self.write_log(add_data.text)

    def write_log(self, result):
        with open(sys.path[0] + "/mypasslog", "a") as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + ": " + "\n")
            f.write("username: " + self.username + "\n")
            f.write("result: " + result + "\n")


def main():
    for user in users:
        mypass = MyPass(user["username"], user["password"])

        mypass.login()
        mypass.get_health_data()

        if mypass.is_continuous:
            mypass.post_health_data()
        else:
            print(f"上次填报的日期是{mypass.last_submit_date}, 已超过30天")
            print("请先在系统重新填报一次后再使用本工具")


if __name__ == "__main__":
    main()
