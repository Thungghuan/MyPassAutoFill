echo "" > $PWD/mypasslog

crontab -l > conf 2>/dev/null
echo "0 8 * * * python3 $PWD/mypass.py >> $PWD/mypasslog 2>&1"  >> conf
crontab conf
rm -f conf

echo "You can check log file at $PWD/mypasslog"
