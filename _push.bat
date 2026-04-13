@echo off
cd /d C:\Users\atari\rika-mynote-push
git add -A > "%TEMP%\git_out.txt" 2>&1
git commit -m "feat: apply MkDocs Material best practices (abbr, snippets, repo edit link, refined JS/CSS)" >> "%TEMP%\git_out.txt" 2>&1
git push origin main >> "%TEMP%\git_out.txt" 2>&1
echo DONE >> "%TEMP%\git_out.txt"
