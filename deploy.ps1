cd .\server
rm -r -fo build
cd ..\client
yarn run build
cd ..\server
git init
git add .
git add -f data/ build/
git commit -am "deploy"
heroku git:remote -a lyffcsaver
git push --force heroku master
rm -r -fo .git
cd ..\
