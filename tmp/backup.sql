--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT anon TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT anon TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticated TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT authenticated TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO supabase_storage_admin WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT pg_create_subscription TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_read_only_user WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_signal_backend TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT service_role TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT service_role TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT supabase_realtime_admin TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: get_current_user_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_current_user_role() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;


ALTER FUNCTION public.get_current_user_role() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,  -- Add the email field from the auth.users table
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: has_permission(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.has_permission(user_id uuid, permission_name text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_permissions 
    WHERE user_permissions.user_id = has_permission.user_id 
    AND user_permissions.permission = permission_name
  );
$$;


ALTER FUNCTION public.has_permission(user_id uuid, permission_name text) OWNER TO postgres;

--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    AS $$
  SELECT public.get_current_user_role() = 'admin';
$$;


ALTER FUNCTION public.is_admin() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: ServMaio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServMaio" (
    "Empresa" text NOT NULL,
    "SOLICITANTE" text,
    "Serviço" text,
    "Cidade" text,
    "Valor" text
);


ALTER TABLE public."ServMaio" OWNER TO postgres;

--
-- Name: custos_maio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custos_maio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    descricao text NOT NULL,
    data_vencimento date NOT NULL,
    valor_texto text NOT NULL,
    forma_pagamento text NOT NULL,
    tipo text NOT NULL,
    valor_numerico numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custos_maio_tipo_check CHECK ((tipo = ANY (ARRAY['Fixo'::text, 'Variável'::text])))
);


ALTER TABLE public.custos_maio OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: servicos_maio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicos_maio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    empresa text NOT NULL,
    solicitante text,
    servico text,
    cidade text,
    valor_texto text,
    valor_numerico numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    data_servico date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.servicos_maio OWNER TO postgres;

--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    permission text NOT NULL,
    granted_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	0bad5fc8-b9b9-44b2-a35d-e5484cab1e07	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"mayte@watransportes.com","user_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","user_phone":""}}	2025-06-09 22:22:25.520636+00	
