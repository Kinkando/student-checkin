deploy-heroku:
	ng build
	git add .
	git commit -m "deploy"
	git push heroku dev