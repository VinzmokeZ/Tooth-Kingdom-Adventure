Set WshShell = CreateObject("WScript.Shell")

' Path to the project root
strRoot = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' 1. Start Python Backend in background
' Use pythonw.exe or just python.exe with WindowStyle 0 (hidden)
WshShell.Run "cmd /c cd /d """ & strRoot & "\backend\python"" && python main.py", 0, False

' 2. Start Vite Frontend in background
WshShell.Run "cmd /c cd /d """ & strRoot & """ && npm run dev -- --host", 0, False

' 3. Wait a few seconds for servers to boot, then open the browser
WScript.Sleep 5000
WshShell.Run "http://localhost:5173", 1, False
