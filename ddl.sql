DROP DATABASE IF EXISTS employee_tracker;
DROP ROLE IF EXISTS employee_tracker;

-- Role: employee_tracker

CREATE ROLE employee_tracker WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  CREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS
  PASSWORD 'employee_tracker';

-- Database: employee_tracker

CREATE DATABASE employee_tracker
    WITH
    OWNER = employee_tracker
    ENCODING = 'UTF8'
    LC_COLLATE = 'en-US'
    LC_CTYPE = 'en-US'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Table: public.department

\c employee_tracker;

CREATE TABLE IF NOT EXISTS public.department
(
    id SERIAL,
    name character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT department_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.department
    OWNER to employee_tracker;

-- Table: public.role

CREATE TABLE IF NOT EXISTS public.role
(
    id SERIAL,
    title character varying(30) COLLATE pg_catalog."default",
    salary numeric,
    department integer,
    CONSTRAINT role_pkey PRIMARY KEY (id),
    CONSTRAINT role_ref_department_fk FOREIGN KEY (department)
        REFERENCES public.department (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.role
    OWNER to employee_tracker;
-- Index: fki_role_ref_depaartment_fk

-- DROP INDEX IF EXISTS public.fki_role_ref_depaartment_fk;

CREATE INDEX IF NOT EXISTS fki_role_ref_depaartment_fk
    ON public.role USING btree
    (department ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_role_ref_department_fk

-- DROP INDEX IF EXISTS public.fki_role_ref_department_fk;

CREATE INDEX IF NOT EXISTS fki_role_ref_department_fk
    ON public.role USING btree
    (department ASC NULLS LAST)
    TABLESPACE pg_default;

-- Table: public.employee

CREATE TABLE IF NOT EXISTS public.employee
(
    id SERIAL,
    first_name character varying(30) COLLATE pg_catalog."default",
    last_name character varying(30) COLLATE pg_catalog."default",
    role_id integer,
    manager_id integer,
    CONSTRAINT employee_pkey PRIMARY KEY (id),
    CONSTRAINT employee_ref_employee_id FOREIGN KEY (manager_id)
        REFERENCES public.employee (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT employee_ref_role_id FOREIGN KEY (role_id)
        REFERENCES public.role (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employee
    OWNER to employee_tracker;
-- Index: fki_employee_ref_employee_id

-- DROP INDEX IF EXISTS public.fki_employee_ref_employee_id;

CREATE INDEX IF NOT EXISTS fki_employee_ref_employee_id
    ON public.employee USING btree
    (manager_id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: fki_employee_ref_role_id

-- DROP INDEX IF EXISTS public.fki_employee_ref_role_id;

CREATE INDEX IF NOT EXISTS fki_employee_ref_role_id
    ON public.employee USING btree
    (role_id ASC NULLS LAST)
    TABLESPACE pg_default;