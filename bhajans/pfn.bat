@echo off
setlocal enabledelayedexpansion

rem Output file
set outputfile=output.txt
echo. > %outputfile%

rem Iterate through all .txt files in alphabetical order
for /f "delims=" %%f in ('dir /b /on *.txt') do (
    rem Get the first line of the file
    set "firstline="
    for /f "delims=" %%l in ('type "%%f"') do (
        if not defined firstline set "firstline=%%l"
    )

    rem Write the filename and the first line to the output file on the same line
    echo %%f: !firstline! >> %outputfile%
)

echo Processing complete. Output saved to %outputfile%.
endlocal
