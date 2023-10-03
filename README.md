# Nexlab Backend Internship

## Prerequisites

- `NodeJS 18.18.0` with `yarn 1.22.19`
- `Hasura Engine V2.33.0`
- `Docker v24.0.6` & `Docker Compose v2.22.0`

## Install

```shell
$ git clone https://github.com/tfengaka/nexlab_be.git
$ cd nexlab_be
$ make dev
```

## Usage

- Create `.env` file same `.env.example` to set environment variables.
- Run this scripts to apply new version app:

```shell
  make migrate
  make metadata-apply
  make seed # insert example data
```

Now, You can visit `http://localhost:8080` to check API Explorer
