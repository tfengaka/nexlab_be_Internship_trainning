# Nexlab Backend Internship

## Prerequisites

- `NodeJS 18.18.0` with `yarn 1.22.19`
- `Hasura Engine V2.33.0`
- `Docker v24.0.6` & `Docker Compose v2.22.0`

##

## Running

- Create `.env` file same `.env.example` to set environment variables.
- Follow the scripts:

```shell
$ git clone https://github.com/tfengaka/nexlab_be.git
$ cd nexlab_be
$ make start
```

### Database design and migration

- Design:

```shell
  make console
```

- Migrate:

```shell
  make migrate
  make metadata-apply
  make seed # Insert example data (Optional)
```

#
