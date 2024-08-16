@echo off
setlocal enabledelayedexpansion

rem Output file
set outputfile=list.inf
echo. > %outputfile%

rem Iterate through all .txt files in alphabetical order
for /f "delims=" %%f in ('dir /b /on *.txt') do (
    rem Get the first line of the file
    set "firstline="
    for /f "delims=" %%l in ('type "%%f"') do (
        if not defined firstline set "firstline=%%l"
    )

	rem Extract the filename without extension
    set "filename=%%~nf"
	
    rem Write the filename and the first line to the output file on the same line
    rem (old) echo %%f: !firstline! >> %outputfile%
	rem echo '!filename! 	'hin: '!firstline!', dir: 'b1', id: '!filename!' >> %outputfile%
	echo { eng: '', hin: '!firstline!', dir: 'b1', id: '!filename!', bk: '', pg: '',  }, >> %outputfile%

)

echo Processing complete. Output saved to %outputfile%.
endlocal
