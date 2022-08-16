read -p "请确保你已更新过最新的数据！[yN] " yn
case $yn in
    [Yy]* ) break;;
    [Nn]* ) echo "请先在系统中填报/更新一次最新数据在使用本脚本:)"; exit;;
    * ) exit ;;
esac

echo "" >> $PWD/mypasslog

crontab -l > conf 2>/dev/null
echo "30 8 * * * python3 $PWD/mypass.py >> $PWD/mypasslog 2>&1"  >> conf
crontab conf
rm -f conf

echo "You can check log file at $PWD/mypasslog"