00000000-0000-0000-0000-000000000000	16b219a0-5208-4b95-a1af-bcb95a1a00c7	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-09 22:23:06.009534+00	
00000000-0000-0000-0000-000000000000	197b9050-eb39-4fb1-9cd6-c7ace9a53303	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-09 22:29:39.710567+00	
00000000-0000-0000-0000-000000000000	febf2a90-b3ac-4e73-8f65-8a6cf8c47537	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-09 22:31:33.264566+00	
00000000-0000-0000-0000-000000000000	a9fe76f9-bf47-4f1a-b6f7-1b91a9377eb7	{"action":"logout","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account"}	2025-06-09 22:58:13.247961+00	
00000000-0000-0000-0000-000000000000	236b85c3-52d7-4d81-907e-e9fc3d52b65d	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-09 22:58:36.707361+00	
00000000-0000-0000-0000-000000000000	4430513e-d81f-4bd3-8c5f-7f232ca6fd76	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 04:28:51.027739+00	
00000000-0000-0000-0000-000000000000	8786c34d-20e9-4218-b660-1735982ce044	{"action":"logout","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account"}	2025-06-10 04:30:51.58781+00	
00000000-0000-0000-0000-000000000000	803d01c4-9919-4dae-baf0-a7433aed68c6	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 04:33:32.497333+00	
00000000-0000-0000-0000-000000000000	8a186111-32e9-4424-b16c-8da2e4d8ffdb	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 04:46:20.549946+00	
00000000-0000-0000-0000-000000000000	9f2db4d8-3fe5-4cf6-9bf9-9a13e7db363a	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 04:54:11.856095+00	
00000000-0000-0000-0000-000000000000	db117fbc-40af-41e6-ab30-61fd9e450bb0	{"action":"user_signedup","actor_id":"0a876ed5-9f06-4c90-99ac-c378a4aa8457","actor_username":"victorcamisa.mkt@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-06-10 05:17:50.695277+00	
00000000-0000-0000-0000-000000000000	4145eca2-c801-4371-903b-fe2a65457b75	{"action":"login","actor_id":"0a876ed5-9f06-4c90-99ac-c378a4aa8457","actor_username":"victorcamisa.mkt@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 05:17:50.701712+00	
00000000-0000-0000-0000-000000000000	b7931458-ad03-4ddc-a563-8cf25c945b65	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 05:37:44.325662+00	
00000000-0000-0000-0000-000000000000	bb98033d-70ee-4d36-b9ce-0e0154371d24	{"action":"user_signedup","actor_id":"7b90e42b-19d7-40b8-bce6-885b984f878b","actor_username":"alexander@watransportes.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-06-10 05:46:25.031865+00	
00000000-0000-0000-0000-000000000000	5d391bf6-991a-4afa-8d23-de3a2db34043	{"action":"login","actor_id":"7b90e42b-19d7-40b8-bce6-885b984f878b","actor_username":"alexander@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 05:46:25.038068+00	
00000000-0000-0000-0000-000000000000	5c3e3653-3a89-4024-9db6-6093b06c4e0c	{"action":"logout","actor_id":"7b90e42b-19d7-40b8-bce6-885b984f878b","actor_username":"alexander@watransportes.com","actor_via_sso":false,"log_type":"account"}	2025-06-10 05:48:25.036392+00	
00000000-0000-0000-0000-000000000000	4a5fdf57-af04-4fae-bce0-2b42723479d3	{"action":"login","actor_id":"7b90e42b-19d7-40b8-bce6-885b984f878b","actor_username":"alexander@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 05:48:36.590074+00	
00000000-0000-0000-0000-000000000000	75efb7bf-0da3-4db4-a025-bf112ce7094b	{"action":"logout","actor_id":"7b90e42b-19d7-40b8-bce6-885b984f878b","actor_username":"alexander@watransportes.com","actor_via_sso":false,"log_type":"account"}	2025-06-10 05:48:56.229738+00	
00000000-0000-0000-0000-000000000000	f8160b4b-7f2b-4ba7-b3fd-6ee3a5293066	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 05:52:34.827297+00	
00000000-0000-0000-0000-000000000000	9766846a-3724-4b9f-abca-4de0cbc58904	{"action":"logout","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account"}	2025-06-10 05:55:43.977056+00	
00000000-0000-0000-0000-000000000000	570542e3-a13a-462d-9e5b-c6792dae526d	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 15:18:48.570337+00	
00000000-0000-0000-0000-000000000000	5efb6ac3-71c3-430a-8e2b-643c682c18f2	{"action":"logout","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account"}	2025-06-10 15:20:15.00086+00	
00000000-0000-0000-0000-000000000000	c69ce517-6736-46ef-9f3f-489fb9dc2b10	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 15:21:04.297364+00	
00000000-0000-0000-0000-000000000000	224ae0cf-ee9d-4b52-abb2-2db172db70b5	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-10 15:32:08.383278+00	
00000000-0000-0000-0000-000000000000	e2d4d98b-f311-40c7-ab5e-5002ee8fb9c4	{"action":"login","actor_id":"6aa71b45-4d96-4928-81da-1fc3ee87db2c","actor_username":"mayte@watransportes.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-11 22:31:11.451533+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
6aa71b45-4d96-4928-81da-1fc3ee87db2c	6aa71b45-4d96-4928-81da-1fc3ee87db2c	{"sub": "6aa71b45-4d96-4928-81da-1fc3ee87db2c", "email": "mayte@watransportes.com", "email_verified": false, "phone_verified": false}	email	2025-06-09 22:22:25.518628+00	2025-06-09 22:22:25.518689+00	2025-06-09 22:22:25.518689+00	62bc5015-f1a7-40ba-a59c-c9369cef51b4
0a876ed5-9f06-4c90-99ac-c378a4aa8457	0a876ed5-9f06-4c90-99ac-c378a4aa8457	{"sub": "0a876ed5-9f06-4c90-99ac-c378a4aa8457", "role": "user", "email": "victorcamisa.mkt@gmail.com", "username": "Victor Hugo", "email_verified": false, "phone_verified": false}	email	2025-06-10 05:17:50.690839+00	2025-06-10 05:17:50.690898+00	2025-06-10 05:17:50.690898+00	7e7cfed4-a46d-4b4b-84e2-26753782975d
7b90e42b-19d7-40b8-bce6-885b984f878b	7b90e42b-19d7-40b8-bce6-885b984f878b	{"sub": "7b90e42b-19d7-40b8-bce6-885b984f878b", "role": "user", "email": "alexander@watransportes.com", "username": "alexander", "email_verified": false, "phone_verified": false}	email	2025-06-10 05:46:25.029264+00	2025-06-10 05:46:25.029312+00	2025-06-10 05:46:25.029312+00	cbfdc7e7-1900-40fd-89eb-4185922859a5
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
a6e4ed9a-32aa-4b1f-a8f3-90b03285b253	2025-06-10 05:17:50.705724+00	2025-06-10 05:17:50.705724+00	password	9cda506d-4c99-48c1-8468-ee4cca53281d
53067afd-3196-4769-a45c-b1761d19bb74	2025-06-10 15:21:04.30212+00	2025-06-10 15:21:04.30212+00	password	c1d5965c-9946-4780-a18b-a0a3463dff3f
d0909bfc-2e86-41e8-ab00-7375f6d8c0e0	2025-06-10 15:32:08.389755+00	2025-06-10 15:32:08.389755+00	password	027811af-e95b-4a10-9d9e-e9bc3db77c19
aea4084c-f218-4d35-a4c3-dc658c61d06b	2025-06-11 22:31:11.529632+00	2025-06-11 22:31:11.529632+00	password	b1c5f78d-a2a4-4452-94e9-9d445eff301d
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	9	7xx5uiz5hvvd	0a876ed5-9f06-4c90-99ac-c378a4aa8457	f	2025-06-10 05:17:50.703347+00	2025-06-10 05:17:50.703347+00	\N	a6e4ed9a-32aa-4b1f-a8f3-90b03285b253
00000000-0000-0000-0000-000000000000	15	cr7r3xpoxt56	6aa71b45-4d96-4928-81da-1fc3ee87db2c	f	2025-06-10 15:21:04.300438+00	2025-06-10 15:21:04.300438+00	\N	53067afd-3196-4769-a45c-b1761d19bb74
00000000-0000-0000-0000-000000000000	16	ymzuybjnezxg	6aa71b45-4d96-4928-81da-1fc3ee87db2c	f	2025-06-10 15:32:08.387034+00	2025-06-10 15:32:08.387034+00	\N	d0909bfc-2e86-41e8-ab00-7375f6d8c0e0
00000000-0000-0000-0000-000000000000	17	4zs6pmk6xjq5	6aa71b45-4d96-4928-81da-1fc3ee87db2c	f	2025-06-11 22:31:11.49783+00	2025-06-11 22:31:11.49783+00	\N	aea4084c-f218-4d35-a4c3-dc658c61d06b
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
a6e4ed9a-32aa-4b1f-a8f3-90b03285b253	0a876ed5-9f06-4c90-99ac-c378a4aa8457	2025-06-10 05:17:50.702326+00	2025-06-10 05:17:50.702326+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15	187.112.167.86	\N
53067afd-3196-4769-a45c-b1761d19bb74	6aa71b45-4d96-4928-81da-1fc3ee87db2c	2025-06-10 15:21:04.299444+00	2025-06-10 15:21:04.299444+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15	187.112.167.86	\N
d0909bfc-2e86-41e8-ab00-7375f6d8c0e0	6aa71b45-4d96-4928-81da-1fc3ee87db2c	2025-06-10 15:32:08.384428+00	2025-06-10 15:32:08.384428+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15	187.112.167.86	\N
aea4084c-f218-4d35-a4c3-dc658c61d06b	6aa71b45-4d96-4928-81da-1fc3ee87db2c	2025-06-11 22:31:11.47653+00	2025-06-11 22:31:11.47653+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15	179.160.45.110	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	7b90e42b-19d7-40b8-bce6-885b984f878b	authenticated	authenticated	alexander@watransportes.com	$2a$10$rTUQwiqC.71NyxPECSsrf.5IYe0Z3mHmUk1Ww/2iYf6H7yftIb0G2	2025-06-10 05:46:25.033153+00	\N		\N		\N			\N	2025-06-10 05:48:36.590793+00	{"provider": "email", "providers": ["email"]}	{"sub": "7b90e42b-19d7-40b8-bce6-885b984f878b", "role": "user", "email": "alexander@watransportes.com", "username": "alexander", "email_verified": true, "phone_verified": false}	\N	2025-06-10 05:46:25.025039+00	2025-06-10 05:48:36.592764+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	6aa71b45-4d96-4928-81da-1fc3ee87db2c	authenticated	authenticated	mayte@watransportes.com	$2a$10$TUPpmg9MHa1XFC4ePi/1Ku7ANqfruO.gILklVA89RW8uPDwgqkNdy	2025-06-09 22:22:25.525186+00	\N		\N		\N			\N	2025-06-11 22:31:11.476449+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-06-09 22:22:25.504024+00	2025-06-11 22:31:11.521389+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	0a876ed5-9f06-4c90-99ac-c378a4aa8457	authenticated	authenticated	victorcamisa.mkt@gmail.com	$2a$10$exbVAqxY/ImToqZygsIcKeWmmW1FsZaD1nGqOc/fbXfprtKkJ/Ihm	2025-06-10 05:17:50.696475+00	\N		\N		\N			\N	2025-06-10 05:17:50.702245+00	{"provider": "email", "providers": ["email"]}	{"sub": "0a876ed5-9f06-4c90-99ac-c378a4aa8457", "role": "user", "email": "victorcamisa.mkt@gmail.com", "username": "Victor Hugo", "email_verified": true, "phone_verified": false}	\N	2025-06-10 05:17:50.675878+00	2025-06-10 05:17:50.705284+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: ServMaio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServMaio" ("Empresa", "SOLICITANTE", "Serviço", "Cidade", "Valor") FROM stdin;
\.


--
-- Data for Name: custos_maio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custos_maio (id, descricao, data_vencimento, valor_texto, forma_pagamento, tipo, valor_numerico, created_at) FROM stdin;
9ea2637a-3745-488e-a7b6-c413c23d0980	Teto caminhão	2025-05-02	R$ 500,00	Pix	Variável	500.00	2025-06-10 04:44:11.701938+00
85138b08-9af9-475e-a9ef-e7b3e2afaaec	Conserto moto	2025-05-03	R$ 155,00	Pix	Variável	155.00	2025-06-10 04:44:11.701938+00
17394627-947c-4a12-a2f1-76aa26d327fa	SEGURO CAMINHAO TRUCK	2025-05-04	R$ 1.876,13	BOLETO	Fixo	1876.13	2025-06-10 04:44:11.701938+00
dfbb2659-9615-4123-88ba-8a71f40efc99	Raster Iveco	2025-05-05	R$ 120,00	Pix	Variável	120.00	2025-06-10 04:44:11.701938+00
65fb8430-a905-4b56-a801-8518a9c340bb	Cartão Neo	2025-05-05	R$ 3.107,87	Saldo em conta	Variável	3107.87	2025-06-10 04:44:11.701938+00
fecf305a-8f11-4fa6-8fdf-3bc4f1ea4dd6	Sem parar	2025-05-05	R$ 5.266,56	Saldo em conta	Fixo	5266.56	2025-06-10 04:44:11.701938+00
468c33f3-9dd5-4c99-862c-fc68d32b28ed	Consórcio MES 6 N T +	2025-05-05	R$ 639,80	Pix	Fixo	639.80	2025-06-10 04:44:11.701938+00
5f161c28-360c-437a-9d21-19f62282c089	Consórcio	2025-05-05	R$ 1.087,55	Pix	Fixo	1087.55	2025-06-10 04:44:11.701938+00
b9065375-f657-422d-92c3-1cca642f9615	Consórcio MES 6 N T +	2025-05-05	R$ 639,80	Pix	Fixo	639.80	2025-06-10 04:44:11.701938+00
4fb9765b-c6cd-4573-9961-63a179995bb8	Sistema Conex VITOR E ANA	2025-05-06	R$ 1.250,00	Pix	Variável	1250.00	2025-06-10 04:44:11.701938+00
3a427f1c-79aa-40f9-9c6f-bba9795f47ff	Cartão Itau PJ	2025-05-09	R$ 16.094,06	Saldo em conta	Variável	16094.06	2025-06-10 04:44:11.701938+00
5ac90e79-8608-444e-a738-b4ae9bd1bc31	Empréstimo	2025-05-10	R$ 2.201,38	Pix	Fixo	2201.38	2025-06-10 04:44:11.701938+00
0d15b3f5-747d-40c4-9e2e-6c1f809e49a4	Cartão 7 Estrelas	2025-05-10	R$ 829,70	Pix	Variável	829.70	2025-06-10 04:44:11.701938+00
e8ae5dfb-e3b5-4e6d-9503-f18eb7b5d0ff	Contador	2025-05-10	R$ 1.000,00	Pix	Fixo	1000.00	2025-06-10 04:44:11.701938+00
7cf2570f-7c7a-4fb5-948b-eb578a4cd361	Cartão Nubank	2025-05-12	R$ 7.054,68	Saldo em conta	Variável	7054.68	2025-06-10 04:44:11.701938+00
3d3f7810-b7cf-4ac7-a98d-133b07ccc813	Casa	2025-05-13	R$ 650,00	Pix	Fixo	650.00	2025-06-10 04:44:11.701938+00
36bf197e-bcca-40d4-996e-c67fc88129e4	Claro	2025-05-14	R$ 338,17	Pix	Fixo	338.17	2025-06-10 04:44:11.701938+00
9d87cc66-cd22-4aa4-bf1b-842780a8ba5f	Tel Fixo	2025-05-15	R$ 68,17	Pix	Fixo	68.17	2025-06-10 04:44:11.701938+00
f1362c74-7283-4541-8eab-eee78826e12c	Telefone	2025-05-16	R$ 67,05	Pix	Fixo	67.05	2025-06-10 04:44:11.701938+00
5c726d92-2ec6-4897-ae9e-cbaf86ad8a90	Consórcio	2025-05-17	R$ 469,85	Pix	Fixo	469.85	2025-06-10 04:44:11.701938+00
e8052c7b-9289-4003-b4ee-e0c826029368	Seguro de vida	2025-05-17	R$ 172,09	Pix	Fixo	172.09	2025-06-10 04:44:11.701938+00
fbb5ea52-7e66-461c-88ae-787ea93976ad	Cartão BV	2025-05-17	R$ 3.933,18	Saldo em conta	Variável	3933.18	2025-06-10 04:44:11.701938+00
43a273df-75fc-4b37-883d-babdfd71b6ee	Cartão Credcar	2025-05-17	R$ 1.797,81	Saldo em conta	Variável	1797.81	2025-06-10 04:44:11.701938+00
008c45bf-e86e-4677-aef8-f392a741e20f	Boleto Caminhão	2025-05-18	R$ 3.990,80	Pix	Fixo	3990.80	2025-06-10 04:44:11.701938+00
ffe53587-03be-4b70-b00a-19f49285e7f9	Cartão Carrefour	2025-05-20	R$ 936,24	Pix	Variável	936.24	2025-06-10 04:44:11.701938+00
929e49dd-3e4f-43e2-9840-74dd8431bd30	Parcela Giro	2025-05-20	R$ 3.119,12	Pix	Fixo	3119.12	2025-06-10 04:44:11.701938+00
ed6cc495-6a3e-40bb-91f7-392ca602fd7b	Seguro de vida	2025-05-20	R$ 117,00	Pix	Fixo	117.00	2025-06-10 04:44:11.701938+00
57e16f2d-f894-437c-b0de-492f266daf3c	Imposto	2025-05-20	R$ 28.798,29	Pix	Variável	28798.29	2025-06-10 04:44:11.701938+00
5b42a493-d64e-4098-9066-e4feea0631b7	FGTS	2025-05-20	R$ 209,40	Pix	Fixo	209.40	2025-06-10 04:44:11.701938+00
0287a704-c69b-48fa-aa2d-dc0f663bc222	INSS	2025-05-20	R$ 379,79	Pix	Fixo	379.79	2025-06-10 04:44:11.701938+00
a8bb3bbe-62a3-4715-af37-bb35da74da71	Seguro Fiorino INC ITAU	2025-05-20	R$ 462,00	Pix	Fixo	462.00	2025-06-10 04:44:11.701938+00
1ae2c2c0-e23e-4655-822a-6f7226f5d60a	Celular Wallison (04/05)	2025-05-21	R$ 141,10	Pix	Fixo	141.10	2025-06-10 04:44:11.701938+00
8f1afb4e-cdea-4c28-bebd-7e6718f5b0c9	lavagem carro	2025-05-22	R$ 100,00	Pix	Variável	100.00	2025-06-10 04:44:11.701938+00
ed3b94b0-809b-4db6-af22-7f6022ddf84b	Victor/Ana	2025-05-20	R$ 500,00	Pix	Fixo	500.00	2025-06-10 04:44:11.701938+00
84abbc3d-9d14-441c-8157-ef899557fd63	MS diesel	2025-05-23	R$ 400,00	pix	Variável	400.00	2025-06-10 04:44:11.701938+00
999f3db5-5b44-47bc-97b1-2d008b6e2662	Bruna troca pneu ODH	2025-05-23	R$ 120,00	pix	Variável	120.00	2025-06-10 04:44:11.701938+00
365a30aa-a6b2-425a-bd51-b0eaf9ceba9a	Mecanico Pulse	2025-05-24	R$ 1.400,00	pix	Variável	1400.00	2025-06-10 04:44:11.701938+00
48a1d846-c2e5-4fa0-b9f8-54a51694ccf1	Terreno BLM	2025-05-25	R$ 860,64	Saldo em conta	Fixo	860.64	2025-06-10 04:44:11.701938+00
a7af2cbd-9dc3-42d9-8701-718f001a9f84	Cartão Will	2025-05-25	R$ 9.271,85	Pix	Variável	9271.85	2025-06-10 04:44:11.701938+00
8b11a014-23ef-4166-940c-fb36a2ee8ba4	Mecanico Diesel	2025-05-26	R$ 120,00	pix	Variável	120.00	2025-06-10 04:44:11.701938+00
93c07f97-6cc3-43bd-90bd-2bc16e617fbb	Cartão Santander	2025-05-26	R$ 5.724,64	Saldo em conta	Variável	5724.64	2025-06-10 04:44:11.701938+00
49f7638a-032e-4cf1-996f-75302092fc65	Terreno VLC	2025-05-26	R$ 1.200,00	Pix	Fixo	1200.00	2025-06-10 04:44:11.701938+00
a9798ab3-76ff-484d-9668-d8501d319603	RASTREADOR	2025-05-27	R$ 500,00	PIX	Fixo	500.00	2025-06-10 04:44:11.701938+00
aa56c447-dd8b-4151-a59a-0abd5d7cd76c	Internet terreno	2025-05-27	R$ 102,49	pix	Variável	102.49	2025-06-10 04:44:11.701938+00
1da5afd2-6dec-4593-a463-d668c3362ac3	Internet casa	2025-05-27	R$ 136,39	pix	Variável	136.39	2025-06-10 04:44:11.701938+00
bae77003-1837-41ed-bf9d-da7da8940d47	Conta agua terreno	2025-05-27	R$ 70,51	pix	Variável	70.51	2025-06-10 04:44:11.701938+00
6a58645c-988e-473e-a304-bf8b7ebda9cf	Conta agua terreno	2025-05-27	R$ 68,74	PIX	Variável	68.74	2025-06-10 04:44:11.701938+00
ace511c2-6880-41b6-91bc-64e923bd3ce9	conta de luz terreno	2025-05-27	R$ 76,85	PIX	Variável	76.85	2025-06-10 04:44:11.701938+00
d21da38d-0625-4f00-8ac2-0d540f5fd71f	Empréstimo Mae	2025-05-28	R$ 1.700,00	pix	Variável	1700.00	2025-06-10 04:44:11.701938+00
5d7fcc8c-205c-4dc7-afbd-f9e321265a0f	Cadatro marketing	2025-05-29	R$ 220,00	pix	Variável	220.00	2025-06-10 04:44:11.701938+00
c40b61be-c990-486a-9f4d-b145c5af94ab	Seguro Roubo	2025-05-30	R$ 2.730,85	Pix	Variável	2730.85	2025-06-10 04:44:11.701938+00
03d36df0-1f46-444b-b0b1-2bda864f0902	Seguro Carga	2025-05-30	R$ 1.401,76	Pix	Variável	1401.76	2025-06-10 04:44:11.701938+00
fb2a1c24-3554-49c6-82c4-235c254b157c	Sistema Soft	2025-05-30	R$ 239,90	Pix	Fixo	239.90	2025-06-10 04:44:11.701938+00
edd9c4c0-949f-490e-b7bc-5dadee0cf190	Pagamento Victor 	2025-06-09	500	Pix	Variável	500.00	2025-06-10 05:24:10.254579+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, username, role, created_at, updated_at, email) FROM stdin;
6aa71b45-4d96-4928-81da-1fc3ee87db2c	mayte	user	2025-06-09 22:22:25.503661+00	2025-06-09 22:22:25.503661+00	mayte@sistema.local
0a876ed5-9f06-4c90-99ac-c378a4aa8457	Victor Hugo	user	2025-06-10 05:17:50.674176+00	2025-06-10 05:17:50.674176+00	Victor Hugo@sistema.local
8262b441-e736-4ee8-adfd-f217a9f5c714	victornogueira	user	2025-06-10 05:39:18.497912+00	2025-06-10 05:39:18.497912+00	Victorcamisa0132@gmail.com
c0b2dc63-41f4-4e84-91dc-5a623e679f02	analuisa	user	2025-06-10 05:41:17.200797+00	2025-06-10 05:41:17.200797+00	Ana@watransportes.com
7b90e42b-19d7-40b8-bce6-885b984f878b	alexander	user	2025-06-10 05:46:25.024657+00	2025-06-10 05:46:25.024657+00	alexander@watransportes.com
\.


--
-- Data for Name: servicos_maio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicos_maio (id, empresa, solicitante, servico, cidade, valor_texto, valor_numerico, created_at, data_servico) FROM stdin;
51381290-39f0-477c-9b07-7cdc1c51f021	HYDROSTEC	FELIPE	ARBO	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
92187698-932b-490b-8889-dd801c60574c	AUTOLIV	GRAZIELE	COLETA: CGR	DIADEMA	R$ 425,00	425.00	2025-06-10 04:26:17.45535+00	2024-05-01
12713a80-b5e1-465f-b977-821d3bc4ff72	HYDROSTEC	GUSTAVO	COLETA: SHERWIN WILLIANS	OSASCO	\N	\N	2025-06-10 04:26:17.45535+00	2024-05-01
1154b339-3923-4fa6-939a-31d49ea9858b	RECICLAGEM	PATRICIA SANTOS	COLETA: ANSELMO/ 416,66+SEGURO: 110,00	TAB DA SERRA	R$ 526,66	526.66	2025-06-10 04:26:17.45535+00	2024-05-01
9cf0a474-ff96-4067-9a49-88fa354cb5ff	RECICLAGEM	PATRICIA SANTOS	COLETA: FUSH / 416,66+SEGURO: 2.460,00	TAB DA SERRA	R$ 2.876,66	2876.66	2025-06-10 04:26:17.45535+00	2024-05-01
8263743b-25b1-4db9-945f-1457eafabc53	RESINAS	PATRICIA SANTOS	COLETA: FUSH / 416,66+SEGURO: 500,00	TAB DA SERRA	R$ 916,66	916.66	2025-06-10 04:26:17.45535+00	2024-05-01
49699efe-433a-4ed8-83df-542effd35250	TAMPAS	KELVIN	COLETA: FUSH / 280+SEGURO: 11,85	TAB DA SERRA	R$ 291,85	291.85	2025-06-10 04:26:17.45535+00	2024-05-01
1e60bac0-15c2-4b5d-a2f5-16d14a8fe5ab	HYDROSTEC	GUSTAVO	COLETA FRAC: SHERWIN WILLIANS	OSASCO	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
064f68e7-649d-4dab-ad24-217dd2c8bf24	HYDROSTEC	GUSTAVO	COLETA FRAC: NEOCONEX/165,69+SEGURO:99,31	SÃO CAETANO	R$ 265,00	265.00	2025-06-10 04:26:17.45535+00	2024-05-01
5a7479b0-f6ec-4b63-ba39-05bbc6baf826	HYDROSTEC	FELIPE	IND DO VALE - IDA E VOLTA	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
bf7881d6-9956-45f1-bcc5-68528a83cea5	HYDROSTEC	FELIPE	ARBO	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
3ae2343f-63ab-41f5-82fb-d2328031817f	HYDROSTEC	RAFAELA	COPYART	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
d91c5a4b-13a3-49c8-a3e2-7fe90bc459fb	HYDROSTEC	ALINI	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
74e8d785-4bbc-4bca-a978-9f33d673ba93	IFF	JOÃO PEDRO	CORREIO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
872dd0a7-0b42-4788-afab-533277c8502d	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
fd192780-bf70-4946-822b-f8f6c346d261	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 141,94	VARZEA PSTA	R$ 1.791,94	1791.94	2025-06-10 04:26:17.45535+00	2024-05-01
79c24da3-467d-46de-9e46-27a0b944baca	AUTOLIV	CASSIA LEMES	ENTREGA: GM	SÃO CAETANO	R$ 250,00	250.00	2025-06-10 04:26:17.45535+00	2024-05-01
6ccffc02-efde-4b13-9786-777d876d016f	GV	ANA DIAS	COLETA: TRANSOK(KLUBER)1450+SEGURO:155,13	BARUERI	R$ 1.605,13	1605.13	2025-06-10 04:26:17.45535+00	2024-05-01
2764731e-1030-47a1-ac2c-95a397c680e6	GV	CIOMARA	ENTREGA: HYTORK / 500+SEGURO: 145,60	S B CAMPO	R$ 645,60	645.60	2025-06-10 04:26:17.45535+00	2024-05-01
1c8331df-4d1a-47a8-8b6a-b6c3d6bc0df2	PINTAK	PRISCILLA	COREVAL	TAUBATÉ	R$ 25,00	25.00	2025-06-10 04:26:17.45535+00	2024-05-01
f9f28741-2a34-4485-b631-62d083ee440c	INPRO	ROBERTA	CARTÓRIO	TAUBATÉ	\N	\N	2025-06-10 04:26:17.45535+00	2024-05-01
e9671442-08e5-409f-8dfc-47e85fd57cce	MUBEA	REGINA	CORREIO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
642bb95e-cbf2-4e36-a6a1-8b5d8edc176e	RESINAS	HELENA	COLETA: BUNZL / 380+SEGURO: 5,00	GUARULHOS	R$ 385,00	385.00	2025-06-10 04:26:17.45535+00	2024-05-01
21a3899d-2a09-467c-bd77-069bb1acb61b	HYDROSTEC	SILVIO	IND DO VALE - IDA E VOLTA	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
de387c6e-8b8d-44c7-bd78-5511ef6559a4	HYDROSTEC	SILVIO	RELE ROLAMENTOS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
4fefa44a-408f-4e3f-be0d-e1ffdf87222c	HYDROSTEC	RAFAELA	COPYART	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
7951f8b0-b26f-459e-8537-a3671e812722	MUBEA/FIXO	JOAO	CARTÓRIO	TAUBATÉ	R$ 180,00	180.00	2025-06-10 04:26:17.45535+00	2024-05-01
4be49a1d-a700-4789-a817-f28fafb3f37e	MUBEA	REGINA	CORREIO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
e3b63d8b-f584-4d8f-9bcb-1f9a6f696ae2	MUBEA	RENAN CAMARA	COLETA: BERTEL	CAIEIRAS	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
b80e3836-ab8e-43ae-a2ad-d6a4c1b119eb	IFF	THAIS MERY	ENTREGA: AMBEV	RIO DE JANEIRO	R$ 750,00	750.00	2025-06-10 04:26:17.45535+00	2024-05-01
0f611d72-1ebb-4bea-9394-6216f5801c9b	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
a869ac9a-6e07-493d-91a3-8f569bc4c40c	IFF	FELIPE	CHAVEIRO CHAGAS	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
e50224ea-71cb-42eb-accd-4885059af13c	IFF	THAIS MERY	CORREIO	TAUBATÉ	R$ 80,00	80.00	2025-06-10 04:26:17.45535+00	2024-05-01
44682743-7d9d-4183-80ea-dff681bc92aa	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 227,51	VARZEA PSTA	R$ 1.877,51	1877.51	2025-06-10 04:26:17.45535+00	2024-05-01
9e946ec7-88d2-4d37-9288-d262e9127f51	AUTOLIV	\N	COLETA: MAC SISCON	SÃO PAULO	R$ 230,00	230.00	2025-06-10 04:26:17.45535+00	2024-05-01
4bd2f92a-5c04-4eae-b25d-322fbb6667fb	GV	PLINIO	COLETA: RADIAL - GV-099229	SÃO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
4cd2d65c-5999-4caf-bfc7-7cb3f75c1700	GV	ANA DIAS	ENTREGA: TECHWAY	S J CAMPOS	R$ 265,00	265.00	2025-06-10 04:26:17.45535+00	2024-05-01
9671cb9f-9c1c-41b9-abfb-74243f5ff46e	LUGAB	JUNIOR	ENTREGA: GV / 350+SEGURO: 72,50	SP / PINDA	R$ 422,50	422.50	2025-06-10 04:26:17.45535+00	2024-05-01
883fdceb-e705-49a7-8897-95b49ec1335a	ACTA	VILMEI	ROTAS DE QUARTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
fb26fee1-f3db-4e6c-b645-4a4432f22195	CAMPO LIMPO	PATRICIA SANTOS	FEIRA DA BORRACHA	SJCAMPOS	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
bea39cdb-ffc2-4e6c-a894-15e5ef451084	RECICLAGEM	RODRIGO	ENTREGA: FUSH / 1250+SEGURO: 4.200	TAB DA SERRA	R$ 5.450,00	5450.00	2025-06-10 04:26:17.45535+00	2024-05-01
b3b74ec9-f60c-480c-adbf-4b29ea63b3a7	RECICLAGEM	PATRICIA SANTOS	COLETA: UART / 230+SEGURO: 45,00	SÃO PAULO	R$ 275,00	275.00	2025-06-10 04:26:17.45535+00	2024-05-01
57939545-5cd0-4c1f-a905-7efb1fc9c460	MUBEA	RENAN CAMARA	COLETA: JAFER	BRAG. PAULISTA	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
20fe3746-1032-4c4b-82c2-cd162a398add	MUBEA	REGIS DIAS	MEC-Q - LEVAR	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
b802bc33-1d54-45aa-907e-efb7b4835828	MUBEA	REGINA	CORREIO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
2b23e12e-bdc4-43eb-9897-f2a28fe4fe43	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
2093f126-2421-494a-9b9d-ea7bc948b5d6	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
775685b8-90c7-4e48-a76c-faa0435b4c18	IFF	THAIS MERY	ENTREGA: AMBEV	RIO DE JANEIRO	R$ 750,00	750.00	2025-06-10 04:26:17.45535+00	2024-05-01
f12ec98e-7849-43ba-9726-c4bceef0ed88	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 251,35	VARZEA PSTA	R$ 1.901,35	1901.35	2025-06-10 04:26:17.45535+00	2024-05-01
4f1bb65f-c282-4239-aa9e-6688068a1759	AUTOLIV	REGIS MARQUES	COLETA: ATLAS COPCO / 1150+SEGURO: 375,00	BARUERI	R$ 1.525,00	1525.00	2025-06-10 04:26:17.45535+00	2024-05-01
fc1e1977-50ea-4868-99b3-81fddde313c4	AUTOLIV	DOUGLAS CASTRO	COLETA: DINATESTE	SÃO PAULO	R$ 230,00	230.00	2025-06-10 04:26:17.45535+00	2024-05-01
778b8257-46c9-4ee0-ab82-74fb3ef03029	PISANI	EDUARDO	COLETA: 3M / 790+SEGURO: 292,74	SUMARÉ	R$ 1.082,74	1082.74	2025-06-10 04:26:17.45535+00	2024-05-01
36aeed52-2140-40a5-a526-5a3ce254dba2	PISANI	EDUARDO	ENTREGA: FEROMAX	SÃO PAULO	R$ 270,00	270.00	2025-06-10 04:26:17.45535+00	2024-05-01
f5717d68-cc7d-4b03-9502-9cdee0711e19	GV	PLINIO	COLETA: COPEC	OSASCO	R$ 490,00	490.00	2025-06-10 04:26:17.45535+00	2024-05-01
432c38d3-8b4a-4857-8f3c-5e4942bcf114	PLASCAR	MARCELO	COLETA: ELETRO MECANICA	SJCAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
9c96fb7f-d566-49b9-8de0-773ce4d63262	ACTA	VILMEI	ROTAS DE QUINTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
49795e0f-975a-4ac1-bac8-0bc5da27ebf6	CAMPO LIMPO	PORTARIA	CORREIO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
22e5195b-919a-4d11-9621-f3bfc6466ab9	CAMPO LIMPO	BRUNA	LOGO TIPOS	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
d8bca5b1-6ca0-4a93-9e21-d4f213c51409	CAMPO LIMPO	KAUE	CHAVEIRO - IDA E VOLTA	TAUBATÉ	R$ 40,00	40.00	2025-06-10 04:26:17.45535+00	2024-05-01
51452d3d-f555-49eb-9a98-8dd511c2799c	RIB PRETO	HELENA	COLETA FRAC: COM. FERR / 470+SEGURO: 3,06	RIB PRETO	R$ 473,06	473.06	2025-06-10 04:26:17.45535+00	2024-05-01
bab3f236-ee61-4b9b-867e-63f2b2b73c96	RECICLAGEM	RONAN	ENTREGA: CONCEPTA / 980+SEGURO: 1,97	SÃO PAULO	R$ 981,97	981.97	2025-06-10 04:26:17.45535+00	2024-05-01
f9881f3b-f38d-45a9-83be-aff20716e00e	RECICLAGEM	HELENA	COLETA: SAFETLINE / 335+SEGURO: 58,29	HORTOLANDIA	R$ 393,29	393.29	2025-06-10 04:26:17.45535+00	2024-05-01
ab694e8d-0cd7-4d8b-a9c0-29d0648a8dfc	RESINAS	HELENA	COLETA: SAFETLINE / 335+SEGURO: 17,49	HORTOLANDIA	R$ 352,49	352.49	2025-06-10 04:26:17.45535+00	2024-05-01
fd08a67c-c7bb-4e35-88d2-97d58ba77f67	IFF	FELIPE	REP ACESSO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
a6d1867f-8ea6-4c5c-99e8-36d35d097d7f	IFF	THAIS MERY	CORREIO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
1d8c3f0e-f49e-4669-bf3d-f934c6b1b69a	HYDROSTEC	GUSTAVO	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
ae335e8c-8447-446b-8269-67df01a68684	CIESP	CLOVIS	DOCUMENTO PINDA E ROSEIRA	PINDA/ROSEIRA	R$ 140,00	140.00	2025-06-10 04:26:17.45535+00	2024-05-01
4e2ce43b-fc29-45ef-8f9c-408923249787	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 222,17	VARZEA PSTA	R$ 1.872,17	1872.17	2025-06-10 04:26:17.45535+00	2024-05-01
4e95a8c8-fac2-4888-8b50-faf3a5e44ac4	AUTOLIV	GRAZIELE	COLETA: CGR / 465,17+SEGURO: 61,08	DIADEMA	R$ 526,25	526.25	2025-06-10 04:26:17.45535+00	2024-05-01
0ff2771e-4603-4fc9-b12e-a132cd71ef6b	AUTOLIV	DIMAS	ENTREGA: NEWTECH / 890+PEDÁGIO: 162,00	SÃO CARLOS	R$ 1.052,00	1052.00	2025-06-10 04:26:17.45535+00	2024-05-01
8efcf4dd-a814-4ee8-bec6-2f6005d66cfc	AUTOLIV	KELVYN	MULTCARD	SJCAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
67784bca-7394-4af5-ade0-c8c6620aa023	AUTOLIV	GIOVANNA	CLINICA LIDA	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
09e42053-c7df-4106-8ab4-6a7f3b171bc1	PISANI	EDUARDO	ENTREGA: NEW AMP / 565+SEGURO: 100,00	BARUERI	R$ 665,00	665.00	2025-06-10 04:26:17.45535+00	2024-05-01
be95a591-2ceb-4d63-9702-ea948e0ed4b1	PISANI	EDUARDO	ENTREGA: TEXFINISH / 315+SEGURO: 150,00	DIADEMA	R$ 465,00	465.00	2025-06-10 04:26:17.45535+00	2024-05-01
b01a4e67-2f07-4b49-902c-e059cd1d838a	PISANI	EDUARDO	RETORNO: TEXFINISH / 235+SEGURO: 150,00	DIADEMA	R$ 385,00	385.00	2025-06-10 04:26:17.45535+00	2024-05-01
0c0df97a-a1c0-4056-b32e-51d2ce8bcac3	PISANI	EDUARDO	COLETA: ELRING / 2105+SEGURO: 198,56	PIRACICABA	R$ 2.303,56	2303.56	2025-06-10 04:26:17.45535+00	2024-05-01
b5e4d15a-af3d-47e7-8096-2b70050c94a6	PISANI	INGRID	CORREIO	PINDA	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
8f879f02-9481-454f-bf24-00999b8b235f	MUBEA	JULIO SANTOS	COLETA: NUCLEO ELETRONICA	SJCAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
a9f51998-712d-4b90-bd85-0d6b70321ab5	PLASCAR	TAIS	ENTREGA: MAST LAB - NOTA FISCAL	SANTO ANDRÉ	R$ 265,00	265.00	2025-06-10 04:26:17.45535+00	2024-05-01
25815645-b476-4952-9698-91b3c65f6daa	PLASCAR	DANILO	ENTREGA: PLAMAN	SJCAMPOS	R$ 160,00	160.00	2025-06-10 04:26:17.45535+00	2024-05-01
2cf90f0c-d7eb-4863-b329-aef9755813bd	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
60bc49ac-db23-41b8-8131-2fc98a87d053	ACTA	VILMEI	ROTAS DE SEXTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
6d6b3a60-4194-40d2-893d-f35cf3479c00	CAMPO LIMPO	ANDRÉ	COMINDRE	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
d831d117-bb69-439e-8b94-e6434613dd58	RIB PRETO	HELENE	COLETA FRAC: SAFETLINE / 470+SEGURO: 1,63	RIB PRETO	R$ 471,63	471.63	2025-06-10 04:26:17.45535+00	2024-05-01
75719fd4-0caf-4016-82e8-ff43c80f3fa5	RECICLAGEM	PATRCIA SANTOS	COLETA: HENFEL / 1595+SEGURO: 74,94	JABOTICABAL	R$ 1.669,94	1669.94	2025-06-10 04:26:17.45535+00	2024-05-01
c46c1ed9-3052-4e42-bf62-fbd043f8f22f	INPEV	BRUNA	COLETA: KIMARK / 380+SEGURO: 12,80	SÃO PAULO	R$ 392,80	392.80	2025-06-10 04:26:17.45535+00	2024-05-01
4d5cce35-7a76-4b70-adaa-4369c26f1506	HYDROSTEC	GUSTAVO	COLETA FRAC: MARCOFLAN	SÃO PAULO	R$ 210,00	210.00	2025-06-10 04:26:17.45535+00	2024-05-01
e21ef047-ba8b-4847-9701-1edfc2cfe8af	HYDROSTEC	FELIPE	UNIVERSO	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
77474372-c5a3-4218-a09f-20072bbb78a1	HYDROSTEC	FELIPE	ARBO / ARBO	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
ccf60fbb-6250-4d42-884d-16d24cf3329c	HYDROSTEC	RAFAELA	FIXSAN	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
fd5c068b-9f70-403d-b922-ceda487d5a2d	MUBEA/FIXO	JOÃO	CARTÓRIO / CORREIO	TAUBATÉ	R$ 180,00	180.00	2025-06-10 04:26:17.45535+00	2024-05-01
027f27d6-ba10-493d-bb06-8b150157f16c	MUBEA/FIXO	SAFIRA	PAGAMENTO DE GUIA	TAUBATÉ	\N	\N	2025-06-10 04:26:17.45535+00	2024-05-01
d0adc46a-59bd-4355-8507-63523488dc0f	CIESP	CLOVIS	ENTTREGA DE CARRO SP FIESP	SAO PAULO	R$ 425,00	425.00	2025-06-10 04:26:17.45535+00	2024-05-01
872f9a83-d960-4ac7-addf-a9988006ac4e	IFF	THAIS MERY	ENTREGA: FRONERI	RIO DE JANEIRO	R$ 750,00	750.00	2025-06-10 04:26:17.45535+00	2024-05-01
bea2d51e-9ad8-43cc-84a4-dab5ffd84f9b	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
9ffc0eb6-84fe-4108-aa2c-d9130a5948f0	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 203,48	VARZEA PSTA	R$ 1.853,48	1853.48	2025-06-10 04:26:17.45535+00	2024-05-01
0e13ee05-637c-4a2c-a396-ca898d58342e	AUTOLIV	GRAZIELE ASSIS	COLETA: DC LABEL	SÃO PAULO	R$ 380,00	380.00	2025-06-10 04:26:17.45535+00	2024-05-01
3aeed531-9573-424e-8836-cd52f012d6bd	PLASCAR	MARCELO	COLETA: TAUFER	TAUBATÉ	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
461404b7-e090-4d75-9a74-606a5ef1e002	PLASCAR	DANILO	ENTREGA: FLUID DIVISION / 750+SEGURO: 120,07	AMPARO	R$ 870,07	870.07	2025-06-10 04:26:17.45535+00	2024-05-01
8c9bc8ff-f956-4fc8-b006-8d36afd71470	PLASCAR	LUIS ANTONIO	COLETA: INTRACT	SÃO PAULO	R$ 250,00	250.00	2025-06-10 04:26:17.45535+00	2024-05-01
0fc431be-8ab2-4a36-9adc-dc9acfdd1bea	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
09feec34-718c-4738-aa6f-0c71e34f22c8	PISANI	EDUARDO	COLETA: ENGEL	COTIA	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
17c5aeb7-4f0c-49c9-8341-37696b0c06c3	PISANI	EDUARDO	CORREIO	PINDA	R$ 55,00	55.00	2025-06-10 04:26:17.45535+00	2024-05-01
f8a7c949-2094-4651-a55e-25c2e1c3f389	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1650+SEGURO: 47,13	VARZEA PSTA	R$ 1.697,13	1697.13	2025-06-10 04:26:17.45535+00	2024-05-01
05f6a836-b7bc-452d-b5d1-6f5ac5878e04	IFF	LUIZ FERNANDO	ENTREGA: FOOD INTELIGENCE	SÃO PAULO	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
2a5d22a7-8970-4b68-9b73-1d240e4630b7	CAMPO LIMPO	RONAN	CORREIO	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
5181a289-56d6-4788-a20e-33c14807a133	INPEV	BRUNA	COLETA: MECALOR / 1150+SEGURO: 1.476	SÃO PAULO	R$ 2.626,00	2626.00	2025-06-10 04:26:17.45535+00	2024-05-01
d2791aa1-a6a8-4d89-8d98-de6321d646b1	TAMPAS	HENRIQUE	COLETA: FRANTEC / 1290+SEGURO: 13,15	FRANCA	R$ 1.313,15	1313.15	2025-06-10 04:26:17.45535+00	2024-05-01
6d445e11-9ddb-48c8-b224-eebdef5d4e9c	RECICLAGEM	RODRIGO	ENTREGA: FUSH / 1250+SEGURO: 1650	TAB DA SERRA	R$ 2.900,00	2900.00	2025-06-10 04:26:17.45535+00	2024-05-01
575d72c2-ac8f-4ca9-8591-faf64bfee4e1	RECICLAGEM	RODRIGO	ENTREGA: TBM / 1150+SEGURO: 1.200	SÃO PAULO	R$ 2.350,00	2350.00	2025-06-10 04:26:17.45535+00	2024-05-01
9c72341d-1813-42b6-ab93-8f14ac0a6072	RECICLAGEM	HELENA	COLETA: BUNZL / 380+SEGURO: 36,24	GUARULHOS	R$ 416,24	416.24	2025-06-10 04:26:17.45535+00	2024-05-01
cf1c7b01-6220-4e92-ab76-fb016c50f015	RESINAS	RODRIGO	ENTREGA: TRUCK / 995+SEGURO: 100,00	SÃO PAULO	R$ 1.095,00	1095.00	2025-06-10 04:26:17.45535+00	2024-05-01
81e39f55-5a07-4aa2-915e-0ed5e08152ee	HYDROSTEC	RAFAELA	POTENZA	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
ae59831e-a099-4263-87de-ee4e15877ee1	HYDROSTEC	RAFAELA	UNIVERSO	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
ef17ba5d-a52f-4714-aafe-477150f4af5f	HYDROSTEC	SILVIO	RELE ROLAMENTOS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
986748f0-9baf-4972-8a05-7de67c52a317	HYDROSTEC	GUSTAVO	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
978af2d7-a718-48b7-8a7e-d4e705f111ee	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 155,05	VARZEA PSTA	R$ 1.805,05	1805.05	2025-06-10 04:26:17.45535+00	2024-05-01
5f0afb0c-a7c2-4e31-bc37-8a48ccceb95b	MUBEA	REGIS DIAS	ENTREGA: DIGICRON	SÃO PAULO	R$ 250,00	250.00	2025-06-10 04:26:17.45535+00	2024-05-01
7f3759c8-816b-4840-9699-01cd219be4c4	MUBEA	REGINA	REY DAS CHAVES	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
e5101433-d9d8-45ff-9997-49051a47116f	IFF	THAIS MERY	ENTREGA: AMBEV	RIO DE JANEIRO	R$ 1.490,00	1490.00	2025-06-10 04:26:17.45535+00	2024-05-01
d544762e-b2df-482d-a948-b62903608896	PLASCAR	MARCO ANTONIO	COLETA: NIKKEYPAR	S J CAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
73a1fcd6-851e-41d4-976f-0dc6d67f075d	PLASCAR	MARCELO	COLETA: FIXSAN	TAUBATÉ	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
bf190c5f-2a29-4fa4-91fe-49e09c87a362	PLASCAR	MARCELO	COLETA: TAUFER	TAUBATÉ	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
1ecbfbd3-293c-4f91-b4a8-cb8ac6e182b1	GV	DEBORA	COLETA: MEGARON / GV - 099544	SÃO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
cb6734e3-3f59-49a6-a81f-49a26f9974bc	GV	PLINIO	COLETA: RADIAL - GV	SÃO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
d7f7192d-5650-4b9d-aadd-4444e39d03fe	LUGAB	JUNIOR	ENTREGA: GV / 490+SEGURO: 126,00	SP / PINDA	R$ 616,00	616.00	2025-06-10 04:26:17.45535+00	2024-05-01
2c1c2ab2-bdc5-419a-b845-c0aefaf6ee17	PISANI	EDUARDO	COLETA: J MENDES	TAUBATÉ	R$ 65,00	65.00	2025-06-10 04:26:17.45535+00	2024-05-01
7032751e-87ae-46c0-bf8d-0d84a9bf67c0	PISANI	EDUARDO	USINAGEM NOVO HORIZONTE	PINDA	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
b22b4ca2-35cb-4945-a4de-104f1f027c86	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
ecd83e6f-8721-43b9-9b49-6479b31395d7	CAMPO LIMPO	PATRICIA SANTOS	CHAVEIRO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
011ccf73-4585-4f12-b808-b6ca6ad21da2	CAMPO LIMPO	RONAN	CORREIO	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
ea882514-ef0a-4429-a52f-0325fa96c60f	RECICLAGEM	THAIS	ENTREGA: POLLOSERV / 1150+SEGURO: 62,50	SÃO PAULO	R$ 1.212,50	1212.50	2025-06-10 04:26:17.45535+00	2024-05-01
17ef1ff6-6877-4169-8e11-bbba8fc94b06	TAMPAS	ISABELA	COLETA FRAC: WORTEX / 245+SEGURO: 74,00	BARUERI	R$ 319,00	319.00	2025-06-10 04:26:17.45535+00	2024-05-01
60cf6751-0c81-48f8-bd22-005b09ccec5c	MUBEA	JULIO SANTOS	COLETA: NEW AMP / SEM NOTA FISCAL	BARUERI	R$ 280,00	280.00	2025-06-10 04:26:17.45535+00	2024-05-01
b1de237d-2f9a-4202-b3be-42c7628bf2c6	MUBEA	MARCOS MOREIRA	TECMAZA	PINDA	R$ 65,00	65.00	2025-06-10 04:26:17.45535+00	2024-05-01
7213827f-6419-4253-a3dd-141d31b1c43c	MUBEA	MAURO	DEPÓSITO CARDOSO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
931f7dda-69ef-4927-ad84-55f62f3acd9c	HYDROSTEC	FELIPE	ENTREGA: LAB SYSTEM	GUARULHOS	R$ 420,00	420.00	2025-06-10 04:26:17.45535+00	2024-05-01
8f449cc6-43db-47df-a62f-cc1e5612e16d	HYDROSTEC	RAFAELA	FIXSAN / VELLOSO	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
96adc14a-023a-4fc3-b633-c13b9d5824a9	HYDROSTEC	SILVIO	RELE ROLAMENTOS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
eed82c95-4bd1-4f30-923b-80eb2d937570	HYDROSTEC	ALINI	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
2c3ef413-982b-44e4-8165-40b245747489	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 246,62	VARZEA PSTA	R$ 1.896,62	1896.62	2025-06-10 04:26:17.45535+00	2024-05-01
8ce42ef0-1218-479c-9c8f-451adc29265c	AUTOLIV	KELVYN	MULTCARD	SJCAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
29ba3aed-e3fa-4408-b8bc-044a364fd79a	GV	BRUNO	COLETA: CALFEN / 2650+SEGURO: 175,00	ITUPEVA	R$ 2.825,00	2825.00	2025-06-10 04:26:17.45535+00	2024-05-01
5cca79df-3213-42bf-8d9c-3b30cc4c384c	GV	ANA DIAS	COLETA: LUITEX / PEDIDO GV-099635	MOGI GUAÇU	R$ 1.034,00	1034.00	2025-06-10 04:26:17.45535+00	2024-05-01
e4a7be07-940c-4ba4-8524-b857f017e80a	CIESP	CLOVIS	COLETA:	GUARÁ	R$ 130,00	130.00	2025-06-10 04:26:17.45535+00	2024-05-01
11bf5796-5d31-4a00-958d-051829fbb24e	CIESP	CLOVIS	COLETA:	PINDA	R$ 75,00	75.00	2025-06-10 04:26:17.45535+00	2024-05-01
9517a04b-c69a-4161-8ec5-6fc70a769d41	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
3ae45c35-0cf9-408e-8160-0b5e057757a5	PISANI	EDUARDO	COLETA: SANTA CRUZ	SÃO PAULO	R$ 980,00	980.00	2025-06-10 04:26:17.45535+00	2024-05-01
7c1a973b-f6f9-4349-865a-6ded2f51e2b7	PLASCAR	MARCELO	ENTREGA: ION TECH / 410+SEGURO: 59,93	SÃO PAULO	R$ 469,93	469.93	2025-06-10 04:26:17.45535+00	2024-05-01
060f6588-6185-43ba-b43f-65aa056d899b	PLASCAR	MARCO	COLETA: POTENZA	TAUBATÉ	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
41059020-7382-4c31-83c8-52697d8d83c7	ACTA	VILMEI	ROTAS DE QUARTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
40048c6c-a4ce-4d95-834b-c3ecb7b5ae09	RECICLAGEM	EVERTON	ENTREGA: MATEC / 675+SEGURO: 185,00	TREMEMBÉ	R$ 860,00	860.00	2025-06-10 04:26:17.45535+00	2024-05-01
62875c10-510e-4a20-84f6-29773547f6a8	RECICLAGEM	DANIEL	COLETA: APS / 140+SEGURO: 32,50	SJCAMPOS	R$ 172,50	172.50	2025-06-10 04:26:17.45535+00	2024-05-01
0f671fe1-5ab2-4c02-aa4f-3f2a5dc003ec	RECICLAGEM	HELENA	COLETA: PREVISÃO / 230+SEGURO:	SÃO PAULO	\N	\N	2025-06-10 04:26:17.45535+00	2024-05-01
ffbd232b-e385-4a74-b27e-e1560171971d	RESINAS	RODRIGO	ENTREGA: AMPARO / 1490+SEGURO: 295,00	AMPARO	R$ 1.785,00	1785.00	2025-06-10 04:26:17.45535+00	2024-05-01
83fc8691-4c5f-4d21-8056-f64d4c9d5c34	RESINAS	RODRIGO	COLETA: AMPARO / 745+SEGURO: 150,00	AMPARO	R$ 895,00	895.00	2025-06-10 04:26:17.45535+00	2024-05-01
bce4e33d-dcd4-4bfd-bbb1-a0b3e092e528	RIB PRETO	HELENA	COLETA: MULTPACK / 1.090+SEGURO:24,80	OSASCO	R$ 1.114,80	1114.80	2025-06-10 04:26:17.45535+00	2024-05-01
0db52ac7-b5af-417a-b560-9650465b7e19	IFF	THAIS MERY	ENTREGA: AMBEV	RIO DE JANEIRO	R$ 750,00	750.00	2025-06-10 04:26:17.45535+00	2024-05-01
28a94a8f-00e6-499a-aaf1-c8eaea847ae4	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
702a8fb8-568b-4b64-a223-0e7226ce2cc3	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
877ca898-4c16-454b-aee9-1763f8dd8112	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
aa6c28bb-706a-4b75-85c0-da23767c56cd	HYDROSTEC	RAFAELA	POTENZA	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
9e1d17bf-5c3f-448d-8980-3f1d33b81232	HYDROSTEC	ALINI	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
eec421d9-0778-4337-8b79-e3103f711d17	HYDROSTEC	RAFAELA	COPYART	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
a401cd7d-671f-4ac2-8178-12831c693f3e	CIESP	CLOVIS	COLETA:	PINDA	R$ 75,00	75.00	2025-06-10 04:26:17.45535+00	2024-05-01
174c0055-fa7a-461b-b446-a26469240ca4	MUBEA/FIXO	JULIANA	SAQUE BANCO ITAÚ / B BRASIL PAG DE MULTA	TAUBATÉ	R$ 180,00	180.00	2025-06-10 04:26:17.45535+00	2024-05-01
e52aa364-778d-44cf-baca-6e1ec5f59820	JULIANA	PARTICULAR	ENTREGA DE APARELHO	CARAGUÁ	R$ 485,00	485.00	2025-06-10 04:26:17.45535+00	2024-05-01
51d040e4-c294-4f93-9f71-3e99e5ef346b	PINTAK	PRISCILLA	ENTREGA: DRIVE BRASIL/Pedido N° 12190	COTIA	R$ 595,00	595.00	2025-06-10 04:26:17.45535+00	2024-05-01
dd91a6a2-89a5-4f4f-a9cd-e370b47f6c70	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 203,15	VARZEA PSTA	R$ 1.853,15	1853.15	2025-06-10 04:26:17.45535+00	2024-05-01
e80f1ac6-056a-4c7d-ab6e-d34f9e8119b0	AUTOLIV	ADRIELY	CLINICA LIDA	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
724d8e77-81e7-4900-a28f-e4a5cd7f907d	LUGAB	JUNIOR	COLETA: GV / 1300+SEGURO: 250,00	PINDA/SP	R$ 1.550,00	1550.00	2025-06-10 04:26:17.45535+00	2024-05-01
f4622650-451f-487f-9862-78950fcf624d	PISANI	EDUARDO	ENTREGA: PKW / 994+SEGURO: 50,00	INDAIATUBA	R$ 1.044,00	1044.00	2025-06-10 04:26:17.45535+00	2024-05-01
f1f6b7d3-b9c0-4226-875e-fd928cedbe12	PISANI	INGRID	COLETA: VF COMERCIO	SÃO PAULO	R$ 470,00	470.00	2025-06-10 04:26:17.45535+00	2024-05-01
9e5befbf-86a3-4b84-bacd-f5ad8c8f0aa8	PISANI	EDUARDO	COLETA: POLIMOLD	S B CAMPO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
ff8dc2a0-d89b-49b8-83da-25da55eb81fe	PLASCAR	DANILO	COLETA FRAC: IZOLTEC / 170+SEGURO: 65,94	SANTO ANDRÉ	R$ 235,94	235.94	2025-06-10 04:26:17.45535+00	2024-05-01
b454dbc6-4167-4c47-893e-1e46870e4365	PLASCAR	DEBORA	COLETA: BRASIL MAGNETS	SÃO PAULO	R$ 410,00	410.00	2025-06-10 04:26:17.45535+00	2024-05-01
bdd2b16a-0b4d-429c-a416-87c29bf292b4	ACTA	VILMEI	ROTAS DE QUINTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
79144db0-ee0c-4684-ac43-b55e52632dbf	CAMPO LIMPO	BRUNO	CARTÓRIO / RETORNO	TAUBATÉ	R$ 40,00	40.00	2025-06-10 04:26:17.45535+00	2024-05-01
e2352b46-8c70-4feb-88e9-521008976aa1	RIB PRETO	HELENA	COLETA: MULTPACK / 1090+SEGURO: 24,80	OSASCO/RP	R$ 1.114,80	1114.80	2025-06-10 04:26:17.45535+00	2024-05-01
58f26fee-71aa-4233-81f1-cf808afdf5c2	RESINAS	PATRICIA SANTOS	COLETA: PLAST FACA / 380+SEGURO: 77,00	SÃO PAULO	R$ 457,00	457.00	2025-06-10 04:26:17.45535+00	2024-05-01
e995bca4-3698-4802-971f-6ab89988abaf	HYDROSTEC	RAFAELA	FIXSAN / CENTER TUDO	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
37e18d94-ce00-4557-a707-aea96f194f45	HYDROSTEC	RAFAELA	POTENZA	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
c5c093f8-b3e3-4bc6-a189-de7a2cd3b809	IFF	THAIS MERY	ENTREGA: PEPSICO	SOROCABA	R$ 650,00	650.00	2025-06-10 04:26:17.45535+00	2024-05-01
f461fab1-bc7d-42f0-ab45-d01ce621707e	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
1c7e2d0e-208c-4ae2-a331-97c4b25a0fce	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 226,68	VARZEA PSTA	R$ 1.876,68	1876.68	2025-06-10 04:26:17.45535+00	2024-05-01
829a70e2-9c02-40c2-8582-bc31699d601c	AUTOLIV	GRAZIELE	COLETA: CGR / 465,17+SEGURO: 68,72	DIADEMA	R$ 533,89	533.89	2025-06-10 04:26:17.45535+00	2024-05-01
9e2f05ee-348e-485b-b7c3-76ff11035819	AUTOLIV	CELSO/VIVIANE	ENTREGA: BALDI / 1650+SEGURO: 43,00 + 190,00 ADICIONAL	VARZEA PSTA	R$ 1.883,00	1883.00	2025-06-10 04:26:17.45535+00	2024-05-01
073092c6-c72f-4d25-ae4f-df4da51178b4	CBF	JAVIER	ENTREGA FRAC: GV	SP/PINDA	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
611675aa-1f44-4fa9-94e6-7501152c3014	GV	ANA DIAS	COLETA: MILANI / 3.425+SEGURO: 225,00	CORDEIROPOLIS	R$ 3.650,00	3650.00	2025-06-10 04:26:17.45535+00	2024-05-01
56573ade-288b-40b6-a1d3-1d2a15b6a3ca	GV	ANA DIAS	COLETA: ABECOM / 490+SSEGURO: 198,00	SÃO PAULO	R$ 688,00	688.00	2025-06-10 04:26:17.45535+00	2024-05-01
916d2d39-711b-4bc4-89b3-e1e9590d5faa	PLASCAR	DANILO	COLETA: DURR / 410+SEGURO:	SÃO PAULO	R$ 729,15	729.15	2025-06-10 04:26:17.45535+00	2024-05-01
8241acaf-162a-4eb3-8484-bda2480a1fd4	PELZER	ANDERSON	COLETA: TECHNUS	GUARULHOS	R$ 265,00	265.00	2025-06-10 04:26:17.45535+00	2024-05-01
16aa1d75-7855-44f5-906a-2122d6d981ca	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
27dc817c-abde-4251-a720-b2295bdd7974	PISANI	EDUARDO	COLETA: NEW AMP / 595+SEGURO: 100,00	BARUERI	R$ 695,00	695.00	2025-06-10 04:26:17.45535+00	2024-05-01
bb6dbd81-bcbe-48a7-8c29-7d82ccd06ae5	ACTA	VILMEI	ROTAS DE SEXTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
1b099643-14ee-4ec9-926c-5c39b0143b17	RECICLAGEM	RONAN	ENTREGA: PGT / 280+150+SEGURO: 3,43	CARAPICUIBA	R$ 443,43	443.43	2025-06-10 04:26:17.45535+00	2024-05-01
4cce1699-085b-46f4-9909-334e8f4247de	RECICLAGEM	RONAN	COLETA: BASF / 250+SEGURO: 1,01	GUARÁ	R$ 251,01	251.01	2025-06-10 04:26:17.45535+00	2024-05-01
fbf67ffd-bc20-40ab-9048-e3f7f809f6bf	RECICLAGEM	PATRICIA SANTOS	COLETA: GSET / 380+SEGURO: 18,90	SÃO PAULO	R$ 398,90	398.90	2025-06-10 04:26:17.45535+00	2024-05-01
4a14e19d-5236-47a9-84a9-0634c8efb7cc	RECICLAGEM	EVERTON	COLETA: JORGE FERRARI / 250+SEGURO: 25,00	SANTO ANDRÉ	R$ 275,00	275.00	2025-06-10 04:26:17.45535+00	2024-05-01
999e1743-0e13-45d3-bd38-476cfee7e8d1	RESINAS	ANDRÉ	COLETA: WORTEX MAQ. / 745+SEGURO: 68,35	CAMPINAS	R$ 813,35	813.35	2025-06-10 04:26:17.45535+00	2024-05-01
6264cf24-732f-4b73-9c71-539d8d452dcd	RESINAS	ANDRÉ	COLETA: WORTEX ROSC. / 745+SEGURO: 1.000	CAMPINAS	R$ 1.745,00	1745.00	2025-06-10 04:26:17.45535+00	2024-05-01
c11b2c53-1166-4df6-8a30-21577165df04	TAMPAS	PAULA	ENTREGA: SANPAR / 1560+SEGURO: 42,48	SANT PARNAIBA	R$ 1.602,48	1602.48	2025-06-10 04:26:17.45535+00	2024-05-01
57be4264-eb18-49b8-a1db-49c2fed7dcf8	HYDROSTEC	AMANDA	CORREIO	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
c9529ba9-4d25-450e-96f6-d09d7a22c454	HYDROSTEC	FELIPE	LOJA DO MARIO/ARBO/COREVAL	TAUBATÉ	R$ 45,00	45.00	2025-06-10 04:26:17.45535+00	2024-05-01
1fc0dbf6-8209-4246-8cf9-ad53c9f40986	HYDROSTEC	FELIPE	CHAVEIRO - IDA E VOLTA	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
4c759928-c258-4d0f-971d-b80d6526a15f	HYDROSTEC	RAFAELA	FIXSAN/CENTER TUDO/COPYART	TAUBATÉ	R$ 45,00	45.00	2025-06-10 04:26:17.45535+00	2024-05-01
9959443c-4a94-40ba-a07e-ba823b715a01	IFF	THAIS MERY	ENTREGA: BRF	SÃO PAULO	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
f6948aef-edc5-4157-b200-df680c5dba77	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
4c2a2772-c39c-4644-b41f-c0ff5c82cd48	PINTAK	PRISCILLA	VALE SAFE	TAUBATÉ	R$ 25,00	25.00	2025-06-10 04:26:17.45535+00	2024-05-01
2ce6a608-fe47-47c0-b99d-5aa053618964	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 208,85	VARZEA PSTA	R$ 1.858,85	1858.85	2025-06-10 04:26:17.45535+00	2024-05-01
f5f5f4aa-54c2-436e-a560-bbac155106a6	AUTOLIV	GRAZIELE ASSIS	ENTREGA: BALDI	VARZEA PSTA	R$ 1.650,00	1650.00	2025-06-10 04:26:17.45535+00	2024-05-01
308d8dfb-fc94-4da1-a318-611271846227	AUTOLIV	ELIAS	ENTREGA: RENAULT	S J DOS PINHAIS	R$ 2.195,00	2195.00	2025-06-10 04:26:17.45535+00	2024-05-01
4ccf1bed-30d0-4421-94c9-eabd80ba3637	GV	ANA DIAS	ENTREGA: MULT MOT / 625+SEGURO:	SANT PARNAÍBA	R$ 1.025,00	1025.00	2025-06-10 04:26:17.45535+00	2024-05-01
c1f7b517-44c1-4924-9ec6-885695ca6274	GV	PLÍNIO	COLETA: RADIAL	SÃO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
94628744-9c43-49b4-a054-641852947b19	PLASCAR	DANILO	ENTREGA: DURR / 410+SEGURO: 160,00	SÃO PAULO	R$ 570,00	570.00	2025-06-10 04:26:17.45535+00	2024-05-01
fe2ad5b6-0c5b-4303-8a7d-c007436322e6	PISANI	EDUARDO	COLETA: PKW / 994+SEGURO: 50,00	INDAIATUBA	R$ 1.044,00	1044.00	2025-06-10 04:26:17.45535+00	2024-05-01
16b111ce-dfa7-4c2d-981f-576a45ec4d48	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
2d74c031-0b8d-4474-a814-462a9de363b0	AUTOLIV	GRAZIELE ASSIS	COLETA: BALDI	VARZEA PSTA	R$ 1.650,00	1650.00	2025-06-10 04:26:17.45535+00	2024-05-01
7cf95d1b-29f1-47a4-b431-70664f435e23	AUTOLIV	GRAZIELE ASSIS	COLETA: BALDI / 1650+SEGURO: 60,56	VARZEA PSTA	R$ 1.710,56	1710.56	2025-06-10 04:26:17.45535+00	2024-05-01
8c4b36bc-8f75-468f-9d0e-047aae08255e	CAMPO LIMPO	RH	COLETA: TENDA	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
2c0decab-f901-44ab-8487-ed7449cd3033	RECICLAGEM	RONAN	COLETA: PGT / 280+SEGURO: 3,43	CARAPICUIBA	R$ 283,43	283.43	2025-06-10 04:26:17.45535+00	2024-05-01
ff9e1136-17c2-46d6-a9da-c41e414baedd	IFF	THAIS MERY	ENTREGA: PEPSICO	SOROCABA	R$ 650,00	650.00	2025-06-10 04:26:17.45535+00	2024-05-01
264eb7d8-b95f-491c-9e07-3fb167711e00	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
eea2d63b-8c2d-4777-b881-cd5a83c37cca	CIESP	CLOVIS	COLETA DE DOCUMENTO - ERICSON	S J CAMPOS	R$ 140,00	140.00	2025-06-10 04:26:17.45535+00	2024-05-01
d4930ad0-d88b-4444-ad5d-ba25ef05cfc7	HYDROSTEC	GUSTAVO	TINTAS TAUBATÉ	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
19dd1ef9-43cc-4c1d-bff8-25de78d88ac6	HYDROSTEC	RAFAELA	FIXSAN	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
ae0ea293-3866-49a4-876d-6cf3f88c874c	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO:	VARZEA PSTA	R$ 1.650,00	1650.00	2025-06-10 04:26:17.45535+00	2024-05-01
8546d311-8c86-430c-9099-94a1bd95e201	AUTOLIV	VIVIANE	COLETA: SPEED FUSION	S J CAMPOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
39fc1711-e1de-4612-81c6-ddb30082c560	AUTOLIV	VIVIANE	COLETA: SPEED FUSION / 450+seguro: 113,03	S J CAMPOS	R$ 563,03	563.03	2025-06-10 04:26:17.45535+00	2024-05-01
9dba40e1-8fc6-426c-88e7-d5a30682c194	GV	ANA DIAS	ENTREGA: INOVART / 744+SEGURO: 87,75	ITATIBA	R$ 831,75	831.75	2025-06-10 04:26:17.45535+00	2024-05-01
941d9114-af41-4be4-9142-b6ce6ef05a14	PLASCAR	MARCELO	COLETA FRAC: FILIVALE	SJCAMPOS	R$ 65,00	65.00	2025-06-10 04:26:17.45535+00	2024-05-01
f08a52cb-b05d-47d8-841f-6a15f549aa14	RECICLAGEM	HELENA	COLETA: VEDABRAS / 230+SEGURO: 7,22	SÃO PAULO	R$ 237,22	237.22	2025-06-10 04:26:17.45535+00	2024-05-01
48b0e21d-b8dd-4b3c-a710-7036e6e62b25	RECICLAGEM	ANDRÉ	ENTREGA: FUSH / 1250+SEGURO: 2.400	TAB DA SERRA	R$ 3.650,00	3650.00	2025-06-10 04:26:17.45535+00	2024-05-01
901e7b28-2cc2-4fc8-b306-9b650187c64c	RECICLAGEM	ANDRÉ	COLETA: FUSH / 625+SEGURO: 2.400	TAB DA SERRA	R$ 3.025,00	3025.00	2025-06-10 04:26:17.45535+00	2024-05-01
f54e74a8-9412-437f-897f-60636e332f1f	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
cb3360a9-1b60-414c-8af9-166a045f182b	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
d36d5d0a-3520-442c-ad38-40451470b7bf	HYDROSTEC	CARMEN	2 CARTÓRIOS / ESPERA / RETORNO	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
d044dc2d-22c4-4827-a5cb-0d9701308bd6	HYDROSTEC	RAFAELA	COPYART	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
80e67ae5-4fe1-45af-9605-043ad9a5c769	HYDROSTEC	GUSTAVO	TINTAS GONÇALVES - IDA E VOLTA	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
ac7ec74b-5bf2-481c-8a80-8f23966766cb	MUBEA	ALAN CASTILHO	COLETA: JAFER	BRAG. PAULISTA	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
d0587b87-d267-4ccd-b74d-bec5211764fb	AUTOLIV	ELIAS	ENTREGA: VOLKS / 465+PEDÁGIOS	S B CAMPO	R$ 465,00	465.00	2025-06-10 04:26:17.45535+00	2024-05-01
3153d9ff-0d12-4697-ae07-b094356e55e3	AUTOLIV	RODRIGO RAMOS	COLETA: MCI	TAB DA SERRA	R$ 280,00	280.00	2025-06-10 04:26:17.45535+00	2024-05-01
e50c984e-879c-49c1-b0a9-22f449f83f83	AUTOLIV	CELSO/VIVIANE	ENTREGA: BALDI / 660+SEGURO: 53,83	VARZEA PSTA	R$ 713,83	713.83	2025-06-10 04:26:17.45535+00	2024-05-01
54642793-faf9-499a-8e11-ee5e057b490c	AUTOLIV	CELSO/VIVIANE	COLETA: BALDI / 1.650+SEGURO: 216,05	VARZEA PSTA	R$ 1.866,05	1866.05	2025-06-10 04:26:17.45535+00	2024-05-01
b2cc4675-7b0d-477d-9720-dbeba92c7b77	AUTOLIV	RYAN	ENTREGA: TOX / 2550+SEGURO: 105,00	JOINVILLE	R$ 2.655,00	2655.00	2025-06-10 04:26:17.45535+00	2024-05-01
eb87f74a-70ec-4197-a7f9-2f94a2d56014	PINTAK	VITÓRIA	COLETA: FEIRA DA BORRACHA (MCM)	S J CAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
a3f041ac-29df-47b9-8724-be8307864408	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
c8c5145a-b2b8-47b8-aee3-79c001a5778f	LUGAB	JUNIOR	ENTREGA: GV	PINDA/SP	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
1fbb7cc1-e7bc-43ed-9bc9-b8e476a01888	PISANI	EDUARDO	USINAGEM NOVO HORIZONTE	PINDA	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
5e1e384d-2892-48d9-aada-3af95905e870	GV	ANA DIAS	COLETA: KLUBER / 1450+SEGURO: 194,20	COTIA	R$ 1.644,20	1644.20	2025-06-10 04:26:17.45535+00	2024-05-01
c4f7ebaf-d91c-4a83-bbc9-665fb22eac61	GV	ANA DIAS	ENTREGA: ESA / 1850+SEGURO: 1.200	DIADEMA	R$ 3.050,00	3050.00	2025-06-10 04:26:17.45535+00	2024-05-01
625316da-4973-478d-bf0b-07c661e13d3a	GV	ANA DIAS	COLETA: ELOG / 260+SEGURO: 440,00	S J CAMPOS	R$ 700,00	700.00	2025-06-10 04:26:17.45535+00	2024-05-01
a1b0b97e-3f48-4ba8-b43b-20027b7e02e0	ACTA	VILMEI	ROTAS DE QUARTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
6dccdf1a-bd4d-4a21-a70f-393d0834057b	RECICLAGEM	PATRICIA	COLETA: CANINDÉ / 380+SEGURO: 9,50	SÃO PAULO	R$ 389,50	389.50	2025-06-10 04:26:17.45535+00	2024-05-01
11db62d7-5d5b-44f3-8540-aadcce44fbb6	RECICLAGEM	PATRICIA	COLETA: DBD / 230+SEGURO: 3,07	MAUÁ	R$ 233,07	233.07	2025-06-10 04:26:17.45535+00	2024-05-01
5519660f-1cb3-400b-8d48-3675183074d6	AUTOLIV	ELIAS	ENTREGA: ADIENT	S B CAMPO	\N	\N	2025-06-10 04:26:17.45535+00	2024-05-01
77956c7b-8071-4f98-80a8-20c33b42ea4f	AUTOLIV	KELVYN	MULTCARD	SJCAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
53f7348c-9023-4138-b233-43e07a5083df	AUTOLIV	VIVIANE	ENTREGA: BALDI / 660+SEGURO: 53,83	VARZEA PSTA	R$ 713,83	713.83	2025-06-10 04:26:17.45535+00	2024-05-01
762facfb-d370-49fa-9971-567941968e12	AUTOLIV	VIVIANE	COLETA: BALDI / 1.650+SEGURO: 223,11	VARZEA PSTA	R$ 1.873,11	1873.11	2025-06-10 04:26:17.45535+00	2024-05-01
74a15148-bf7c-4312-995c-b1f9641280bd	MUBEA	REGIS DIAS	COLETA: TEK BRASIL / 250+SEGURO: 69,87	SAO PAULO	R$ 319,87	319.87	2025-06-10 04:26:17.45535+00	2024-05-01
34f6a3c6-d931-4e41-a413-bc9e983772e6	HYDROSTEC	FELIPE	UNIVERSO	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
9918d602-f733-4134-8aab-a811800978c7	HYDROSTEC	RAFAELA	FIXSAN	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
83f792d9-0c19-4d0b-8e39-475aa3c90160	GV	CIOMARA	COLETA: HYTORC / 500+SEGURO: 192,11	S B CAMPO	R$ 692,11	692.11	2025-06-10 04:26:17.45535+00	2024-05-01
7b337f7a-48a8-42d3-891f-cfb3f47330b4	GV	ANA DIAS	COLETA: ICONIC / 1450+SEGURO: 59,76	GUARULHOS	R$ 1.509,76	1509.76	2025-06-10 04:26:17.45535+00	2024-05-01
a94a6db5-ee9c-4168-8dbb-fcf4407f1dce	GV	ANA DIAS	COLETA: LUGAB / 1360+SEGURO: 250,00	SÃO PAULO	R$ 1.610,00	1610.00	2025-06-10 04:26:17.45535+00	2024-05-01
7c69e8fd-b350-4444-9804-90301e3b7495	ACTA	VILMEI	ROTAS DE QUINTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
38fff0b7-c262-45c8-adfb-e9871c622ebd	CAMPO LIMPO	PORTARIA	CORREIO	TAUBATE	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
57d0fa47-c129-45f4-8c9b-809b57d1a0b5	RECICLAGEM	ANDRÉ	COLETA: FUSH / 625+SEGURO: 2.400	TAB DA SERRA	R$ 3.025,00	3025.00	2025-06-10 04:26:17.45535+00	2024-05-01
a8a1fde0-6a78-47be-af45-a4a7051702e6	RECICLAGEM	ANDRÉ	COLETA: FUSH / 625+SEGURO: 1.833	TAB DA SERRA	R$ 2.458,00	2458.00	2025-06-10 04:26:17.45535+00	2024-05-01
f58696a1-2aa0-4c2c-9da6-a3d3cead2f30	RECICLAGEM	RODRIGO	ENTREGA: PGT / 280+SEGURO: 10,00	CARAPICUIBA	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
b567b455-a36f-4d98-8eff-675b23aa68f5	RECICLAGEM	RODRIGO	COLETA: PGT / 280,00+SEGURO: 10,00	CARAPICUIBA	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
4bae5d4e-e0af-4566-b236-2370a239839b	RECICLAGEM	PATRICIA SANTOS	COLETA: ARS / 250+SEGURO: 2,09	SANTO ANDRÉ	R$ 252,09	252.09	2025-06-10 04:26:17.45535+00	2024-05-01
23147b52-61c8-43d8-a4f2-721914b2e9cb	TAMPAS	HENRIQUE	COLETA: GERALDISCOS / 2250+SEGURO: 2.792,62	SANT PARNAIBA	R$ 5.042,62	5042.62	2025-06-10 04:26:17.45535+00	2024-05-01
e34b1b09-41c1-4512-95ea-b3cafcd20ffc	TAMPAS	ISABELA	COLETA: KORETECH / 470+SEGURO: 10,06	BARUERI	R$ 480,06	480.06	2025-06-10 04:26:17.45535+00	2024-05-01
a6f5bb03-476e-42b0-88ee-95a1a31f15af	AUTOLIV	VIVIANE	ENTREGA: BALDI	VARZEA PSTA	R$ 1.650,00	1650.00	2025-06-10 04:26:17.45535+00	2024-05-01
798b61e9-89b0-4890-b276-55bc7a99dbaf	AUTOLIV	VIVIANE	COLETA: BALDI / 1.650+SEGURO: 83,58	VARZEA PSTA	R$ 1.733,58	1733.58	2025-06-10 04:26:17.45535+00	2024-05-01
17f73663-7460-4585-a270-fa5d845783b3	AUTOLIV	VIVIANE	COLETA: BALDI / 660+SEGURO: 122,41	VARZEA PSTA	R$ 782,41	782.41	2025-06-10 04:26:17.45535+00	2024-05-01
1151c43d-3f03-432b-a091-369e6691a54e	IFF	THAIS	ENTREGA: IFF TAMBORÉ	SANT PARNAIBA	R$ 350,00	350.00	2025-06-10 04:26:17.45535+00	2024-05-01
20de0046-ec4f-4562-a8a3-1e062db8822a	IFF	PRISCILA	CARTÓRIO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
23baaba2-ed56-4dba-a0f4-7cebab873514	IFF	THIAGO	CORREIO	TAUBATE	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
fa03d011-15cc-4e1a-83c6-c33a945141bf	HYDROSTEC	GUSTAVO	CORREIO / POTENZA	TAUBATE	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
f5361eb8-b1ce-47b9-9e9b-3c672f850a03	HYDROSTEC	RAFAELA	POTENZA	TAUBATE	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
027a5d4f-23ef-4fda-829f-aeaf43960fb1	HYDROSTEC	RAFAELA	FIXSAN	TAUBATE	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
63a51bfc-bcb8-411a-9d9b-28a7b9ffe6a0	PLASCAR	BRENO	COLETA FRAC: ART MODERNA	SAO PAULO	R$ 550,00	550.00	2025-06-10 04:26:17.45535+00	2024-05-01
885a9bec-2ebd-4c62-9cf3-9cfb7018d925	PLASCAR	MARCELO	ENTREGA FRAC: DURR / 210+SEGURO: 323,01	SÃO PAULO	R$ 533,01	533.01	2025-06-10 04:26:17.45535+00	2024-05-01
c101857b-c3a6-453f-82dc-d81f24bcd8bc	PLASCAR	DANILO	COLETA: LUANA / 525+SEGURO: 350,00	COTIA	R$ 875,00	875.00	2025-06-10 04:26:17.45535+00	2024-05-01
a17a1d8e-525a-48be-a087-e731dcd73b97	PISANI	INGRID	COLETA: CARDELLA / 780+SEGURO: 77,90	VALINHOS	R$ 857,90	857.90	2025-06-10 04:26:17.45535+00	2024-05-01
1b0ea2bf-cd71-4a43-a693-2878e072ba46	PISANI	EDUARDO	COLETA: 4 AUTOM / COLETADO DIADEMA/CARRO	S B C / DIADEMA	R$ 680,00	680.00	2025-06-10 04:26:17.45535+00	2024-05-01
83648ed2-eaf7-4c68-aa17-7e5304a6d260	GV	ANA DIAS	ENTREGA: MACOPEMA / 4900+SEGURO: 1.257,44	MONTE ALTO	R$ 6.157,44	6157.44	2025-06-10 04:26:17.45535+00	2024-05-01
8ebd0df9-fccd-4066-87f4-e7037a99fb54	GV	ANA DIAS	ENTREGA: MOREIRA JUNIOR	TAUBATÉ	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
4a243a8c-ff6f-496c-a0c7-1b94f0be2507	GV	ANA DIAS	COLETA: MOREIRA JUNIOR	TAUBATÉ	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
258953a8-75c5-410b-89c7-072b76bb35fd	ACTA	VILMEI	ROTAS DE SEXTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
1c2e4911-9ef4-41ba-8b3d-46b01989cd28	RESINAS	HELENA	COLETA: FORNOS CELLI / 750+SEGURO: 87,83	SOROCABA	R$ 837,83	837.83	2025-06-10 04:26:17.45535+00	2024-05-01
8156020e-8b33-4145-8a02-073b2edc8b9a	RECICLAGEM	ISABELA	COLETA: SAFETLINE / 670+SEGURO: 4,42	HORTOLANDIA	R$ 674,42	674.42	2025-06-10 04:26:17.45535+00	2024-05-01
ce4a0465-fe42-45a6-855a-692ed4482060	RECICLAGEM	HELENA	COLETA: BANU / 380+SEGURO: 20,80	SÃO PAULO	R$ 400,82	400.82	2025-06-10 04:26:17.45535+00	2024-05-01
8a1557f6-4ca7-4f65-a29f-e7057726b14f	RECICLAGEM	PATRICIA SANTOS	COLETA: FAMABRÁS / 380+SEGURO: 8,54	ITAQUA	R$ 388,54	388.54	2025-06-10 04:26:17.45535+00	2024-05-01
3cc7a622-9098-42d1-bec4-f6a66917edf6	RECICLAGEM	HELENA	COLETA: VEDABRÁS / 230+SEGURO: 25,05	SÃO PAULO	R$ 255,05	255.05	2025-06-10 04:26:17.45535+00	2024-05-01
5f7077f7-6b7a-4325-944b-dcf8899eea06	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
f8f98c1b-1043-44f3-96b8-3b732407b2ae	IFF	FELIPE	CHAVEIRO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
065a47eb-aca5-4eee-b917-88d9171e1a1e	MUBEA	MARCOS MOREIRA	COLETA: RADIAL	SÃO PAULO	R$ 250,00	250.00	2025-06-10 04:26:17.45535+00	2024-05-01
840862de-3381-4120-b71c-95573c01d1bc	MUBEA	ANDRÉ MOREIRA	COLETA: THERMOMATIC	SÃO PAULO	R$ 250,00	250.00	2025-06-10 04:26:17.45535+00	2024-05-01
c5815866-72d9-4f86-bada-8e71b6790492	AUTOLIV	VIVIANE	COLETA: BALD - 8H / 1650+SEGURO: 83,58	VARZEA PSTA	R$ 1.733,58	1733.58	2025-06-10 04:26:17.45535+00	2024-05-01
900bb713-b31f-400e-8f4c-64accfd268cd	AUTOLIV	VIVIANE	COLETA: BALDI - 12H / 1650+SEGURO: 109,73	VARZEA PSTA	R$ 1.759,73	1759.73	2025-06-10 04:26:17.45535+00	2024-05-01
6128eee0-46b1-45b8-b714-9d0115020fe2	CIESP	CLOVIS	ENTREGA DE DOCUMENTO	SÃO PAULO	R$ 250,00	250.00	2025-06-10 04:26:17.45535+00	2024-05-01
fe6ce5cf-40af-4956-b9cc-4b56e2718cca	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
daea773e-f58d-4150-91c1-fe22dda5130e	PELZER	RAFAEL	COLETA: SPECIAL GASES (2 REMESSAS/MESMA NOTA	GUARULHOS	R$ 900,00	900.00	2025-06-10 04:26:17.45535+00	2024-05-01
717b12ce-67da-486f-8ff3-32662d72fcb3	HYDROSTEC	FELIPE	ARBO / COREVAL	TAUBATE	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
f3cbb609-4190-4a15-9b2e-7078a4623ccb	HYDROSTEC	RAFAELA	ENTREGA SEM NF:	OSASCO	R$ 465,00	465.00	2025-06-10 04:26:17.45535+00	2024-05-01
6c257c2b-34c5-4965-85a6-1af04f82cea2	HYDROSTEC	RAFAELA	FIXSAN	TAUBATE	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
df21c653-94ab-40f6-97bd-b5f362d9b085	COPEC	FATIMA	COLETA COPEC PARA GV = FRACIONADO	OSASCO	R$ 390,00	390.00	2025-06-10 04:26:17.45535+00	2024-05-01
4c94de92-50e4-4afa-8787-e02e34a48172	HYDROSTEC	RAFAELA	COLETA: NEOCONEX / 265+SEGURO: 118,36	SANTO ANDRÉ	R$ 383,16	383.16	2025-06-10 04:26:17.45535+00	2024-05-01
f91a1edd-3538-410b-b56c-83a9b1e011f7	PLASCAR	MARCO ANTONIO	COLETA: FIXSAN	TAUBATE	R$ 85,00	85.00	2025-06-10 04:26:17.45535+00	2024-05-01
e78ff9ef-d9ed-4b1a-bf31-8611399d82df	GV	ALEXANDRE	ENTREGA: AVK / 637,93+SEGURO: 62,07	SOROCABA	R$ 700,00	700.00	2025-06-10 04:26:17.45535+00	2024-05-01
066600ea-08dd-4431-885e-524df6f5bd47	GV	ALEXANDRE	COLETA AVK / 641,00+SEGURO: 59,00	SOROCABA	R$ 700,00	700.00	2025-06-10 04:26:17.45535+00	2024-05-01
5b19b207-9079-4869-8ca6-89d92f4d5fd1	PISANI	EDUARDO	ENTREGA: GM	S J CAMPOS	R$ 235,00	235.00	2025-06-10 04:26:17.45535+00	2024-05-01
f04e653f-7ca0-41f9-b78b-5f8489aac400	LUGAB	JUNIOR	COLETA: GV P LUGAB / 1200+SEGURO: 706,37	SAO PAULO	R$ 1.906,37	1906.37	2025-06-10 04:26:17.45535+00	2024-05-01
5d700b7e-9adc-42d8-9e0d-b4756a6d863d	IFF	THAIS	ENTREGA: IFF TAMBORÉ	SANT PARNAIBA	R$ 410,00	410.00	2025-06-10 04:26:17.45535+00	2024-05-01
c04c3e16-e38d-493e-83bb-10d45104b6f9	AUTOLIV	VIVIANE	COLETA: BALDI / 1650+SEGURO: 84,12	VARZEA PSTA	R$ 1.734,12	1734.12	2025-06-10 04:26:17.45535+00	2024-05-01
2f4b5f3a-72e2-42a5-8ee1-1c83fb2c446a	AUTOLIV	VIVIANE	COLETA: BALDI / 1650+SEGURO: 17,93	VARZEA PSTA	R$ 1.667,93	1667.93	2025-06-10 04:26:17.45535+00	2024-05-01
c35dab2a-687e-497a-aa8c-0f0f5498d486	CAMPO LIMPO	LOGISTICA	PAPELARIA - IDA E VOLTA	TAUBATÉ	R$ 40,00	40.00	2025-06-10 04:26:17.45535+00	2024-05-01
06f9dd98-f936-49a1-a5b6-475b7c9abf16	RECICLAGEM	HELENA	ENTREGA: COM FERRAG / 900+SEGURO: 3,06	RIB PRETO	R$ 903,06	903.06	2025-06-10 04:26:17.45535+00	2024-05-01
38a10666-a68f-44f5-8fa3-cf20c675f7f2	RECICLAGEM	PATRICIA CARLA	COLETA: DELAMARIS / 2376+SEGURO: 66,75	JOINVILLE	R$ 2.442,75	2442.75	2025-06-10 04:26:17.45535+00	2024-05-01
703f44d4-1c98-46c2-8f95-360136804528	HYDROSTEC	CARMEN	CARTÓRIO	TAUBATÉ	R$ 45,00	45.00	2025-06-10 04:26:17.45535+00	2024-05-01
c2e75169-eee7-45f6-88b7-ac39f4ee5465	HYDROSTEC	GUSTAVO	TINTAS GONÇALVES	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
182f0e68-12ee-4caa-88f6-0cf34817d668	HYDROSTEC	RAFAELA	POTENZA -	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
770a4134-43d6-4fb0-aa7e-176920a4e75c	HYDROSTEC	RAFAELA	FIXAN - IDA E VOLTA	TAUBATÉ	R$ 30,00	30.00	2025-06-10 04:26:17.45535+00	2024-05-01
1185f0d2-14f0-4266-9d60-4a116a43b027	MUBEA	REGINA	ENTREGA DE DOCUMENTO - FUNCIONÁRIO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
70c90e62-100c-46de-99e8-11a2a2f42e88	MUBEA	REGINA	ENTREGA DE DOCUMENTO - FUNCIONÁRIO	TREMEMBÉ	R$ 55,00	55.00	2025-06-10 04:26:17.45535+00	2024-05-01
743181c5-952d-452c-a1f2-87e4e52ceb0a	IFF	MICHELLE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
69ea38fd-0323-40ab-8358-b78580bec554	AUTOLIV	VIVIANE	ENTREGA: BALDI	VARZEA PSTA	R$ 660,00	660.00	2025-06-10 04:26:17.45535+00	2024-05-01
0bd69276-121f-406c-968a-541e10852b73	AUTOLIV	VIVIANE	COLETA: BALD / 1650+SEGURO: 140,60	VARZEA PSTA	R$ 1.790,60	1790.60	2025-06-10 04:26:17.45535+00	2024-05-01
00f807ec-f48e-4adb-88d1-1720f8a6a060	AUTOLIV	ADRIELY	CLINICA LIDA	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
7f208068-9799-421b-b5d1-742e1a1bf854	LUGAB	JUNIOR	COLETA: LUGABX GV	SAO PAULO/PINDA	R$ 490,00	490.00	2025-06-10 04:26:17.45535+00	2024-05-01
8ef4cecd-14a1-4740-b5d2-78a15c0686f6	PLASCAR	DANILO	COLETA: ELETRO MEC. UNIVERSO	SJCAMPOS	R$ 95,00	95.00	2025-06-10 04:26:17.45535+00	2024-05-01
53eb28cc-b3a5-42c7-8c8f-0899982601de	TAMPAS	HENRIQUE	COLETA: SANPAR / 780+SEGURO: 87,73	SANT PARNAÍBA	R$ 867,73	867.73	2025-06-10 04:26:17.45535+00	2024-05-01
b54b24dc-ee5d-4b06-8bdf-c0f025a29c2f	TAMPAS	HENRIQUE	COLETA: GERALDISCOS / 2250+SEGURO: 5.494,27	SANT PARNAÍBA	R$ 7.744,27	7744.27	2025-06-10 04:26:17.45535+00	2024-05-01
bf4aff30-c68c-46f6-bedc-67f23d22fae3	TAMPAS	PATRICIA SANTOS	COLETA: ARBURG / 230+SEGURO: 10,76	SÃO PAULO	R$ 240,76	240.76	2025-06-10 04:26:17.45535+00	2024-05-01
9794ed96-d079-4f19-ba49-df24129fc00b	RECICLAGEM	RODRIGO	COLETA: TBM / 1.150+SEGURO: 1.200	SÃO PAULO	R$ 2.350,00	2350.00	2025-06-10 04:26:17.45535+00	2024-05-01
4c6f010f-5cf5-45f4-bc80-a36385ec2171	CAMPO LIMPO	THAIS	KRAFTT	TAUBATE	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
d0829399-ab67-49a0-ba4e-2fde1de13968	GV	ANA CLAUDIA	ENTREGA: COPEGE / FRACIONADO	SÃO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
6d6919a8-3f0c-4ca5-95c1-ac743cd968ce	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
bc831a2a-80f7-48ff-8388-01c66cc6048e	IFF	FELIPE	CHAVEIRO	TAUBATE	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
76d5466c-4a35-4621-a56d-d5a3eca652d6	IFF	THAIS	ENTREGA,HOTEL PLAZA PAULISTA	SP	R$ 390,00	390.00	2025-06-10 04:26:17.45535+00	2024-05-01
d9d146ff-6242-4613-afb8-26bf01cf1fb4	HYDROSTEC	CARMEN	CARTÓRIO	TAUBATE	R$ 45,00	45.00	2025-06-10 04:26:17.45535+00	2024-05-01
0d0a290d-d84e-43c2-9ee1-6404d25feee2	HYDROSTEC	RH	ÓTICA DISI	TAUBATE	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
6d043a3b-fed7-4064-b03c-63df7be37200	HYDROSTEC	ALAN	J A PLACAS	TAUBATE	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
0727cb95-9e67-4cfe-b055-6bb59c5d766d	HYDROSTEC	RAFAELA	CENTER TUDO	TAUBATE	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
2301650f-13b9-46e0-8fc6-258d96381cd4	HYDROSTEC	GUSTAVO	CORREIO	TAUBATE	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
c9e5a68d-4da3-4b9e-84f1-9d7cde376935	HYDROSTEC	RAFAELA	FIXSAN	TAUBATE	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
1f66d019-a8e5-4145-8bba-2259ccbef649	MUBEA	REGINA	CHAVEIRO - IDA E VOLTA	TAUBATE	R$ 40,00	40.00	2025-06-10 04:26:17.45535+00	2024-05-01
c51a9d76-b4b1-461d-bac4-165adab7fcbf	MUBEA	REGINA	CORREIO	TAUBATE	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
835e367e-d7c8-47b4-aa53-78e6d4a75e12	LUGAB	JUNIOR	COLETA: LUGAB X GV	SAO PAULO/PINDA	R$ 490,00	490.00	2025-06-10 04:26:17.45535+00	2024-05-01
6dc2845c-1d06-4338-98ec-81dbf082e3e4	PISANI	EDUARDO	COLETA: CEPAGLI / 750+SEGURO: 450,00	VINHEDO	R$ 1.200,00	1200.00	2025-06-10 04:26:17.45535+00	2024-05-01
173a8a92-c7be-4161-a8e0-add81bf532a2	PISANI	EDUARDO	COLETA: ROCHAS ETIQUETAS	SÃO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
ab2d8e57-4c75-4414-ad32-e38355c4bd4b	COMINDRE	LUAN	ENTREGA NA GERDAL	PINDA	R$ 570,00	570.00	2025-06-10 04:26:17.45535+00	2024-05-01
8c672344-ba10-436b-b894-0808e3bb9c4e	ACTA	VILMEI	ROTA DE QUARTA FEIRA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
1a7bb7b7-eacd-4910-a35f-ad268f2c5ed3	CAMPO LIMPO	PATRICIA SANTOS	CARIMBOS AGUIAR	TAUBATE	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
58f9b165-6aa4-48b2-8db0-542fd8134006	RESINAS	RODRIGO	ENTREGA: ANSELMO / 625+SEGURO: 600,00	TAB DA SERRA	R$ 1.225,00	1225.00	2025-06-10 04:26:17.45535+00	2024-05-01
560c4fbd-66f6-4f0b-a55f-50fdb348b359	RESINAS	PATRICIA SANTOS	COLETA: WAM / 85+SEGURO:20,46	SJCAMPOS	R$ 105,46	105.46	2025-06-10 04:26:17.45535+00	2024-05-01
3072cd7c-86f9-422b-86c4-60c3425ab6ad	RECICLAGEM	RODRIGO	ENTREGA: ANSELMO / 625+SEGURO: 600,00	III	R$ 1.225,00	1225.00	2025-06-10 04:26:17.45535+00	2024-05-01
63520989-0ae8-467c-964c-717ef9c7d2ea	RECICLAGEM	RODRIGO	ENTREGA: PGT / 280+SEGURO: 10,00	CARAPICUIBA	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
d9b9afbc-d23c-4884-b9cc-35b1a59c2ba9	RECICLAGEM	RODRIGO	COLETA: FUSH / 625+SEGURO: 516,00	TAB DA SERRA	R$ 1.141,00	1141.00	2025-06-10 04:26:17.45535+00	2024-05-01
2a5cfa09-dcc5-4397-88a7-4a2804f652ce	RECICLAGEM	PATRICIA SANTOS	COLETA: CROMEX / 380+SEGURO: 42,27	MAUÁ	R$ 422,27	422.27	2025-06-10 04:26:17.45535+00	2024-05-01
6e864406-b2e9-4c7f-b30b-39f0a078e986	RECICLAGEM	PATRICIA SANTOS	COLETA: GLOBAL / 280+SEGURO: 10,20	OSASCO	R$ 290,20	290.20	2025-06-10 04:26:17.45535+00	2024-05-01
09df0abf-26a5-41de-9d33-2723b7974740	RECICLAGEM	PATRICIA SANTOS	COLETA: VIFER / 470+SEGURO: 2,75	OSASCO	R$ 472,75	472.75	2025-06-10 04:26:17.45535+00	2024-05-01
c6b8a30f-80e1-424d-8ec4-10029acc9c6c	RESINAS	HELENA	COLETA: SEIKI / 380+SEGURO:27,06	SÃO PAULO	R$ 407,06	407.06	2025-06-10 04:26:17.45535+00	2024-05-01
a31a315b-95ed-4350-af8b-468322d5008b	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
0570ce22-22ec-4917-8024-6afdda064df7	IFF	THAIS	ENTREGA: DIAGEO	SÃO PAULO	R$ 390,00	390.00	2025-06-10 04:26:17.45535+00	2024-05-01
d0070cd9-d3e9-4e8c-955b-4ddd9e662c6a	PINTAK	VITORIA	COLETA: DRIV BRASIL	COTIA/SP	R$ 280,00	280.00	2025-06-10 04:26:17.45535+00	2024-05-01
bb4c2709-1b42-4d59-ab9b-b1c0518909f3	HYDROSTEC	ALINI	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
972aa7c3-9ab7-4943-9c82-26ebe361cde1	HYDROSTEC	GUSTAVO	VELLOSO	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
de404749-62ca-4e8a-9192-4caacb6c3d2a	CBF	JAVIER	COLETA: CBF SP PARA GV	SAO PAULO	R$ 290,00	290.00	2025-06-10 04:26:17.45535+00	2024-05-01
f33c232d-07b9-4439-971b-dc05dec1512e	ACTA	VILMEI	ROTA DE QUINTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
9720ac57-7316-4832-aa91-714819c2bda7	RECICLAGEM	EVERTON	ENTREGA: POLLOSERV / 1.150+SEGURO: 5,00	SAO PAULO	R$ 1.155,00	1155.00	2025-06-10 04:26:17.45535+00	2024-05-01
2abe1b39-5812-4e15-9584-f54377392598	RECICLAGEM	PATRICIA SANTOS	COLETA: WORTEX / 370,00+SEGURO: 55,00	CAMPINAS	R$ 425,00	425.00	2025-06-10 04:26:17.45535+00	2024-05-01
79438420-a93b-4284-9d76-0cf3dde03fb4	RECICLAGEM	EVERTON	COLETA: POLLOSERV / 575,00+SEGURO: 175,00	SAO PAULO	R$ 750,00	750.00	2025-06-10 04:26:17.45535+00	2024-05-01
c7631c08-ec75-483d-80ba-1270fce539dc	RECICLAGEM	PATRICIA CARLA	COLETA: FRIGELAR / 3.280+SEGURO: 34,25	SANTA CATARINA	R$ 3.314,25	3314.25	2025-06-10 04:26:17.45535+00	2024-05-01
9a13869d-e0df-40bc-a913-8176d9b1f6c7	CAMPO LIMPO	ROBERTA	CARIMBO/ IDA E VOLTA	TAUBATE	R$ 40,00	40.00	2025-06-10 04:26:17.45535+00	2024-05-01
b7552ad8-87c9-4596-8c65-6a0221b18cc4	AUTOLIV	ADRIELY	CLINICA LIDA	TAUBATE	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
e9d823de-01a4-493a-95a8-fce1930c750b	IFF	JOAO VITOR	CORREIO	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
7e7e7589-ec05-4043-a6c3-54346025f24f	IFF	MICHELE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
4d46d7c4-a2a7-47f4-aac2-4ce58c2b95ec	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
c46b9ddc-c81c-4595-8071-d28d00d35e73	PINTAK	VITORIA	ENTREGA: TENECO	COTIA/SP	R$ 280,00	280.00	2025-06-10 04:26:17.45535+00	2024-05-01
0498f317-26e0-4317-9268-2247b904a41c	HYDROSTEC	FELIPE	COLETA: POTENZA	TAUBATÉ	R$ 60,00	60.00	2025-06-10 04:26:17.45535+00	2024-05-01
53d9b01f-7e45-4d34-b73d-fc38047a4ba0	HYDROSTEC	RAFAELA	FIXSAM	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
b34f058d-9268-4e49-834c-ae1c54de2e34	HYDROSTEC	SILVIO	COLETA: UNIVERSO	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
e1031ffc-f325-4491-b08a-6f855e1808f3	PISANI	INGRID	COLETA: PLASTEASY / 450+SEGURO: 58,00	SUZANO	R$ 508,00	508.00	2025-06-10 04:26:17.45535+00	2024-05-01
1bca082e-8682-4ed3-af3f-96cb5d664859	GV	ANA CLAUDIA	ENTREGA: INOVARTIS / 744+SEGURO: 420,00	ITATIBA	R$ 1.164,00	1164.00	2025-06-10 04:26:17.45535+00	2024-05-01
e707e363-de47-4da7-9b80-2df70867a843	GV	CIOMARA	ENTREGA: HYTORC	SAO BERNADO	\N	\N	2025-06-10 04:26:17.45535+00	2024-05-01
85ef102d-3497-477d-b9dc-e3025adb684c	GV	FABIANA	COLETA: IFFA	SÃO PAULO	R$ 700,00	700.00	2025-06-10 04:26:17.45535+00	2024-05-01
8bda5885-4ced-45a9-87a4-1e3a8aa56df7	ACTA	VILMEI	ROTA DE SEXTA	SJCAMPOS	R$ 295,00	295.00	2025-06-10 04:26:17.45535+00	2024-05-01
4ad783ea-b5fd-4c75-9cbc-1315b137891f	RECICLAGEM	PATRICIA CARLA	COLETA: KORETECH / 900+SEGURO: 247,92	BARUERI	R$ 1.147,92	1147.92	2025-06-10 04:26:17.45535+00	2024-05-01
bdcda843-6228-4b7c-9d67-4890811b4d59	TAMPAS	ISABELA	COLETA: ITAL / 280+SEGURO: 36,75	COTIA	R$ 316,75	316.75	2025-06-10 04:26:17.45535+00	2024-05-01
cd5a2959-8607-46a2-aa99-f149f6c11e01	RECICLAGEM	LUCAS	COLETA: PGT / +SEGURO:280	CARAPICIBA	R$ 280,00	280.00	2025-06-10 04:26:17.45535+00	2024-05-01
3f94b08b-31f6-40fa-9a8c-812565a12af2	RECICLAGEM	ISABELA	COLETA: ABECOM / 230+SEGURO:	SÃO PAULO	R$ 230,00	230.00	2025-06-10 04:26:17.45535+00	2024-05-01
54274929-acb6-49eb-ad25-4092f72a2b26	CAMPO LIMPO	PORTARIA	CORREIO	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
8b6951f1-82b3-45d8-9b40-28dd3bbae46d	CAMPO LIMPO	DOUGLAS	COREVAL	TAUBATÉ	R$ 20,00	20.00	2025-06-10 04:26:17.45535+00	2024-05-01
6c4a0437-281b-47a2-b05e-64b33c0e1ca2	HYDROSTEC	FELIPE	COLETA: LAB SYSTEM	GUARULHOS	R$ 420,00	420.00	2025-06-10 04:26:17.45535+00	2024-05-01
42d73e20-43d0-4303-9cee-58a1939305da	HYDROSTEC	FELIPE	COLETA: COREVAL	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
f4e6daaf-b48a-42e3-a41f-1b2f4d4fd5fa	HYDROSTEC	ALLAN	J A PLACAS	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
f0dd684c-236d-42d4-8e51-b10020b5f492	HYDROSTEC	RAFAELA	FIXSAM	TAUBATÉ	R$ 15,00	15.00	2025-06-10 04:26:17.45535+00	2024-05-01
cf33ba6e-1cd1-4097-a271-e345fff744fc	PISANI	INGRID	ENTREGA: 4 AUTOM / 490+SEGURO: 50,00	S B CAMPO	R$ 540,00	540.00	2025-06-10 04:26:17.45535+00	2024-05-01
f0acb5fd-46f5-41cb-b04e-1e8789c5abf3	IFF	THAIS	CORREIOS	TAUBATÉ	R$ 35,00	35.00	2025-06-10 04:26:17.45535+00	2024-05-01
84b7059a-8de6-474b-a1ea-10e3b3639dc6	IFF	MICHELE	CIESP	TAUBATÉ	R$ 48,00	48.00	2025-06-10 04:26:17.45535+00	2024-05-01
524a140e-a1f9-4379-bab6-cf9e1557c288	PELZER	RAFAEL	COLETA: SPECIAL GASES	GUARULHOS	R$ 450,00	450.00	2025-06-10 04:26:17.45535+00	2024-05-01
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, user_id, permission, granted_by, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-06-09 20:17:26
20211116045059	2025-06-09 20:17:31
20211116050929	2025-06-09 20:17:34
20211116051442	2025-06-09 20:17:37
20211116212300	2025-06-09 20:17:42
20211116213355	2025-06-09 20:17:45
20211116213934	2025-06-09 20:17:48
20211116214523	2025-06-09 20:17:53
20211122062447	2025-06-09 20:17:56
20211124070109	2025-06-09 20:17:59
20211202204204	2025-06-09 20:18:02
20211202204605	2025-06-09 20:18:06
20211210212804	2025-06-09 20:18:16
20211228014915	2025-06-09 20:18:20
20220107221237	2025-06-09 20:18:23
20220228202821	2025-06-09 20:18:26
20220312004840	2025-06-09 20:18:30
20220603231003	2025-06-09 20:18:35
20220603232444	2025-06-09 20:18:38
20220615214548	2025-06-09 20:18:43
20220712093339	2025-06-09 20:18:46
20220908172859	2025-06-09 20:18:49
20220916233421	2025-06-09 20:18:52
20230119133233	2025-06-09 20:18:56
20230128025114	2025-06-09 20:19:00
20230128025212	2025-06-09 20:19:04
20230227211149	2025-06-09 20:19:07
20230228184745	2025-06-09 20:19:10
20230308225145	2025-06-09 20:19:14
20230328144023	2025-06-09 20:19:17
20231018144023	2025-06-09 20:19:21
20231204144023	2025-06-09 20:19:26
20231204144024	2025-06-09 20:19:30
20231204144025	2025-06-09 20:19:33
20240108234812	2025-06-09 20:19:36
20240109165339	2025-06-09 20:19:39
20240227174441	2025-06-09 20:19:46
20240311171622	2025-06-09 20:19:50
20240321100241	2025-06-09 20:19:57
20240401105812	2025-06-09 20:20:07
20240418121054	2025-06-09 20:20:11
20240523004032	2025-06-09 20:20:23
20240618124746	2025-06-09 20:20:26
20240801235015	2025-06-09 20:20:30
20240805133720	2025-06-09 20:20:33
20240827160934	2025-06-09 20:20:36
20240919163303	2025-06-09 20:20:41
20240919163305	2025-06-09 20:20:44
20241019105805	2025-06-09 20:20:47
20241030150047	2025-06-09 20:21:00
20241108114728	2025-06-09 20:21:04
20241121104152	2025-06-09 20:21:08
20241130184212	2025-06-09 20:21:12
20241220035512	2025-06-09 20:21:15
20241220123912	2025-06-09 20:21:18
20241224161212	2025-06-09 20:21:21
20250107150512	2025-06-09 20:21:25
20250110162412	2025-06-09 20:21:28
20250123174212	2025-06-09 20:21:31
20250128220012	2025-06-09 20:21:35
20250506224012	2025-06-09 20:21:38
20250523164012	2025-06-09 20:21:41
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-06-09 20:17:22.540193
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-06-09 20:17:22.547967
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-06-09 20:17:22.557134
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-06-09 20:17:22.578485
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-06-09 20:17:22.59532
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-06-09 20:17:22.602034
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-06-09 20:17:22.612494
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-06-09 20:17:22.620492
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-06-09 20:17:22.627947
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-06-09 20:17:22.643105
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-06-09 20:17:22.655458
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-06-09 20:17:22.662766
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-06-09 20:17:22.673931
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-06-09 20:17:22.691811
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-06-09 20:17:22.699177
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-06-09 20:17:22.71954
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-06-09 20:17:22.72604
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-06-09 20:17:22.733341
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-06-09 20:17:22.744073
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-06-09 20:17:22.75282
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-06-09 20:17:22.759305
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-06-09 20:17:22.769126
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-06-09 20:17:22.784992
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-06-09 20:17:22.79972
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-06-09 20:17:22.806591
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-06-09 20:17:22.813695
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name, created_by, idempotency_key) FROM stdin;
20250609102001	{"\n-- Criar tabela de perfis de usuário\nCREATE TABLE public.profiles (\n  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  role TEXT NOT NULL DEFAULT 'user',\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),\n  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Habilitar RLS (Row Level Security)\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\n-- Política para permitir que usuários vejam seus próprios perfis\nCREATE POLICY \\"Users can view their own profile\\"\n  ON public.profiles\n  FOR SELECT\n  USING (auth.uid() = id);\n\n-- Política para permitir que usuários atualizem seus próprios perfis\nCREATE POLICY \\"Users can update their own profile\\"\n  ON public.profiles\n  FOR UPDATE\n  USING (auth.uid() = id);\n\n-- Política para permitir que administradores vejam todos os perfis\nCREATE POLICY \\"Admins can view all profiles\\"\n  ON public.profiles\n  FOR SELECT\n  TO authenticated\n  USING (\n    EXISTS (\n      SELECT 1 FROM public.profiles\n      WHERE id = auth.uid() AND role = 'admin'\n    )\n  );\n\n-- Função para criar perfil automaticamente quando um usuário se registra\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.profiles (id, username, role)\n  VALUES (\n    NEW.id,\n    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),\n    COALESCE(NEW.raw_user_meta_data->>'role', 'user')\n  );\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER;\n\n-- Trigger para executar a função quando um usuário é criado\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();\n"}	1d0bce64-efa5-4a14-b15e-a42b36659a52	victorcamisa.mkt@gmail.com	\N
20250609103217	{"\n-- Remover políticas existentes se houver\nDROP POLICY IF EXISTS \\"Users can view their own profile\\" ON public.profiles;\nDROP POLICY IF EXISTS \\"Users can update their own profile\\" ON public.profiles;\nDROP POLICY IF EXISTS \\"Users can insert their own profile\\" ON public.profiles;\n\n-- Habilitar RLS na tabela profiles\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\n-- Criar política para permitir que usuários vejam apenas seu próprio perfil\nCREATE POLICY \\"Users can view their own profile\\" ON public.profiles\n    FOR SELECT USING (auth.uid() = id);\n\n-- Criar política para permitir que usuários atualizem apenas seu próprio perfil\nCREATE POLICY \\"Users can update their own profile\\" ON public.profiles\n    FOR UPDATE USING (auth.uid() = id);\n\n-- Criar política para permitir inserção de novos perfis (para o trigger)\nCREATE POLICY \\"Enable insert for service role\\" ON public.profiles\n    FOR INSERT WITH CHECK (true);\n"}	a417d853-1626-4937-a2ce-bd4837e77b68	victorcamisa.mkt@gmail.com	\N
20250610042617	{"\n-- Criar tabela para armazenar os serviços de maio\nCREATE TABLE public.servicos_maio (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  empresa TEXT NOT NULL,\n  solicitante TEXT,\n  servico TEXT,\n  cidade TEXT,\n  valor_texto TEXT, -- Para manter o formato original \\"R$ 1.000,00\\"\n  valor_numerico DECIMAL(10,2), -- Para cálculos\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Inserir todos os dados da planilha\nINSERT INTO public.servicos_maio (empresa, solicitante, servico, cidade, valor_texto, valor_numerico) VALUES\n('AUTOLIV', 'GRAZIELE', 'COLETA: CGR', 'DIADEMA', 'R$ 425,00', 425.00),\n('HYDROSTEC', 'GUSTAVO', 'COLETA: SHERWIN WILLIANS', 'OSASCO', NULL, NULL),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: ANSELMO/ 416,66+SEGURO: 110,00', 'TAB DA SERRA', 'R$ 526,66', 526.66),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: FUSH / 416,66+SEGURO: 2.460,00', 'TAB DA SERRA', 'R$ 2.876,66', 2876.66),\n('RESINAS', 'PATRICIA SANTOS', 'COLETA: FUSH / 416,66+SEGURO: 500,00', 'TAB DA SERRA', 'R$ 916,66', 916.66),\n('TAMPAS', 'KELVIN', 'COLETA: FUSH / 280+SEGURO: 11,85', 'TAB DA SERRA', 'R$ 291,85', 291.85),\n('HYDROSTEC', 'GUSTAVO', 'COLETA FRAC: SHERWIN WILLIANS', 'OSASCO', 'R$ 295,00', 295.00),\n('HYDROSTEC', 'GUSTAVO', 'COLETA FRAC: NEOCONEX/165,69+SEGURO:99,31', 'SÃO CAETANO', 'R$ 265,00', 265.00),\n('HYDROSTEC', 'FELIPE', 'IND DO VALE - IDA E VOLTA', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'FELIPE', 'ARBO', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'COPYART', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'ALINI', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('IFF', 'JOÃO PEDRO', 'CORREIO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 141,94', 'VARZEA PSTA', 'R$ 1.791,94', 1791.94),\n('AUTOLIV', 'CASSIA LEMES', 'ENTREGA: GM', 'SÃO CAETANO', 'R$ 250,00', 250.00),\n('GV', 'ANA DIAS', 'COLETA: TRANSOK(KLUBER)1450+SEGURO:155,13', 'BARUERI', 'R$ 1.605,13', 1605.13),\n('GV', 'CIOMARA', 'ENTREGA: HYTORK / 500+SEGURO: 145,60', 'S B CAMPO', 'R$ 645,60', 645.60),\n('PINTAK', 'PRISCILLA', 'COREVAL', 'TAUBATÉ', 'R$ 25,00', 25.00),\n('INPRO', 'ROBERTA', 'CARTÓRIO', 'TAUBATÉ', NULL, NULL),\n('MUBEA', 'REGINA', 'CORREIO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('RESINAS', 'HELENA', 'COLETA: BUNZL / 380+SEGURO: 5,00', 'GUARULHOS', 'R$ 385,00', 385.00),\n('HYDROSTEC', 'SILVIO', 'IND DO VALE - IDA E VOLTA', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'SILVIO', 'RELE ROLAMENTOS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'COPYART', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('MUBEA/FIXO', 'JOAO', 'CARTÓRIO', 'TAUBATÉ', 'R$ 180,00', 180.00),\n('MUBEA', 'REGINA', 'CORREIO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('MUBEA', 'RENAN CAMARA', 'COLETA: BERTEL', 'CAIEIRAS', 'R$ 350,00', 350.00),\n('IFF', 'THAIS MERY', 'ENTREGA: AMBEV', 'RIO DE JANEIRO', 'R$ 750,00', 750.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('IFF', 'FELIPE', 'CHAVEIRO CHAGAS', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'THAIS MERY', 'CORREIO', 'TAUBATÉ', 'R$ 80,00', 80.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 227,51', 'VARZEA PSTA', 'R$ 1.877,51', 1877.51),\n('AUTOLIV', NULL, 'COLETA: MAC SISCON', 'SÃO PAULO', 'R$ 230,00', 230.00),\n('GV', 'PLINIO', 'COLETA: RADIAL - GV-099229', 'SÃO PAULO', 'R$ 290,00', 290.00),\n('GV', 'ANA DIAS', 'ENTREGA: TECHWAY', 'S J CAMPOS', 'R$ 265,00', 265.00),\n('LUGAB', 'JUNIOR', 'ENTREGA: GV / 350+SEGURO: 72,50', 'SP / PINDA', 'R$ 422,50', 422.50),\n('ACTA', 'VILMEI', 'ROTAS DE QUARTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('CAMPO LIMPO', 'PATRICIA SANTOS', 'FEIRA DA BORRACHA', 'SJCAMPOS', 'R$ 85,00', 85.00),\n('RECICLAGEM', 'RODRIGO', 'ENTREGA: FUSH / 1250+SEGURO: 4.200', 'TAB DA SERRA', 'R$ 5.450,00', 5450.00),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: UART / 230+SEGURO: 45,00', 'SÃO PAULO', 'R$ 275,00', 275.00),\n('MUBEA', 'RENAN CAMARA', 'COLETA: JAFER', 'BRAG. PAULISTA', 'R$ 350,00', 350.00),\n('MUBEA', 'REGIS DIAS', 'MEC-Q - LEVAR', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('MUBEA', 'REGINA', 'CORREIO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'THAIS MERY', 'ENTREGA: AMBEV', 'RIO DE JANEIRO', 'R$ 750,00', 750.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 251,35', 'VARZEA PSTA', 'R$ 1.901,35', 1901.35),\n('AUTOLIV', 'REGIS MARQUES', 'COLETA: ATLAS COPCO / 1150+SEGURO: 375,00', 'BARUERI', 'R$ 1.525,00', 1525.00),\n('AUTOLIV', 'DOUGLAS CASTRO', 'COLETA: DINATESTE', 'SÃO PAULO', 'R$ 230,00', 230.00),\n('PISANI', 'EDUARDO', 'COLETA: 3M / 790+SEGURO: 292,74', 'SUMARÉ', 'R$ 1.082,74', 1082.74),\n('PISANI', 'EDUARDO', 'ENTREGA: FEROMAX', 'SÃO PAULO', 'R$ 270,00', 270.00),\n('GV', 'PLINIO', 'COLETA: COPEC', 'OSASCO', 'R$ 490,00', 490.00),\n('PLASCAR', 'MARCELO', 'COLETA: ELETRO MECANICA', 'SJCAMPOS', 'R$ 95,00', 95.00),\n('ACTA', 'VILMEI', 'ROTAS DE QUINTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('CAMPO LIMPO', 'PORTARIA', 'CORREIO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('CAMPO LIMPO', 'BRUNA', 'LOGO TIPOS', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('CAMPO LIMPO', 'KAUE', 'CHAVEIRO - IDA E VOLTA', 'TAUBATÉ', 'R$ 40,00', 40.00),\n('RIB PRETO', 'HELENA', 'COLETA FRAC: COM. FERR / 470+SEGURO: 3,06', 'RIB PRETO', 'R$ 473,06', 473.06),\n('RECICLAGEM', 'RONAN', 'ENTREGA: CONCEPTA / 980+SEGURO: 1,97', 'SÃO PAULO', 'R$ 981,97', 981.97),\n('RECICLAGEM', 'HELENA', 'COLETA: SAFETLINE / 335+SEGURO: 58,29', 'HORTOLANDIA', 'R$ 393,29', 393.29),\n('RESINAS', 'HELENA', 'COLETA: SAFETLINE / 335+SEGURO: 17,49', 'HORTOLANDIA', 'R$ 352,49', 352.49),\n('IFF', 'FELIPE', 'REP ACESSO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'THAIS MERY', 'CORREIO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('HYDROSTEC', 'GUSTAVO', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('CIESP', 'CLOVIS', 'DOCUMENTO PINDA E ROSEIRA', 'PINDA/ROSEIRA', 'R$ 140,00', 140.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 222,17', 'VARZEA PSTA', 'R$ 1.872,17', 1872.17),\n('AUTOLIV', 'GRAZIELE', 'COLETA: CGR / 465,17+SEGURO: 61,08', 'DIADEMA', 'R$ 526,25', 526.25),\n('AUTOLIV', 'DIMAS', 'ENTREGA: NEWTECH / 890+PEDÁGIO: 162,00', 'SÃO CARLOS', 'R$ 1.052,00', 1052.00),\n('AUTOLIV', 'KELVYN', 'MULTCARD', 'SJCAMPOS', 'R$ 95,00', 95.00),\n('AUTOLIV', 'GIOVANNA', 'CLINICA LIDA', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('PISANI', 'EDUARDO', 'ENTREGA: NEW AMP / 565+SEGURO: 100,00', 'BARUERI', 'R$ 665,00', 665.00),\n('PISANI', 'EDUARDO', 'ENTREGA: TEXFINISH / 315+SEGURO: 150,00', 'DIADEMA', 'R$ 465,00', 465.00),\n('PISANI', 'EDUARDO', 'RETORNO: TEXFINISH / 235+SEGURO: 150,00', 'DIADEMA', 'R$ 385,00', 385.00),\n('PISANI', 'EDUARDO', 'COLETA: ELRING / 2105+SEGURO: 198,56', 'PIRACICABA', 'R$ 2.303,56', 2303.56),\n('PISANI', 'INGRID', 'CORREIO', 'PINDA', 'R$ 85,00', 85.00),\n('MUBEA', 'JULIO SANTOS', 'COLETA: NUCLEO ELETRONICA', 'SJCAMPOS', 'R$ 95,00', 95.00),\n('PLASCAR', 'TAIS', 'ENTREGA: MAST LAB - NOTA FISCAL', 'SANTO ANDRÉ', 'R$ 265,00', 265.00),\n('PLASCAR', 'DANILO', 'ENTREGA: PLAMAN', 'SJCAMPOS', 'R$ 160,00', 160.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('ACTA', 'VILMEI', 'ROTAS DE SEXTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('CAMPO LIMPO', 'ANDRÉ', 'COMINDRE', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('RIB PRETO', 'HELENE', 'COLETA FRAC: SAFETLINE / 470+SEGURO: 1,63', 'RIB PRETO', 'R$ 471,63', 471.63),\n('RECICLAGEM', 'PATRCIA SANTOS', 'COLETA: HENFEL / 1595+SEGURO: 74,94', 'JABOTICABAL', 'R$ 1.669,94', 1669.94),\n('INPEV', 'BRUNA', 'COLETA: KIMARK / 380+SEGURO: 12,80', 'SÃO PAULO', 'R$ 392,80', 392.80),\n('HYDROSTEC', 'GUSTAVO', 'COLETA FRAC: MARCOFLAN', 'SÃO PAULO', 'R$ 210,00', 210.00),\n('HYDROSTEC', 'FELIPE', 'UNIVERSO', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'FELIPE', 'ARBO / ARBO', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('MUBEA/FIXO', 'JOÃO', 'CARTÓRIO / CORREIO', 'TAUBATÉ', 'R$ 180,00', 180.00),\n('MUBEA/FIXO', 'SAFIRA', 'PAGAMENTO DE GUIA', 'TAUBATÉ', NULL, NULL),\n('CIESP', 'CLOVIS', 'ENTTREGA DE CARRO SP FIESP', 'SAO PAULO', 'R$ 425,00', 425.00),\n('IFF', 'THAIS MERY', 'ENTREGA: FRONERI', 'RIO DE JANEIRO', 'R$ 750,00', 750.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 203,48', 'VARZEA PSTA', 'R$ 1.853,48', 1853.48),\n('AUTOLIV', 'GRAZIELE ASSIS', 'COLETA: DC LABEL', 'SÃO PAULO', 'R$ 380,00', 380.00),\n('PLASCAR', 'MARCELO', 'COLETA: TAUFER', 'TAUBATÉ', 'R$ 85,00', 85.00),\n('PLASCAR', 'DANILO', 'ENTREGA: FLUID DIVISION / 750+SEGURO: 120,07', 'AMPARO', 'R$ 870,07', 870.07),\n('PLASCAR', 'LUIS ANTONIO', 'COLETA: INTRACT', 'SÃO PAULO', 'R$ 250,00', 250.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('PISANI', 'EDUARDO', 'COLETA: ENGEL', 'COTIA', 'R$ 350,00', 350.00),\n('PISANI', 'EDUARDO', 'CORREIO', 'PINDA', 'R$ 55,00', 55.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1650+SEGURO: 47,13', 'VARZEA PSTA', 'R$ 1.697,13', 1697.13),\n('IFF', 'LUIZ FERNANDO', 'ENTREGA: FOOD INTELIGENCE', 'SÃO PAULO', 'R$ 350,00', 350.00),\n('CAMPO LIMPO', 'RONAN', 'CORREIO', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('INPEV', 'BRUNA', 'COLETA: MECALOR / 1150+SEGURO: 1.476', 'SÃO PAULO', 'R$ 2.626,00', 2626.00),\n('TAMPAS', 'HENRIQUE', 'COLETA: FRANTEC / 1290+SEGURO: 13,15', 'FRANCA', 'R$ 1.313,15', 1313.15),\n('RECICLAGEM', 'RODRIGO', 'ENTREGA: FUSH / 1250+SEGURO: 1650', 'TAB DA SERRA', 'R$ 2.900,00', 2900.00),\n('RECICLAGEM', 'RODRIGO', 'ENTREGA: TBM / 1150+SEGURO: 1.200', 'SÃO PAULO', 'R$ 2.350,00', 2350.00),\n('RECICLAGEM', 'HELENA', 'COLETA: BUNZL / 380+SEGURO: 36,24', 'GUARULHOS', 'R$ 416,24', 416.24),\n('RESINAS', 'RODRIGO', 'ENTREGA: TRUCK / 995+SEGURO: 100,00', 'SÃO PAULO', 'R$ 1.095,00', 1095.00),\n('HYDROSTEC', 'RAFAELA', 'POTENZA', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'RAFAELA', 'UNIVERSO', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'SILVIO', 'RELE ROLAMENTOS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'GUSTAVO', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 155,05', 'VARZEA PSTA', 'R$ 1.805,05', 1805.05),\n('MUBEA', 'REGIS DIAS', 'ENTREGA: DIGICRON', 'SÃO PAULO', 'R$ 250,00', 250.00),\n('MUBEA', 'REGINA', 'REY DAS CHAVES', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('IFF', 'THAIS MERY', 'ENTREGA: AMBEV', 'RIO DE JANEIRO', 'R$ 1.490,00', 1490.00),\n('PLASCAR', 'MARCO ANTONIO', 'COLETA: NIKKEYPAR', 'S J CAMPOS', 'R$ 95,00', 95.00),\n('PLASCAR', 'MARCELO', 'COLETA: FIXSAN', 'TAUBATÉ', 'R$ 85,00', 85.00),\n('PLASCAR', 'MARCELO', 'COLETA: TAUFER', 'TAUBATÉ', 'R$ 85,00', 85.00),\n('GV', 'DEBORA', 'COLETA: MEGARON / GV - 099544', 'SÃO PAULO', 'R$ 290,00', 290.00),\n('GV', 'PLINIO', 'COLETA: RADIAL - GV', 'SÃO PAULO', 'R$ 290,00', 290.00),\n('LUGAB', 'JUNIOR', 'ENTREGA: GV / 490+SEGURO: 126,00', 'SP / PINDA', 'R$ 616,00', 616.00),\n('PISANI', 'EDUARDO', 'COLETA: J MENDES', 'TAUBATÉ', 'R$ 65,00', 65.00),\n('PISANI', 'EDUARDO', 'USINAGEM NOVO HORIZONTE', 'PINDA', 'R$ 85,00', 85.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('CAMPO LIMPO', 'PATRICIA SANTOS', 'CHAVEIRO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('CAMPO LIMPO', 'RONAN', 'CORREIO', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('RECICLAGEM', 'THAIS', 'ENTREGA: POLLOSERV / 1150+SEGURO: 62,50', 'SÃO PAULO', 'R$ 1.212,50', 1212.50),\n('TAMPAS', 'ISABELA', 'COLETA FRAC: WORTEX / 245+SEGURO: 74,00', 'BARUERI', 'R$ 319,00', 319.00),\n('MUBEA', 'JULIO SANTOS', 'COLETA: NEW AMP / SEM NOTA FISCAL', 'BARUERI', 'R$ 280,00', 280.00),\n('MUBEA', 'MARCOS MOREIRA', 'TECMAZA', 'PINDA', 'R$ 65,00', 65.00),\n('MUBEA', 'MAURO', 'DEPÓSITO CARDOSO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('HYDROSTEC', 'FELIPE', 'ENTREGA: LAB SYSTEM', 'GUARULHOS', 'R$ 420,00', 420.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN / VELLOSO', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'SILVIO', 'RELE ROLAMENTOS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'ALINI', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 246,62', 'VARZEA PSTA', 'R$ 1.896,62', 1896.62),\n('AUTOLIV', 'KELVYN', 'MULTCARD', 'SJCAMPOS', 'R$ 95,00', 95.00),\n('GV', 'BRUNO', 'COLETA: CALFEN / 2650+SEGURO: 175,00', 'ITUPEVA', 'R$ 2.825,00', 2825.00),\n('GV', 'ANA DIAS', 'COLETA: LUITEX / PEDIDO GV-099635', 'MOGI GUAÇU', 'R$ 1.034,00', 1034.00),\n('CIESP', 'CLOVIS', 'COLETA:', 'GUARÁ', 'R$ 130,00', 130.00),\n('CIESP', 'CLOVIS', 'COLETA:', 'PINDA', 'R$ 75,00', 75.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('PISANI', 'EDUARDO', 'COLETA: SANTA CRUZ', 'SÃO PAULO', 'R$ 980,00', 980.00),\n('PLASCAR', 'MARCELO', 'ENTREGA: ION TECH / 410+SEGURO: 59,93', 'SÃO PAULO', 'R$ 469,93', 469.93),\n('PLASCAR', 'MARCO', 'COLETA: POTENZA', 'TAUBATÉ', 'R$ 85,00', 85.00),\n('ACTA', 'VILMEI', 'ROTAS DE QUARTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('RECICLAGEM', 'EVERTON', 'ENTREGA: MATEC / 675+SEGURO: 185,00', 'TREMEMBÉ', 'R$ 860,00', 860.00),\n('RECICLAGEM', 'DANIEL', 'COLETA: APS / 140+SEGURO: 32,50', 'SJCAMPOS', 'R$ 172,50', 172.50),\n('RECICLAGEM', 'HELENA', 'COLETA: PREVISÃO / 230+SEGURO:', 'SÃO PAULO', NULL, NULL),\n('RESINAS', 'RODRIGO', 'ENTREGA: AMPARO / 1490+SEGURO: 295,00', 'AMPARO', 'R$ 1.785,00', 1785.00),\n('RESINAS', 'RODRIGO', 'COLETA: AMPARO / 745+SEGURO: 150,00', 'AMPARO', 'R$ 895,00', 895.00),\n('RIB PRETO', 'HELENA', 'COLETA: MULTPACK / 1.090+SEGURO:24,80', 'OSASCO', 'R$ 1.114,80', 1114.80),\n('IFF', 'THAIS MERY', 'ENTREGA: AMBEV', 'RIO DE JANEIRO', 'R$ 750,00', 750.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('HYDROSTEC', 'RAFAELA', 'POTENZA', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'ALINI', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'COPYART', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('CIESP', 'CLOVIS', 'COLETA:', 'PINDA', 'R$ 75,00', 75.00),\n('MUBEA/FIXO', 'JULIANA', 'SAQUE BANCO ITAÚ / B BRASIL PAG DE MULTA', 'TAUBATÉ', 'R$ 180,00', 180.00),\n('JULIANA', 'PARTICULAR', 'ENTREGA DE APARELHO', 'CARAGUÁ', 'R$ 485,00', 485.00),\n('PINTAK', 'PRISCILLA', 'ENTREGA: DRIVE BRASIL/Pedido N° 12190', 'COTIA', 'R$ 595,00', 595.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 203,15', 'VARZEA PSTA', 'R$ 1.853,15', 1853.15),\n('AUTOLIV', 'ADRIELY', 'CLINICA LIDA', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('LUGAB', 'JUNIOR', 'COLETA: GV / 1300+SEGURO: 250,00', 'PINDA/SP', 'R$ 1.550,00', 1550.00),\n('PISANI', 'EDUARDO', 'ENTREGA: PKW / 994+SEGURO: 50,00', 'INDAIATUBA', 'R$ 1.044,00', 1044.00),\n('PISANI', 'INGRID', 'COLETA: VF COMERCIO', 'SÃO PAULO', 'R$ 470,00', 470.00),\n('PISANI', 'EDUARDO', 'COLETA: POLIMOLD', 'S B CAMPO', 'R$ 290,00', 290.00),\n('PLASCAR', 'DANILO', 'COLETA FRAC: IZOLTEC / 170+SEGURO: 65,94', 'SANTO ANDRÉ', 'R$ 235,94', 235.94),\n('PLASCAR', 'DEBORA', 'COLETA: BRASIL MAGNETS', 'SÃO PAULO', 'R$ 410,00', 410.00),\n('ACTA', 'VILMEI', 'ROTAS DE QUINTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('CAMPO LIMPO', 'BRUNO', 'CARTÓRIO / RETORNO', 'TAUBATÉ', 'R$ 40,00', 40.00),\n('RIB PRETO', 'HELENA', 'COLETA: MULTPACK / 1090+SEGURO: 24,80', 'OSASCO/RP', 'R$ 1.114,80', 1114.80),\n('RESINAS', 'PATRICIA SANTOS', 'COLETA: PLAST FACA / 380+SEGURO: 77,00', 'SÃO PAULO', 'R$ 457,00', 457.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN / CENTER TUDO', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'RAFAELA', 'POTENZA', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('IFF', 'THAIS MERY', 'ENTREGA: PEPSICO', 'SOROCABA', 'R$ 650,00', 650.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 226,68', 'VARZEA PSTA', 'R$ 1.876,68', 1876.68),\n('AUTOLIV', 'GRAZIELE', 'COLETA: CGR / 465,17+SEGURO: 68,72', 'DIADEMA', 'R$ 533,89', 533.89),\n('AUTOLIV', 'CELSO/VIVIANE', 'ENTREGA: BALDI / 1650+SEGURO: 43,00 + 190,00 ADICIONAL', 'VARZEA PSTA', 'R$ 1.883,00', 1883.00),\n('CBF', 'JAVIER', 'ENTREGA FRAC: GV', 'SP/PINDA', 'R$ 290,00', 290.00),\n('GV', 'ANA DIAS', 'COLETA: MILANI / 3.425+SEGURO: 225,00', 'CORDEIROPOLIS', 'R$ 3.650,00', 3650.00),\n('GV', 'ANA DIAS', 'COLETA: ABECOM / 490+SSEGURO: 198,00', 'SÃO PAULO', 'R$ 688,00', 688.00),\n('PLASCAR', 'DANILO', 'COLETA: DURR / 410+SEGURO:', 'SÃO PAULO', 'R$ 729,15', 729.15),\n('PELZER', 'ANDERSON', 'COLETA: TECHNUS', 'GUARULHOS', 'R$ 265,00', 265.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('PISANI', 'EDUARDO', 'COLETA: NEW AMP / 595+SEGURO: 100,00', 'BARUERI', 'R$ 695,00', 695.00),\n('ACTA', 'VILMEI', 'ROTAS DE SEXTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('RECICLAGEM', 'RONAN', 'ENTREGA: PGT / 280+150+SEGURO: 3,43', 'CARAPICUIBA', 'R$ 443,43', 443.43),\n('RECICLAGEM', 'RONAN', 'COLETA: BASF / 250+SEGURO: 1,01', 'GUARÁ', 'R$ 251,01', 251.01),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: GSET / 380+SEGURO: 18,90', 'SÃO PAULO', 'R$ 398,90', 398.90),\n('RECICLAGEM', 'EVERTON', 'COLETA: JORGE FERRARI / 250+SEGURO: 25,00', 'SANTO ANDRÉ', 'R$ 275,00', 275.00),\n('RESINAS', 'ANDRÉ', 'COLETA: WORTEX MAQ. / 745+SEGURO: 68,35', 'CAMPINAS', 'R$ 813,35', 813.35),\n('RESINAS', 'ANDRÉ', 'COLETA: WORTEX ROSC. / 745+SEGURO: 1.000', 'CAMPINAS', 'R$ 1.745,00', 1745.00),\n('TAMPAS', 'PAULA', 'ENTREGA: SANPAR / 1560+SEGURO: 42,48', 'SANT PARNAIBA', 'R$ 1.602,48', 1602.48),\n('HYDROSTEC', 'AMANDA', 'CORREIO', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'FELIPE', 'LOJA DO MARIO/ARBO/COREVAL', 'TAUBATÉ', 'R$ 45,00', 45.00),\n('HYDROSTEC', 'FELIPE', 'CHAVEIRO - IDA E VOLTA', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN/CENTER TUDO/COPYART', 'TAUBATÉ', 'R$ 45,00', 45.00),\n('HYDROSTEC', 'FELIPE', 'ARBO', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('IFF', 'THAIS MERY', 'ENTREGA: BRF', 'SÃO PAULO', 'R$ 350,00', 350.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('PINTAK', 'PRISCILLA', 'VALE SAFE', 'TAUBATÉ', 'R$ 25,00', 25.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 208,85', 'VARZEA PSTA', 'R$ 1.858,85', 1858.85),\n('AUTOLIV', 'GRAZIELE ASSIS', 'ENTREGA: BALDI', 'VARZEA PSTA', 'R$ 1.650,00', 1650.00),\n('AUTOLIV', 'ELIAS', 'ENTREGA: RENAULT', 'S J DOS PINHAIS', 'R$ 2.195,00', 2195.00),\n('GV', 'ANA DIAS', 'ENTREGA: MULT MOT / 625+SEGURO:', 'SANT PARNAÍBA', 'R$ 1.025,00', 1025.00),\n('GV', 'PLÍNIO', 'COLETA: RADIAL', 'SÃO PAULO', 'R$ 290,00', 290.00),\n('PLASCAR', 'DANILO', 'ENTREGA: DURR / 410+SEGURO: 160,00', 'SÃO PAULO', 'R$ 570,00', 570.00),\n('PISANI', 'EDUARDO', 'COLETA: PKW / 994+SEGURO: 50,00', 'INDAIATUBA', 'R$ 1.044,00', 1044.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('AUTOLIV', 'GRAZIELE ASSIS', 'COLETA: BALDI', 'VARZEA PSTA', 'R$ 1.650,00', 1650.00),\n('AUTOLIV', 'GRAZIELE ASSIS', 'COLETA: BALDI / 1650+SEGURO: 60,56', 'VARZEA PSTA', 'R$ 1.710,56', 1710.56),\n('CAMPO LIMPO', 'RH', 'COLETA: TENDA', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('RECICLAGEM', 'RONAN', 'COLETA: PGT / 280+SEGURO: 3,43', 'CARAPICUIBA', 'R$ 283,43', 283.43),\n('IFF', 'THAIS MERY', 'ENTREGA: PEPSICO', 'SOROCABA', 'R$ 650,00', 650.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('CIESP', 'CLOVIS', 'COLETA DE DOCUMENTO - ERICSON', 'S J CAMPOS', 'R$ 140,00', 140.00),\n('HYDROSTEC', 'GUSTAVO', 'TINTAS TAUBATÉ', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO:', 'VARZEA PSTA', 'R$ 1.650,00', 1650.00),\n('AUTOLIV', 'VIVIANE', 'COLETA: SPEED FUSION', 'S J CAMPOS', 'R$ 450,00', 450.00),\n('AUTOLIV', 'VIVIANE', 'COLETA: SPEED FUSION / 450+seguro: 113,03', 'S J CAMPOS', 'R$ 563,03', 563.03),\n('GV', 'ANA DIAS', 'ENTREGA: INOVART / 744+SEGURO: 87,75', 'ITATIBA', 'R$ 831,75', 831.75),\n('PLASCAR', 'MARCELO', 'COLETA FRAC: FILIVALE', 'SJCAMPOS', 'R$ 65,00', 65.00),\n('RECICLAGEM', 'HELENA', 'COLETA: VEDABRAS / 230+SEGURO: 7,22', 'SÃO PAULO', 'R$ 237,22', 237.22),\n('RECICLAGEM', 'ANDRÉ', 'ENTREGA: FUSH / 1250+SEGURO: 2.400', 'TAB DA SERRA', 'R$ 3.650,00', 3650.00),\n('RECICLAGEM', 'ANDRÉ', 'COLETA: FUSH / 625+SEGURO: 2.400', 'TAB DA SERRA', 'R$ 3.025,00', 3025.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('HYDROSTEC', 'CARMEN', '2 CARTÓRIOS / ESPERA / RETORNO', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'RAFAELA', 'COPYART', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'GUSTAVO', 'TINTAS GONÇALVES - IDA E VOLTA', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('MUBEA', 'ALAN CASTILHO', 'COLETA: JAFER', 'BRAG. PAULISTA', 'R$ 350,00', 350.00),\n('AUTOLIV', 'ELIAS', 'ENTREGA: VOLKS / 465+PEDÁGIOS', 'S B CAMPO', 'R$ 465,00', 465.00),\n('AUTOLIV', 'RODRIGO RAMOS', 'COLETA: MCI', 'TAB DA SERRA', 'R$ 280,00', 280.00),\n('AUTOLIV', 'CELSO/VIVIANE', 'ENTREGA: BALDI / 660+SEGURO: 53,83', 'VARZEA PSTA', 'R$ 713,83', 713.83),\n('AUTOLIV', 'CELSO/VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 216,05', 'VARZEA PSTA', 'R$ 1.866,05', 1866.05),\n('AUTOLIV', 'RYAN', 'ENTREGA: TOX / 2550+SEGURO: 105,00', 'JOINVILLE', 'R$ 2.655,00', 2655.00),\n('PINTAK', 'VITÓRIA', 'COLETA: FEIRA DA BORRACHA (MCM)', 'S J CAMPOS', 'R$ 95,00', 95.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('LUGAB', 'JUNIOR', 'ENTREGA: GV', 'PINDA/SP', 'R$ 290,00', 290.00),\n('PISANI', 'EDUARDO', 'USINAGEM NOVO HORIZONTE', 'PINDA', 'R$ 85,00', 85.00),\n('GV', 'ANA DIAS', 'COLETA: KLUBER / 1450+SEGURO: 194,20', 'COTIA', 'R$ 1.644,20', 1644.20),\n('GV', 'ANA DIAS', 'ENTREGA: ESA / 1850+SEGURO: 1.200', 'DIADEMA', 'R$ 3.050,00', 3050.00),\n('GV', 'ANA DIAS', 'COLETA: ELOG / 260+SEGURO: 440,00', 'S J CAMPOS', 'R$ 700,00', 700.00),\n('ACTA', 'VILMEI', 'ROTAS DE QUARTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('RECICLAGEM', 'PATRICIA', 'COLETA: CANINDÉ / 380+SEGURO: 9,50', 'SÃO PAULO', 'R$ 389,50', 389.50),\n('RECICLAGEM', 'PATRICIA', 'COLETA: DBD / 230+SEGURO: 3,07', 'MAUÁ', 'R$ 233,07', 233.07),\n('AUTOLIV', 'ELIAS', 'ENTREGA: ADIENT', 'S B CAMPO', NULL, NULL),\n('AUTOLIV', 'KELVYN', 'MULTCARD', 'SJCAMPOS', 'R$ 95,00', 95.00),\n('AUTOLIV', 'VIVIANE', 'ENTREGA: BALDI / 660+SEGURO: 53,83', 'VARZEA PSTA', 'R$ 713,83', 713.83),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 223,11', 'VARZEA PSTA', 'R$ 1.873,11', 1873.11),\n('MUBEA', 'REGIS DIAS', 'COLETA: TEK BRASIL / 250+SEGURO: 69,87', 'SAO PAULO', 'R$ 319,87', 319.87),\n('HYDROSTEC', 'FELIPE', 'UNIVERSO', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('GV', 'CIOMARA', 'COLETA: HYTORC / 500+SEGURO: 192,11', 'S B CAMPO', 'R$ 692,11', 692.11),\n('GV', 'ANA DIAS', 'COLETA: ICONIC / 1450+SEGURO: 59,76', 'GUARULHOS', 'R$ 1.509,76', 1509.76),\n('GV', 'ANA DIAS', 'COLETA: LUGAB / 1360+SEGURO: 250,00', 'SÃO PAULO', 'R$ 1.610,00', 1610.00),\n('ACTA', 'VILMEI', 'ROTAS DE QUINTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('CAMPO LIMPO', 'PORTARIA', 'CORREIO', 'TAUBATE', 'R$ 20,00', 20.00),\n('RECICLAGEM', 'ANDRÉ', 'COLETA: FUSH / 625+SEGURO: 2.400', 'TAB DA SERRA', 'R$ 3.025,00', 3025.00),\n('RECICLAGEM', 'ANDRÉ', 'COLETA: FUSH / 625+SEGURO: 1.833', 'TAB DA SERRA', 'R$ 2.458,00', 2458.00),\n('RECICLAGEM', 'RODRIGO', 'ENTREGA: PGT / 280+SEGURO: 10,00', 'CARAPICUIBA', 'R$ 290,00', 290.00),\n('RECICLAGEM', 'RODRIGO', 'COLETA: PGT / 280,00+SEGURO: 10,00', 'CARAPICUIBA', 'R$ 290,00', 290.00),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: ARS / 250+SEGURO: 2,09', 'SANTO ANDRÉ', 'R$ 252,09', 252.09),\n('TAMPAS', 'HENRIQUE', 'COLETA: GERALDISCOS / 2250+SEGURO: 2.792,62', 'SANT PARNAIBA', 'R$ 5.042,62', 5042.62),\n('TAMPAS', 'ISABELA', 'COLETA: KORETECH / 470+SEGURO: 10,06', 'BARUERI', 'R$ 480,06', 480.06),\n('AUTOLIV', 'VIVIANE', 'ENTREGA: BALDI', 'VARZEA PSTA', 'R$ 1.650,00', 1650.00),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALDI / 1.650+SEGURO: 83,58', 'VARZEA PSTA', 'R$ 1.733,58', 1733.58),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALDI / 660+SEGURO: 122,41', 'VARZEA PSTA', 'R$ 782,41', 782.41),\n('IFF', 'THAIS', 'ENTREGA: IFF TAMBORÉ', 'SANT PARNAIBA', 'R$ 350,00', 350.00),\n('IFF', 'PRISCILA', 'CARTÓRIO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'THIAGO', 'CORREIO', 'TAUBATE', 'R$ 35,00', 35.00),\n('HYDROSTEC', 'GUSTAVO', 'CORREIO / POTENZA', 'TAUBATE', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'RAFAELA', 'POTENZA', 'TAUBATE', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN', 'TAUBATE', 'R$ 60,00', 60.00),\n('PLASCAR', 'BRENO', 'COLETA FRAC: ART MODERNA', 'SAO PAULO', 'R$ 550,00', 550.00),\n('PLASCAR', 'MARCELO', 'ENTREGA FRAC: DURR / 210+SEGURO: 323,01', 'SÃO PAULO', 'R$ 533,01', 533.01),\n('PLASCAR', 'DANILO', 'COLETA: LUANA / 525+SEGURO: 350,00', 'COTIA', 'R$ 875,00', 875.00),\n('PISANI', 'INGRID', 'COLETA: CARDELLA / 780+SEGURO: 77,90', 'VALINHOS', 'R$ 857,90', 857.90),\n('PISANI', 'EDUARDO', 'COLETA: 4 AUTOM / COLETADO DIADEMA/CARRO', 'S B C / DIADEMA', 'R$ 680,00', 680.00),\n('GV', 'ANA DIAS', 'ENTREGA: MACOPEMA / 4900+SEGURO: 1.257,44', 'MONTE ALTO', 'R$ 6.157,44', 6157.44),\n('GV', 'ANA DIAS', 'ENTREGA: MOREIRA JUNIOR', 'TAUBATÉ', 'R$ 95,00', 95.00),\n('GV', 'ANA DIAS', 'COLETA: MOREIRA JUNIOR', 'TAUBATÉ', 'R$ 95,00', 95.00),\n('ACTA', 'VILMEI', 'ROTAS DE SEXTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('RESINAS', 'HELENA', 'COLETA: FORNOS CELLI / 750+SEGURO: 87,83', 'SOROCABA', 'R$ 837,83', 837.83),\n('RECICLAGEM', 'ISABELA', 'COLETA: SAFETLINE / 670+SEGURO: 4,42', 'HORTOLANDIA', 'R$ 674,42', 674.42),\n('RECICLAGEM', 'HELENA', 'COLETA: BANU / 380+SEGURO: 20,80', 'SÃO PAULO', 'R$ 400,82', 400.82),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: FAMABRÁS / 380+SEGURO: 8,54', 'ITAQUA', 'R$ 388,54', 388.54),\n('RECICLAGEM', 'HELENA', 'COLETA: VEDABRÁS / 230+SEGURO: 25,05', 'SÃO PAULO', 'R$ 255,05', 255.05),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('MUBEA', 'MARCOS MOREIRA', 'COLETA: RADIAL', 'SÃO PAULO', 'R$ 250,00', 250.00),\n('MUBEA', 'ANDRÉ MOREIRA', 'COLETA: THERMOMATIC', 'SÃO PAULO', 'R$ 250,00', 250.00),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALD - 8H / 1650+SEGURO: 83,58', 'VARZEA PSTA', 'R$ 1.733,58', 1733.58),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALDI - 12H / 1650+SEGURO: 109,73', 'VARZEA PSTA', 'R$ 1.759,73', 1759.73),\n('CIESP', 'CLOVIS', 'ENTREGA DE DOCUMENTO', 'SÃO PAULO', 'R$ 250,00', 250.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES (2 REMESSAS/MESMA NOTA', 'GUARULHOS', 'R$ 900,00', 900.00),\n('HYDROSTEC', 'FELIPE', 'ARBO / COREVAL', 'TAUBATE', 'R$ 30,00', 30.00),\n('HYDROSTEC', 'RAFAELA', 'ENTREGA SEM NF:', 'OSASCO', 'R$ 465,00', 465.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN', 'TAUBATE', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'COLETA: NEOCONEX / 265+SEGURO: 118,36', 'SANTO ANDRÉ', 'R$ 383,16', 383.16),\n('PLASCAR', 'MARCO ANTONIO', 'COLETA: FIXSAN', 'TAUBATE', 'R$ 85,00', 85.00),\n('GV', 'ALEXANDRE', 'ENTREGA: AVK / 637,93+SEGURO: 62,07', 'SOROCABA', 'R$ 700,00', 700.00),\n('GV', 'ALEXANDRE', 'COLETA AVK / 641,00+SEGURO: 59,00', 'SOROCABA', 'R$ 700,00', 700.00),\n('PISANI', 'EDUARDO', 'ENTREGA: GM', 'S J CAMPOS', 'R$ 235,00', 235.00),\n('LUGAB', 'JUNIOR', 'COLETA: GV P LUGAB / 1200+SEGURO: 706,37', 'SAO PAULO', 'R$ 1.906,37', 1906.37),\n('IFF', 'THAIS', 'ENTREGA: IFF TAMBORÉ', 'SANT PARNAIBA', 'R$ 410,00', 410.00),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALDI / 1650+SEGURO: 84,12', 'VARZEA PSTA', 'R$ 1.734,12', 1734.12),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALDI / 1650+SEGURO: 17,93', 'VARZEA PSTA', 'R$ 1.667,93', 1667.93),\n('CAMPO LIMPO', 'LOGISTICA', 'PAPELARIA - IDA E VOLTA', 'TAUBATÉ', 'R$ 40,00', 40.00),\n('RECICLAGEM', 'HELENA', 'ENTREGA: COM FERRAG / 900+SEGURO: 3,06', 'RIB PRETO', 'R$ 903,06', 903.06),\n('RECICLAGEM', 'PATRICIA CARLA', 'COLETA: DELAMARIS / 2376+SEGURO: 66,75', 'JOINVILLE', 'R$ 2.442,75', 2442.75),\n('HYDROSTEC', 'CARMEN', 'CARTÓRIO', 'TAUBATÉ', 'R$ 45,00', 45.00),\n('HYDROSTEC', 'GUSTAVO', 'TINTAS GONÇALVES', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'POTENZA -', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'FIXAN - IDA E VOLTA', 'TAUBATÉ', 'R$ 30,00', 30.00),\n('MUBEA', 'REGINA', 'ENTREGA DE DOCUMENTO - FUNCIONÁRIO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('MUBEA', 'REGINA', 'ENTREGA DE DOCUMENTO - FUNCIONÁRIO', 'TREMEMBÉ', 'R$ 55,00', 55.00),\n('IFF', 'MICHELLE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('AUTOLIV', 'VIVIANE', 'ENTREGA: BALDI', 'VARZEA PSTA', 'R$ 660,00', 660.00),\n('AUTOLIV', 'VIVIANE', 'COLETA: BALD / 1650+SEGURO: 140,60', 'VARZEA PSTA', 'R$ 1.790,60', 1790.60),\n('AUTOLIV', 'ADRIELY', 'CLINICA LIDA', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('LUGAB', 'JUNIOR', 'COLETA: LUGABX GV', 'SAO PAULO/PINDA', 'R$ 490,00', 490.00),\n('PLASCAR', 'DANILO', 'COLETA: ELETRO MEC. UNIVERSO', 'SJCAMPOS', 'R$ 95,00', 95.00),\n('TAMPAS', 'HENRIQUE', 'COLETA: SANPAR / 780+SEGURO: 87,73', 'SANT PARNAÍBA', 'R$ 867,73', 867.73),\n('TAMPAS', 'HENRIQUE', 'COLETA: GERALDISCOS / 2250+SEGURO: 5.494,27', 'SANT PARNAÍBA', 'R$ 7.744,27', 7744.27),\n('TAMPAS', 'PATRICIA SANTOS', 'COLETA: ARBURG / 230+SEGURO: 10,76', 'SÃO PAULO', 'R$ 240,76', 240.76),\n('RECICLAGEM', 'RODRIGO', 'COLETA: TBM / 1.150+SEGURO: 1.200', 'SÃO PAULO', 'R$ 2.350,00', 2350.00),\n('CAMPO LIMPO', 'THAIS', 'KRAFTT', 'TAUBATE', 'R$ 60,00', 60.00),\n('GV', 'ANA CLAUDIA', 'ENTREGA: COPEGE / FRACIONADO', 'SÃO PAULO', 'R$ 290,00', 290.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('IFF', 'FELIPE', 'CHAVEIRO', 'TAUBATE', 'R$ 35,00', 35.00),\n('IFF', 'THAIS', 'ENTREGA,HOTEL PLAZA PAULISTA', 'SP', 'R$ 390,00', 390.00),\n('HYDROSTEC', 'CARMEN', 'CARTÓRIO', 'TAUBATE', 'R$ 45,00', 45.00),\n('HYDROSTEC', 'RH', 'ÓTICA DISI', 'TAUBATE', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'ALAN', 'J A PLACAS', 'TAUBATE', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'CENTER TUDO', 'TAUBATE', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'GUSTAVO', 'CORREIO', 'TAUBATE', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAN', 'TAUBATE', 'R$ 15,00', 15.00),\n('MUBEA', 'REGINA', 'CHAVEIRO - IDA E VOLTA', 'TAUBATE', 'R$ 40,00', 40.00),\n('MUBEA', 'REGINA', 'CORREIO', 'TAUBATE', 'R$ 20,00', 20.00),\n('LUGAB', 'JUNIOR', 'COLETA: LUGAB X GV', 'SAO PAULO/PINDA', 'R$ 490,00', 490.00),\n('PISANI', 'EDUARDO', 'COLETA: CEPAGLI / 750+SEGURO: 450,00', 'VINHEDO', 'R$ 1.200,00', 1200.00),\n('PISANI', 'EDUARDO', 'COLETA: ROCHAS ETIQUETAS', 'SÃO PAULO', 'R$ 290,00', 290.00),\n('COMINDRE', 'LUAN', 'ENTREGA NA GERDAL', 'PINDA', 'R$ 570,00', 570.00),\n('ACTA', 'VILMEI', 'ROTA DE QUARTA FEIRA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('CAMPO LIMPO', 'PATRICIA SANTOS', 'CARIMBOS AGUIAR', 'TAUBATE', 'R$ 20,00', 20.00),\n('RESINAS', 'RODRIGO', 'ENTREGA: ANSELMO / 625+SEGURO: 600,00', 'TAB DA SERRA', 'R$ 1.225,00', 1225.00),\n('RESINAS', 'PATRICIA SANTOS', 'COLETA: WAM / 85+SEGURO:20,46', 'SJCAMPOS', 'R$ 105,46', 105.46),\n('RECICLAGEM', 'RODRIGO', 'ENTREGA: ANSELMO / 625+SEGURO: 600,00', 'III', 'R$ 1.225,00', 1225.00),\n('RECICLAGEM', 'RODRIGO', 'ENTREGA: PGT / 280+SEGURO: 10,00', 'CARAPICUIBA', 'R$ 290,00', 290.00),\n('RECICLAGEM', 'RODRIGO', 'COLETA: FUSH / 625+SEGURO: 516,00', 'TAB DA SERRA', 'R$ 1.141,00', 1141.00),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: CROMEX / 380+SEGURO: 42,27', 'MAUÁ', 'R$ 422,27', 422.27),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: GLOBAL / 280+SEGURO: 10,20', 'OSASCO', 'R$ 290,20', 290.20),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: VIFER / 470+SEGURO: 2,75', 'OSASCO', 'R$ 472,75', 472.75),\n('RESINAS', 'HELENA', 'COLETA: SEIKI / 380+SEGURO:27,06', 'SÃO PAULO', 'R$ 407,06', 407.06),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('IFF', 'THAIS', 'ENTREGA: DIAGEO', 'SÃO PAULO', 'R$ 390,00', 390.00),\n('PINTAK', 'VITORIA', 'COLETA: DRIV BRASIL', 'COTIA/SP', 'R$ 280,00', 280.00),\n('HYDROSTEC', 'ALINI', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'GUSTAVO', 'VELLOSO', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('CBF', 'JAVIER', 'COLETA: CBF SP PARA GV', 'SAO PAULO', 'R$ 290,00', 290.00),\n('COPEC', 'FATIMA', 'COLETA COPEC PARA GV = FRACIONADO', 'OSASCO', 'R$ 390,00', 390.00),\n('ACTA', 'VILMEI', 'ROTA DE QUINTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('RECICLAGEM', 'EVERTON', 'ENTREGA: POLLOSERV / 1.150+SEGURO: 5,00', 'SAO PAULO', 'R$ 1.155,00', 1155.00),\n('RECICLAGEM', 'PATRICIA SANTOS', 'COLETA: WORTEX / 370,00+SEGURO: 55,00', 'CAMPINAS', 'R$ 425,00', 425.00),\n('RECICLAGEM', 'EVERTON', 'COLETA: POLLOSERV / 575,00+SEGURO: 175,00', 'SAO PAULO', 'R$ 750,00', 750.00),\n('RECICLAGEM', 'PATRICIA CARLA', 'COLETA: FRIGELAR / 3.280+SEGURO: 34,25', 'SANTA CATARINA', 'R$ 3.314,25', 3314.25),\n('CAMPO LIMPO', 'ROBERTA', 'CARIMBO/ IDA E VOLTA', 'TAUBATE', 'R$ 40,00', 40.00),\n('AUTOLIV', 'ADRIELY', 'CLINICA LIDA', 'TAUBATE', 'R$ 15,00', 15.00),\n('IFF', 'JOAO VITOR', 'CORREIO', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'MICHELE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00),\n('PINTAK', 'VITORIA', 'ENTREGA: TENECO', 'COTIA/SP', 'R$ 280,00', 280.00),\n('HYDROSTEC', 'FELIPE', 'COLETA: POTENZA', 'TAUBATÉ', 'R$ 60,00', 60.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAM', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'SILVIO', 'COLETA: UNIVERSO', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('PISANI', 'INGRID', 'COLETA: PLASTEASY / 450+SEGURO: 58,00', 'SUZANO', 'R$ 508,00', 508.00),\n('GV', 'ANA CLAUDIA', 'ENTREGA: INOVARTIS / 744+SEGURO: 420,00', 'ITATIBA', 'R$ 1.164,00', 1164.00),\n('GV', 'CIOMARA', 'ENTREGA: HYTORC', 'SAO BERNADO', NULL, NULL),\n('GV', 'FABIANA', 'COLETA: IFFA', 'SÃO PAULO', 'R$ 700,00', 700.00),\n('ACTA', 'VILMEI', 'ROTA DE SEXTA', 'SJCAMPOS', 'R$ 295,00', 295.00),\n('RECICLAGEM', 'PATRICIA CARLA', 'COLETA: KORETECH / 900+SEGURO: 247,92', 'BARUERI', 'R$ 1.147,92', 1147.92),\n('TAMPAS', 'ISABELA', 'COLETA: ITAL / 280+SEGURO: 36,75', 'COTIA', 'R$ 316,75', 316.75),\n('RECICLAGEM', 'LUCAS', 'COLETA: PGT / +SEGURO:280', 'CARAPICIBA', 'R$ 280,00', 280.00),\n('RECICLAGEM', 'ISABELA', 'COLETA: ABECOM / 230+SEGURO:', 'SÃO PAULO', 'R$ 230,00', 230.00),\n('CAMPO LIMPO', 'PORTARIA', 'CORREIO', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('CAMPO LIMPO', 'DOUGLAS', 'COREVAL', 'TAUBATÉ', 'R$ 20,00', 20.00),\n('HYDROSTEC', 'FELIPE', 'COLETA: LAB SYSTEM', 'GUARULHOS', 'R$ 420,00', 420.00),\n('HYDROSTEC', 'FELIPE', 'COLETA: COREVAL', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'ALLAN', 'J A PLACAS', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('HYDROSTEC', 'RAFAELA', 'FIXSAM', 'TAUBATÉ', 'R$ 15,00', 15.00),\n('PISANI', 'INGRID', 'ENTREGA: 4 AUTOM / 490+SEGURO: 50,00', 'S B CAMPO', 'R$ 540,00', 540.00),\n('IFF', 'THAIS', 'CORREIOS', 'TAUBATÉ', 'R$ 35,00', 35.00),\n('IFF', 'MICHELE', 'CIESP', 'TAUBATÉ', 'R$ 48,00', 48.00),\n('PELZER', 'RAFAEL', 'COLETA: SPECIAL GASES', 'GUARULHOS', 'R$ 450,00', 450.00);\n"}	25eb18fe-88cc-4921-a157-df0a0d64fe8f	victorcamisa.mkt@gmail.com	\N
20250610044411	{"\n-- Criar tabela para armazenar os custos de maio\nCREATE TABLE public.custos_maio (\n  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,\n  descricao TEXT NOT NULL,\n  data_vencimento DATE NOT NULL,\n  valor_texto TEXT NOT NULL,\n  forma_pagamento TEXT NOT NULL,\n  tipo TEXT NOT NULL CHECK (tipo IN ('Fixo', 'Variável')),\n  valor_numerico DECIMAL(10,2) NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()\n);\n\n-- Inserir todos os dados de custos de maio\nINSERT INTO public.custos_maio (descricao, data_vencimento, valor_texto, forma_pagamento, tipo, valor_numerico) VALUES\n('Teto caminhão', '2025-05-02', 'R$ 500,00', 'Pix', 'Variável', 500.00),\n('Conserto moto', '2025-05-03', 'R$ 155,00', 'Pix', 'Variável', 155.00),\n('SEGURO CAMINHAO TRUCK', '2025-05-04', 'R$ 1.876,13', 'BOLETO', 'Fixo', 1876.13),\n('Raster Iveco', '2025-05-05', 'R$ 120,00', 'Pix', 'Variável', 120.00),\n('Cartão Neo', '2025-05-05', 'R$ 3.107,87', 'Saldo em conta', 'Variável', 3107.87),\n('Sem parar', '2025-05-05', 'R$ 5.266,56', 'Saldo em conta', 'Fixo', 5266.56),\n('Consórcio MES 6 N T +', '2025-05-05', 'R$ 639,80', 'Pix', 'Fixo', 639.80),\n('Consórcio', '2025-05-05', 'R$ 1.087,55', 'Pix', 'Fixo', 1087.55),\n('Consórcio MES 6 N T +', '2025-05-05', 'R$ 639,80', 'Pix', 'Fixo', 639.80),\n('Sistema Conex VITOR E ANA', '2025-05-06', 'R$ 1.250,00', 'Pix', 'Variável', 1250.00),\n('Cartão Itau PJ', '2025-05-09', 'R$ 16.094,06', 'Saldo em conta', 'Variável', 16094.06),\n('Empréstimo', '2025-05-10', 'R$ 2.201,38', 'Pix', 'Fixo', 2201.38),\n('Cartão 7 Estrelas', '2025-05-10', 'R$ 829,70', 'Pix', 'Variável', 829.70),\n('Contador', '2025-05-10', 'R$ 1.000,00', 'Pix', 'Fixo', 1000.00),\n('Cartão Nubank', '2025-05-12', 'R$ 7.054,68', 'Saldo em conta', 'Variável', 7054.68),\n('Casa', '2025-05-13', 'R$ 650,00', 'Pix', 'Fixo', 650.00),\n('Claro', '2025-05-14', 'R$ 338,17', 'Pix', 'Fixo', 338.17),\n('Tel Fixo', '2025-05-15', 'R$ 68,17', 'Pix', 'Fixo', 68.17),\n('Telefone', '2025-05-16', 'R$ 67,05', 'Pix', 'Fixo', 67.05),\n('Consórcio', '2025-05-17', 'R$ 469,85', 'Pix', 'Fixo', 469.85),\n('Seguro de vida', '2025-05-17', 'R$ 172,09', 'Pix', 'Fixo', 172.09),\n('Cartão BV', '2025-05-17', 'R$ 3.933,18', 'Saldo em conta', 'Variável', 3933.18),\n('Cartão Credcar', '2025-05-17', 'R$ 1.797,81', 'Saldo em conta', 'Variável', 1797.81),\n('Boleto Caminhão', '2025-05-18', 'R$ 3.990,80', 'Pix', 'Fixo', 3990.80),\n('Cartão Carrefour', '2025-05-20', 'R$ 936,24', 'Pix', 'Variável', 936.24),\n('Parcela Giro', '2025-05-20', 'R$ 3.119,12', 'Pix', 'Fixo', 3119.12),\n('Seguro de vida', '2025-05-20', 'R$ 117,00', 'Pix', 'Fixo', 117.00),\n('Imposto', '2025-05-20', 'R$ 28.798,29', 'Pix', 'Variável', 28798.29),\n('FGTS', '2025-05-20', 'R$ 209,40', 'Pix', 'Fixo', 209.40),\n('INSS', '2025-05-20', 'R$ 379,79', 'Pix', 'Fixo', 379.79),\n('Seguro Fiorino INC ITAU', '2025-05-20', 'R$ 462,00', 'Pix', 'Fixo', 462.00),\n('Celular Wallison (04/05)', '2025-05-21', 'R$ 141,10', 'Pix', 'Fixo', 141.10),\n('lavagem carro', '2025-05-22', 'R$ 100,00', 'Pix', 'Variável', 100.00),\n('Victor/Ana', '2025-05-20', 'R$ 500,00', 'Pix', 'Fixo', 500.00),\n('MS diesel', '2025-05-23', 'R$ 400,00', 'pix', 'Variável', 400.00),\n('Bruna troca pneu ODH', '2025-05-23', 'R$ 120,00', 'pix', 'Variável', 120.00),\n('Mecanico Pulse', '2025-05-24', 'R$ 1.400,00', 'pix', 'Variável', 1400.00),\n('Terreno BLM', '2025-05-25', 'R$ 860,64', 'Saldo em conta', 'Fixo', 860.64),\n('Cartão Will', '2025-05-25', 'R$ 9.271,85', 'Pix', 'Variável', 9271.85),\n('Mecanico Diesel', '2025-05-26', 'R$ 120,00', 'pix', 'Variável', 120.00),\n('Cartão Santander', '2025-05-26', 'R$ 5.724,64', 'Saldo em conta', 'Variável', 5724.64),\n('Terreno VLC', '2025-05-26', 'R$ 1.200,00', 'Pix', 'Fixo', 1200.00),\n('RASTREADOR', '2025-05-27', 'R$ 500,00', 'PIX', 'Fixo', 500.00),\n('Internet terreno', '2025-05-27', 'R$ 102,49', 'pix', 'Variável', 102.49),\n('Internet casa', '2025-05-27', 'R$ 136,39', 'pix', 'Variável', 136.39),\n('Conta agua terreno', '2025-05-27', 'R$ 70,51', 'pix', 'Variável', 70.51),\n('Conta agua terreno', '2025-05-27', 'R$ 68,74', 'PIX', 'Variável', 68.74),\n('conta de luz terreno', '2025-05-27', 'R$ 76,85', 'PIX', 'Variável', 76.85),\n('Empréstimo Mae', '2025-05-28', 'R$ 1.700,00', 'pix', 'Variável', 1700.00),\n('Cadatro marketing', '2025-05-29', 'R$ 220,00', 'pix', 'Variável', 220.00),\n('Seguro Roubo', '2025-05-30', 'R$ 2.730,85', 'Pix', 'Variável', 2730.85),\n('Seguro Carga', '2025-05-30', 'R$ 1.401,76', 'Pix', 'Variável', 1401.76),\n('Sistema Soft', '2025-05-30', 'R$ 239,90', 'Pix', 'Fixo', 239.90);\n"}	705994a0-0408-44aa-9d16-eb0225ff297e	victorcamisa.mkt@gmail.com	\N
20250610045553	{"\n-- Adicionar coluna data na tabela servicos_maio\nALTER TABLE public.servicos_maio \nADD COLUMN data_servico DATE;\n\n-- Atualizar todos os registros existentes para maio de 2024\nUPDATE public.servicos_maio \nSET data_servico = '2024-05-01'\nWHERE data_servico IS NULL;\n\n-- Tornar a coluna obrigatória após atualizar os dados existentes\nALTER TABLE public.servicos_maio \nALTER COLUMN data_servico SET NOT NULL;\n\n-- Definir valor padrão para novos registros\nALTER TABLE public.servicos_maio \nALTER COLUMN data_servico SET DEFAULT CURRENT_DATE;\n"}	f98cb249-a08b-43b0-a756-f9297c73f969	victorcamisa.mkt@gmail.com	\N
20250610051210	{"\n-- Criar tabela para gerenciar permissões dos usuários\nCREATE TABLE public.user_permissions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,\n  permission TEXT NOT NULL,\n  granted_by UUID REFERENCES public.profiles(id),\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),\n  UNIQUE(user_id, permission)\n);\n\n-- Habilitar RLS na tabela de permissões\nALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;\n\n-- Função para verificar se um usuário tem uma permissão específica\nCREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, permission_name TEXT)\nRETURNS BOOLEAN\nLANGUAGE SQL\nSECURITY DEFINER\nSTABLE\nAS $$\n  SELECT EXISTS (\n    SELECT 1 FROM public.user_permissions \n    WHERE user_permissions.user_id = has_permission.user_id \n    AND user_permissions.permission = permission_name\n  );\n$$;\n\n-- Função para verificar se o usuário atual é admin\nCREATE OR REPLACE FUNCTION public.is_current_user_admin()\nRETURNS BOOLEAN\nLANGUAGE SQL\nSECURITY DEFINER\nSTABLE\nAS $$\n  SELECT EXISTS (\n    SELECT 1 FROM public.profiles \n    WHERE id = auth.uid() \n    AND role = 'admin'\n  );\n$$;\n\n-- Políticas RLS para user_permissions\nCREATE POLICY \\"Admins can view all permissions\\"\n  ON public.user_permissions\n  FOR SELECT\n  USING (public.is_current_user_admin());\n\nCREATE POLICY \\"Admins can insert permissions\\"\n  ON public.user_permissions\n  FOR INSERT\n  WITH CHECK (public.is_current_user_admin());\n\nCREATE POLICY \\"Admins can update permissions\\"\n  ON public.user_permissions\n  FOR UPDATE\n  USING (public.is_current_user_admin());\n\nCREATE POLICY \\"Admins can delete permissions\\"\n  ON public.user_permissions\n  FOR DELETE\n  USING (public.is_current_user_admin());\n\n-- Adicionar permissões padrão para o usuário admin existente (assumindo que já existe)\n-- Isso pode ser executado manualmente depois se necessário\n"}	ad600e91-5a86-415c-99f0-f1e1937979ba	victorcamisa.mkt@gmail.com	\N
20250610052447	{"\n-- Remover a foreign key constraint que está causando o problema\nALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;\n\n-- Adicionar uma coluna de email para referência (se não existir)\nALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;\n\n-- Gerar emails únicos para registros existentes\nUPDATE public.profiles \nSET email = CONCAT(username, '@sistema.local')\nWHERE email IS NULL OR email = 'email@exemplo.com';\n\n-- Tornar o email obrigatório\nALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;\n\n-- Criar um índice único para o email\nCREATE UNIQUE INDEX IF NOT EXISTS profiles_email_key ON public.profiles(email);\n"}	38cd6094-9f73-46fa-a042-01e208ad4f0f	victorcamisa.mkt@gmail.com	\N
20250610054033	{"\n-- Primeiro, vamos dropar as políticas existentes que estão causando problemas\nDROP POLICY IF EXISTS \\"Admins can view all permissions\\" ON public.user_permissions;\nDROP POLICY IF EXISTS \\"Admins can insert permissions\\" ON public.user_permissions;\nDROP POLICY IF EXISTS \\"Admins can update permissions\\" ON public.user_permissions;\nDROP POLICY IF EXISTS \\"Admins can delete permissions\\" ON public.user_permissions;\n\n-- Dropar políticas existentes da tabela profiles para recriar\nDROP POLICY IF EXISTS \\"Users can view own profile\\" ON public.profiles;\nDROP POLICY IF EXISTS \\"Admins can view all profiles\\" ON public.profiles;\nDROP POLICY IF EXISTS \\"Admins can insert profiles\\" ON public.profiles;\nDROP POLICY IF EXISTS \\"Admins can update profiles\\" ON public.profiles;\n\n-- Dropar a função que está causando recursão infinita\nDROP FUNCTION IF EXISTS public.is_current_user_admin();\n\n-- Criar uma função de segurança definer para verificar se o usuário atual é admin\nCREATE OR REPLACE FUNCTION public.get_current_user_role()\nRETURNS TEXT\nLANGUAGE SQL\nSECURITY DEFINER\nSTABLE\nAS $$\n  SELECT role FROM public.profiles WHERE id = auth.uid();\n$$;\n\n-- Criar uma função para verificar se o usuário atual é admin\nCREATE OR REPLACE FUNCTION public.is_admin()\nRETURNS BOOLEAN\nLANGUAGE SQL\nSECURITY DEFINER\nSTABLE\nAS $$\n  SELECT public.get_current_user_role() = 'admin';\n$$;\n\n-- Habilitar RLS nas tabelas se ainda não estiver habilitado\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\n\n-- Recriar as políticas RLS usando a nova função para user_permissions\nCREATE POLICY \\"Admins can view all permissions\\"\n  ON public.user_permissions\n  FOR SELECT\n  USING (public.is_admin());\n\nCREATE POLICY \\"Admins can insert permissions\\"\n  ON public.user_permissions\n  FOR INSERT\n  WITH CHECK (public.is_admin());\n\nCREATE POLICY \\"Admins can update permissions\\"\n  ON public.user_permissions\n  FOR UPDATE\n  USING (public.is_admin());\n\nCREATE POLICY \\"Admins can delete permissions\\"\n  ON public.user_permissions\n  FOR DELETE\n  USING (public.is_admin());\n\n-- Criar políticas RLS para a tabela profiles\nCREATE POLICY \\"Users can view own profile\\"\n  ON public.profiles\n  FOR SELECT\n  USING (auth.uid() = id);\n\nCREATE POLICY \\"Admins can view all profiles\\"\n  ON public.profiles\n  FOR SELECT\n  USING (public.is_admin());\n\nCREATE POLICY \\"Admins can insert profiles\\"\n  ON public.profiles\n  FOR INSERT\n  WITH CHECK (public.is_admin());\n\nCREATE POLICY \\"Admins can update profiles\\"\n  ON public.profiles\n  FOR UPDATE\n  USING (public.is_admin());\n"}	07587863-e6da-4f45-b3b8-ff98fe0833e4	victorcamisa.mkt@gmail.com	\N
20250610054545	{"\n-- Update the handle_new_user function to include the email field\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS trigger\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  INSERT INTO public.profiles (id, username, email, role)\n  VALUES (\n    NEW.id,\n    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),\n    NEW.email,  -- Add the email field from the auth.users table\n    COALESCE(NEW.raw_user_meta_data->>'role', 'user')\n  );\n  RETURN NEW;\nEND;\n$$;\n"}	e77038a7-a235-4b96-a21c-246f86b61481	victorcamisa.mkt@gmail.com	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 17, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ServMaio ServMaio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServMaio"
    ADD CONSTRAINT "ServMaio_pkey" PRIMARY KEY ("Empresa");


--
-- Name: custos_maio custos_maio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custos_maio
    ADD CONSTRAINT custos_maio_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: servicos_maio servicos_maio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicos_maio
    ADD CONSTRAINT servicos_maio_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_user_id_permission_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_permission_key UNIQUE (user_id, permission);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: profiles_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: user_permissions user_permissions_granted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.profiles(id);


--
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: user_permissions Admins can delete permissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can delete permissions" ON public.user_permissions FOR DELETE USING (public.is_admin());


--
-- Name: user_permissions Admins can insert permissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert permissions" ON public.user_permissions FOR INSERT WITH CHECK (public.is_admin());


--
-- Name: profiles Admins can insert profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin());


--
-- Name: user_permissions Admins can update permissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update permissions" ON public.user_permissions FOR UPDATE USING (public.is_admin());


--
-- Name: profiles Admins can update profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());


--
-- Name: user_permissions Admins can view all permissions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all permissions" ON public.user_permissions FOR SELECT USING (public.is_admin());


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());


--
-- Name: profiles Enable insert for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for service role" ON public.profiles FOR INSERT WITH CHECK (true);


--
-- Name: ServMaio; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."ServMaio" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_permissions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION get_current_user_role(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_current_user_role() TO anon;
GRANT ALL ON FUNCTION public.get_current_user_role() TO authenticated;
GRANT ALL ON FUNCTION public.get_current_user_role() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION has_permission(user_id uuid, permission_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.has_permission(user_id uuid, permission_name text) TO anon;
GRANT ALL ON FUNCTION public.has_permission(user_id uuid, permission_name text) TO authenticated;
GRANT ALL ON FUNCTION public.has_permission(user_id uuid, permission_name text) TO service_role;


--
-- Name: FUNCTION is_admin(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin() TO anon;
GRANT ALL ON FUNCTION public.is_admin() TO authenticated;
GRANT ALL ON FUNCTION public.is_admin() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE "ServMaio"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."ServMaio" TO anon;
GRANT ALL ON TABLE public."ServMaio" TO authenticated;
GRANT ALL ON TABLE public."ServMaio" TO service_role;


--
-- Name: TABLE custos_maio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.custos_maio TO anon;
GRANT ALL ON TABLE public.custos_maio TO authenticated;
GRANT ALL ON TABLE public.custos_maio TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE servicos_maio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.servicos_maio TO anon;
GRANT ALL ON TABLE public.servicos_maio TO authenticated;
GRANT ALL ON TABLE public.servicos_maio TO service_role;


--
-- Name: TABLE user_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_permissions TO anon;
GRANT ALL ON TABLE public.user_permissions TO authenticated;
GRANT ALL ON TABLE public.user_permissions TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

