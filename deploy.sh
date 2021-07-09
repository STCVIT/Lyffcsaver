cd ./server
rm -rf build
cd ../client
yarn run build
cd ../server
git init
git add .
git add -f data/ build/
git commit -am "deploy"
heroku git:remote -a lyffcsaver
git push --force heroku master
rm -rf .git
