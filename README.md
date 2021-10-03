#  Job1Second (Server)


---
**Job1Second** is an employment-oriented website for students and new graduate. Job1Second allows to find suitable jobs for job seeker or suitable candidates for employers within a second.


Both sides have a direct and quick access to information and profiles based on needs, skills and abilities.

---

## Demo
- <a href="http://job1s.s3-website.eu-central-1.amazonaws.com" target="_blank">Click here !</a>

#### Linked Repository
- <a href="https://github.com/apooe/job1s-client" target="_blank"/>Client side repository</a> 

### Prerequisites
* This project use `node@^14`.
* Setting up your `.env` file (example below) :
```.env
PORT=8080

#Mongo URI
DATABASE_URL=

#Google place api key
GOOGLE_API_KEY=

#Auth
JWT_SECRET=

#AWS
AWS_ID=
AWS_SECRET=
AWS_UPLOAD_BUCKET_NAME=
```

### Installing

Clone the repository:
```
git clone https://github.com/apooe/job1s-server
```

Install dependencies:
```
npm install
```

Run for development:

```
npm start:dev
```

## Authors

* **Laurie Cohen Solal** - *Initial work* - [Website](https://lauriecs.com/)

See also the list of [contributors](https://github.com/apooe/job1s-server) who participated in this project.

## License
> 
>MIT
> 
