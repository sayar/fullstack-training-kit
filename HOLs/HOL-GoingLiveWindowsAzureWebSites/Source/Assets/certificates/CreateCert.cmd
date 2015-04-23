@echo off

IF NOT EXIST "%~dp0certs" (
    MKDIR "%~dp0certs"
)


makecert.exe -n "CN=www.[YOUR-CUSTOM-DOMAIN].com" -in "Center Root CA" -ss my -e "07/01/2022" -eku 1.3.6.1.5.5.7.3.1 -pe -sky exchange "%~dp0certs\mycert.cer" -sv "%~dp0certs\mycert.pvk" -len 2048
pvk2pfx -pvk "%~dp0certs\mycert.pvk" -spc "%~dp0certs\mycert.cer" -pfx "%~dp0certs\mycert.pfx" -pi Passw0rd!