@echo off
set source=icon.png
for %%d in (hdpi mdpi xhdpi xxhdpi xxxhdpi) do (
    if exist "android\app\src\main\res\mipmap-%%d" (
        copy /y "%source%" "android\app\src\main\res\mipmap-%%d\ic_launcher.png"
        copy /y "%source%" "android\app\src\main\res\mipmap-%%d\ic_launcher_round.png"
        copy /y "%source%" "android\app\src\main\res\mipmap-%%d\ic_launcher_foreground.png"
        echo Updated all icons in mipmap-%%d
    )
)
