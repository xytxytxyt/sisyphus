# Sisyphus

This is a simple web app that helps me vet jobs and companies during a job search. When I'm not looking for a new job, it helps me quickly check out a job opportunity without spending too much time on it.

There's a React frontend and a FastAPI backend that uses [linkedin-api](https://github.com/tomquirk/linkedin-api) with my (or anyone's) LinkedIn credentials.

There has been no attempt to make this production-ready as it was written to have a single user.

There are commands in Makefiles to run the frontend and backend in dev mode.

FastAPI comes by default with Swagger: http://127.0.0.1:8000/docs
