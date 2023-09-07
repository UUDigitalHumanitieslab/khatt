# KHATT
[![DOI](https://zenodo.org/badge/189247300.svg)](https://zenodo.org/badge/latestdoi/189247300)

Knowledge Hyperlinking and Text Transcription - this tool was developed by the Research Software Lab of the Centre for Digital Humanities of Utrecht University, in collaboration with Cornelis van Lit.

This draft gives an overview of the intended interface:
![KHATT4Interface](https://github.com/UUDigitalHumanitieslab/khatt/assets/11174072/d320648e-ecf5-45db-b77f-a6071f8f3e1e)


## To Run
### Without Docker
1. Install [Node](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/en/docs/install), [PostgreSQL](https://www.postgresql.org/) and  [Python 3.6](https://www.python.org/downloads/) on your computer.
2. Start PostgreSQL
3. To keep your Python packages isolated, install [virtualenv] (https://virtualenv.pypa.io/en/stable/installation.html)
4. Download this directory (using git clone or downloading a zip and extracting it)
5. Navigate to `{name-of-topdirectory}/backend`
6. Run `python bootstrap.py`
7. Follow the instructions of the script: setting up a virtual environment, creating the database, creating a superuser
8. Enable your virtual environment (in the typical case, by running `source activate .env`)
9. Navigate to `{name-of-topdirectory}`
10. Run `yarn`. This will install all frontend and backend dependencies. Grab a cup of coffee, tea or other beverage of your choice.
11. Run `yarn start`. This will start the server.
12. Open your browser. At `localhost:8000`, you should be able to see the application.
13. As there are no books in the database yet, create them. Navigate to `localhost:8000/api/books/` (NB: don't omit the last slash!)
14. There is a form at the bottom of the page which allows you to define a book with title and author.
15. Go to `localhost:8000/upload` to upload a manuscript page for the book (for now: .jpg, .png only).
16. Start marking and annotating
17. To download, go to `localhost:8000/download`. By clicking the download link, you will get *all* annotations in the database which have been marked as complete, with information about the associated book, manuscript and page.

### With Docker (requires 10 GB+ hard disk space)
1. NB: does not run on all Windows licenses, please check [this link](https://docs.docker.com/docker-for-windows/install/)
2. Download [Docker](https://www.docker.com/products/docker-desktop)
3. Download this directory (using git clone or downloading a zip and extracting it)
4. Navigate to `{name-of-your-khatt-directory}`
5. Run `docker-compose up`. This will build and start the application. Wait until all four containers (frontend, db, backend, nginx) have been started. Grab a cup of coffee in the meantime.
6. As there are no books in the database yet, create them. Navigate to `localhost/api/books/` (NB: don't omit the last slash!)
7. There is a form at the bottom of the page which allows you to define a book with title and author.
8. Go to `localhost/upload` to upload a manuscript page for the book (for now: .jpg, .png only).
9. Start marking and annotating
10. To download, go to `localhost/download`. By clicking the download link, you will get *all* annotations in the database which have been marked as complete, with information about the associated book, manuscript and page.
11. To stop the container at any point, press crtl-c.
12. To start the container again, repeat steps 4 and 5. Startup should go much faster (since the build only needs to be done once).

## For developers

You need to install the following software:

 - PostgreSQL >= 9.3, client, server and C libraries
 - Python >= 3.4, <= 3.7
 - virtualenv
 - WSGI-compatible webserver (deployment only)
 - [Visual C++ for Python][1] (Windows only)
 - Node.js >= 8
 - Yarn
 - [WebDriver][2] for at least one browser (only for functional testing)

[1]: https://wiki.python.org/moin/WindowsCompilers
[2]: https://pypi.org/project/selenium/#drivers


### Architecture

This project integrates three isolated subprojects, each inside its own subdirectory with its own code, package dependencies and tests:

 - **backend**: the server side web application based on [Django][3] and [DRF][4]

 - **frontend**: the client side web application based on [Angular](https://angular.io)

 - **functional-tests**: the functional test suite based on [Selenium][6] and [pytest][7]

[3]: https://www.djangoproject.com
[4]: https://www.django-rest-framework.org
[6]: https://www.seleniumhq.org/docs/03_webdriver.jsp
[7]: https://docs.pytest.org/en/latest/

Each subproject is configurable from the outside. Integration is achieved using "magic configuration" which is contained inside the root directory together with this README. In this way, the subprojects can stay truly isolated from each other.

If you are reading this README, you'll likely be working with the integrated project as a whole rather than with one of the subprojects in isolation. In this case, this README should be your primary source of information on how to develop or deploy the project. However, we recommend that you also read the "How it works" section in the README of each subproject.

### Quickstart

First time after cloning this project:

```console
$ yarn
```

Running the application in [development mode][8] (hit ctrl-C to stop):

```console
$ yarn start
```

This will run the backend and frontend applications, as well as their unittests, and watch all source files for changes. You can visit the frontend on http://localhost:8000/, the browsable backend API on http://localhost:8000/api/ and the backend admin on http://localhost:8000/admin/. On every change, unittests rerun, frontend code rebuilds and open browser tabs refresh automatically (livereload).

[8]: #development-mode-vs-production-mode


### Recommended order of development

For each new feature, we suggested that you work through the steps listed below. This could be called a back-to-front or "bottom up" order. Of course, you may have reasons to choose otherwise. For example, if very precise specifications are provided, you could move step 8 to the front for a more test-driven approach.

Steps 1–5 also include updating the unittests. Only functions should be tested, especially critical and nontrivial ones.

 1. Backend model changes including migrations.
 2. Backend serializer changes and backend admin changes.
 3. Backend API endpoint changes.
 4. Frontend model changes.
 5. Other frontend unit changes (templates, views, routers, FSMs).
 6. Frontend integration (globals, event bindings).
 7. Run functional tests, repair broken functionality and broken tests.
 8. [Add functional tests][9] for the new feature.
 9. Update technical documentation.

[9]: functional-tests/README.md#writing-tests

For release branches, we suggest the following checklist.

 1. Bump the version number in the `package.json` next to this README.
 2. Run the functional tests in production mode, fix bugs if necessary.
 3. Try using the application in production mode, look for problems that may have escaped the tests.
 4. Add regression tests (unit or functional) that detect problems from step 3.
 5. Work on the code until new regression tests from step 4 pass.
 6. Optionally, repeat steps 2–5 with the application running in a real deployment setup (see [Deployment](#deployment)).


### Commands for common tasks

The `package.json` next to this README defines several shortcut commands to help streamline development. In total, there are over 30 commands. Most may be regarded as implementation details of other commands, although each command could be used directly. Below, we discuss the commands that are most likely to be useful to you. For full details, consult the `package.json`.

Install the pinned versions of all package dependencies in all subprojects:

```console
$ yarn
```

Run backend and frontend in [production mode][8]:

```console
$ yarn start-p
```

Run the functional test suite:

```console
$ yarn test-func [FUNCTIONAL TEST OPTIONS]
```

The functional test suite by default assumes that you have the application running locally in production mode (i.e., on port `4200`). See [Configuring the browsers][10] and [Configuring the base address][11] in `functional-tests/README` for options.

[10]: functional-tests/README.md#configuring-the-browsers
[11]: functional-tests/README.md#configuring-the-base-address

Run *all* tests (mostly useful for continuous integration):

```console
$ yarn test [FUNCTIONAL TEST OPTIONS]
```

Run an arbitrary command from within the root of a subproject:

```console
$ yarn back  [ARBITRARY BACKEND COMMAND HERE]
$ yarn front [ARBITRARY FRONTEND COMMAND HERE]
$ yarn func  [ARBITRARY FUNCTIONAL TESTS COMMAND HERE]
```

For example,

```console
$ yarn back less README.md
```

is equivalent to

```console
$ cd backend
$ less README.md
$ cd ..
```

Run `python manage.py` within the `backend` directory:

```console
$ yarn django [SUBCOMMAND] [OPTIONS]
```

`yarn django` is a shorthand for `yarn back python manage.py`. This command is useful for managing database migrations, among other things.

Manage the frontend package dependencies:

```console
$ yarn fyarn (add|remove|upgrade|...) (PACKAGE ...) [OPTIONS]
```



### Notes on Python package dependencies

Both the backend and the functional test suite are Python-based and package versions are pinned using [pip-tools][13] in both subprojects. For ease of development, you most likely want to use the same virtualenv for both and this is also what the `bootstrap.py` assumes.

[13]: https://pypi.org/project/pip-tools/

This comes with a small catch: the subprojects each have their own separate `requirements.txt`. If you run `pip-sync` in one subproject, the dependencies of the other will be uninstalled. In order to avoid this, you run `pip install -r requirements.txt` instead. The `yarn` command does this correctly by default.

Another thing to be aware of, is that `pip-compile` takes the old contents of your `requirements.txt` into account when building the new version based on your `requirements.in`. You can use the following trick to keep the requirements in both projects aligned so the versions of common packages don't conflict:

```console
$ yarn back pip-compile
# append contents of backend/requirements.txt to functional-tests/requirements.txt
$ yarn func pip-compile
```


### Development mode vs production mode

The purpose of development mode is to facilitate live development, as the name implies. The purpose of production mode is to simulate deployment conditions as closely as possible, in order to check whether everything still works under such conditions. A complete overview of the differences is given below.

dimension  |  Development mode  |  Production mode
-----------|--------------------|-----------------
command  |  `yarn start`  |  `yarn start-p`
base address  |  http://localhost:8000  |  http://localhost:4200
backend server (Django)  |  in charge of everything  |  serves backend only

frontend server (angular-cli)  |  serves  |  watch and build

static files  |  served directly by Django's staticfiles app  |  collected by Django, served by gulp-connect
backend `DEBUG` setting  |  `True`  |  `False`
backend `ALLOWED_HOSTS`  |  -  |  restricted to `localhost`

frontend sourcemaps  |  yes  |  no
frontend optimization  |  no  |  yes


## Deployment

Both the backend and frontend applications have a section dedicated to deployment in their own READMEs. You should read these sections entirely before proceeding. All instructions in these sections still apply, though it is good to know that you can use the following shorthand commands from the integrated project root:

```console

# collect static files of both backend and frontend, with overridden settings
$ yarn django collectstatic --settings SETTINGS --pythonpath path/to/SETTINGS.py
```

You should build the frontend before collecting all static files.
