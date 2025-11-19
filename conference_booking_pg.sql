--
-- PostgreSQL database dump
--


-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: conference_booking; Type: SCHEMA; Schema: -; Owner: pguser
--

CREATE SCHEMA conference_booking;


ALTER SCHEMA conference_booking OWNER TO pguser;

--
-- Name: bookings_payment_method; Type: TYPE; Schema: conference_booking; Owner: pguser
--

CREATE TYPE conference_booking.bookings_payment_method AS ENUM (
    'cash',
    'credit_card',
    'UPI',
    'bank_transfer'
);


ALTER TYPE conference_booking.bookings_payment_method OWNER TO pguser;

--
-- Name: bookings_payment_status; Type: TYPE; Schema: conference_booking; Owner: pguser
--

CREATE TYPE conference_booking.bookings_payment_status AS ENUM (
    'unpaid',
    'paid'
);


ALTER TYPE conference_booking.bookings_payment_status OWNER TO pguser;

--
-- Name: bookings_status; Type: TYPE; Schema: conference_booking; Owner: pguser
--

CREATE TYPE conference_booking.bookings_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE conference_booking.bookings_status OWNER TO pguser;

--
-- Name: support_ticket_priority; Type: TYPE; Schema: conference_booking; Owner: pguser
--

CREATE TYPE conference_booking.support_ticket_priority AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE conference_booking.support_ticket_priority OWNER TO pguser;

--
-- Name: support_ticket_status; Type: TYPE; Schema: conference_booking; Owner: pguser
--

CREATE TYPE conference_booking.support_ticket_status AS ENUM (
    'open',
    'pending',
    'resolved'
);


ALTER TYPE conference_booking.support_ticket_status OWNER TO pguser;

--
-- Name: ticket_message_sender_type; Type: TYPE; Schema: conference_booking; Owner: pguser
--

CREATE TYPE conference_booking.ticket_message_sender_type AS ENUM (
    'user',
    'admin'
);


ALTER TYPE conference_booking.ticket_message_sender_type OWNER TO pguser;

--
-- Name: on_update_current_timestamp_bookings(); Type: FUNCTION; Schema: conference_booking; Owner: pguser
--

CREATE FUNCTION conference_booking.on_update_current_timestamp_bookings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION conference_booking.on_update_current_timestamp_bookings() OWNER TO pguser;

--
-- Name: on_update_current_timestamp_rooms(); Type: FUNCTION; Schema: conference_booking; Owner: pguser
--

CREATE FUNCTION conference_booking.on_update_current_timestamp_rooms() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION conference_booking.on_update_current_timestamp_rooms() OWNER TO pguser;

--
-- Name: on_update_current_timestamp_support_ticket(); Type: FUNCTION; Schema: conference_booking; Owner: pguser
--

CREATE FUNCTION conference_booking.on_update_current_timestamp_support_ticket() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION conference_booking.on_update_current_timestamp_support_ticket() OWNER TO pguser;

--
-- Name: on_update_current_timestamp_users(); Type: FUNCTION; Schema: conference_booking; Owner: pguser
--

CREATE FUNCTION conference_booking.on_update_current_timestamp_users() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION conference_booking.on_update_current_timestamp_users() OWNER TO pguser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.bookings (
    id bigint NOT NULL,
    booking_ref character varying(50) DEFAULT NULL::character varying,
    user_id bigint,
    room_id bigint,
    start_date date,
    start_time time without time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    approved_at timestamp with time zone,
    status conference_booking.bookings_status DEFAULT 'pending'::conference_booking.bookings_status,
    end_date date,
    end_time time without time zone,
    phone_number character varying(15) DEFAULT NULL::character varying,
    amount numeric(10,2) DEFAULT 0.00,
    tax numeric(10,2) DEFAULT 0.00,
    total_amount numeric(10,2) DEFAULT NULL::numeric,
    payment_status conference_booking.bookings_payment_status DEFAULT 'unpaid'::conference_booking.bookings_payment_status,
    payment_method conference_booking.bookings_payment_method DEFAULT 'UPI'::conference_booking.bookings_payment_method,
    transaction_ref character varying(100) DEFAULT NULL::character varying,
    invoice_no character varying(50) DEFAULT NULL::character varying,
    payment_date timestamp with time zone,
    feedback text,
    reject_response text,
    rating smallint
);


ALTER TABLE conference_booking.bookings OWNER TO pguser;

--
-- Name: COLUMN bookings.rating; Type: COMMENT; Schema: conference_booking; Owner: pguser
--

COMMENT ON COLUMN conference_booking.bookings.rating IS 'Rating from 1 to 5';


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.bookings_id_seq OWNER TO pguser;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.bookings_id_seq OWNED BY conference_booking.bookings.id;


--
-- Name: capacities; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.capacities (
    id bigint NOT NULL,
    capacity bigint NOT NULL,
    hidden boolean DEFAULT false
);


ALTER TABLE conference_booking.capacities OWNER TO pguser;

--
-- Name: capacities_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.capacities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.capacities_id_seq OWNER TO pguser;

--
-- Name: capacities_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.capacities_id_seq OWNED BY conference_booking.capacities.id;


--
-- Name: features; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.features (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    hidden boolean DEFAULT false
);


ALTER TABLE conference_booking.features OWNER TO pguser;

--
-- Name: features_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.features_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.features_id_seq OWNER TO pguser;

--
-- Name: features_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.features_id_seq OWNED BY conference_booking.features.id;


--
-- Name: room_features; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.room_features (
    room_id bigint NOT NULL,
    feature_id bigint NOT NULL
);


ALTER TABLE conference_booking.room_features OWNER TO pguser;

--
-- Name: rooms; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.rooms (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    available_from date,
    image character varying(255) DEFAULT 'OIP.webp'::character varying,
    capacity_id bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    location character varying(255) DEFAULT NULL::character varying,
    price numeric(10,2) DEFAULT NULL::numeric,
    feedback text
);


ALTER TABLE conference_booking.rooms OWNER TO pguser;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.rooms_id_seq OWNER TO pguser;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.rooms_id_seq OWNED BY conference_booking.rooms.id;


--
-- Name: support_ticket; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.support_ticket (
    id bigint NOT NULL,
    user_id bigint,
    subject character varying(255) DEFAULT NULL::character varying,
    description text,
    status conference_booking.support_ticket_status DEFAULT 'open'::conference_booking.support_ticket_status,
    priority conference_booking.support_ticket_priority DEFAULT 'medium'::conference_booking.support_ticket_priority,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);


ALTER TABLE conference_booking.support_ticket OWNER TO pguser;

--
-- Name: support_ticket_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.support_ticket_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.support_ticket_id_seq OWNER TO pguser;

--
-- Name: support_ticket_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.support_ticket_id_seq OWNED BY conference_booking.support_ticket.id;


--
-- Name: ticket_message; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.ticket_message (
    id bigint NOT NULL,
    ticket_id bigint,
    sender_id bigint,
    sender_type conference_booking.ticket_message_sender_type,
    message text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE conference_booking.ticket_message OWNER TO pguser;

--
-- Name: ticket_message_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.ticket_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.ticket_message_id_seq OWNER TO pguser;

--
-- Name: ticket_message_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.ticket_message_id_seq OWNED BY conference_booking.ticket_message.id;


--
-- Name: users; Type: TABLE; Schema: conference_booking; Owner: pguser
--

CREATE TABLE conference_booking.users (
    id bigint NOT NULL,
    name character varying(100) DEFAULT NULL::character varying,
    email character varying(100) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    avatar_url character varying(255) DEFAULT NULL::character varying,
    lastlogin timestamp with time zone,
    isrestrict boolean
);


ALTER TABLE conference_booking.users OWNER TO pguser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: conference_booking; Owner: pguser
--

CREATE SEQUENCE conference_booking.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE conference_booking.users_id_seq OWNER TO pguser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: conference_booking; Owner: pguser
--

ALTER SEQUENCE conference_booking.users_id_seq OWNED BY conference_booking.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.bookings ALTER COLUMN id SET DEFAULT nextval('conference_booking.bookings_id_seq'::regclass);


--
-- Name: capacities id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.capacities ALTER COLUMN id SET DEFAULT nextval('conference_booking.capacities_id_seq'::regclass);


--
-- Name: features id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.features ALTER COLUMN id SET DEFAULT nextval('conference_booking.features_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.rooms ALTER COLUMN id SET DEFAULT nextval('conference_booking.rooms_id_seq'::regclass);


--
-- Name: support_ticket id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.support_ticket ALTER COLUMN id SET DEFAULT nextval('conference_booking.support_ticket_id_seq'::regclass);


--
-- Name: ticket_message id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.ticket_message ALTER COLUMN id SET DEFAULT nextval('conference_booking.ticket_message_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.users ALTER COLUMN id SET DEFAULT nextval('conference_booking.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.bookings (id, booking_ref, user_id, room_id, start_date, start_time, created_at, updated_at, approved_at, status, end_date, end_time, phone_number, amount, tax, total_amount, payment_status, payment_method, transaction_ref, invoice_no, payment_date, feedback, reject_response, rating) FROM stdin;
21	BK20250922-000021	2	10	2025-09-24	08:40:46	2025-09-22 12:42:19+00	2025-11-04 05:39:16+00	\N	cancelled	2025-09-25	11:47:48	55555555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	noooooooooo	\N
22	BK20250922-000022	2	10	2025-09-29	13:41:15	2025-09-22 12:57:59+00	2025-11-04 05:39:16+00	\N	cancelled	2025-09-30	15:38:17	55555555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	nooooooo	\N
23	BK20250923-000023	20	26	2025-09-25	14:23:59	2025-09-23 11:53:00+00	2025-11-04 05:39:16+00	\N	rejected	2025-09-30	16:48:02	55555555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	nooooooooooo	\N
25	BK20250923-000025	20	29	2025-09-24	12:56:10	2025-09-23 12:27:52+00	2025-11-04 05:31:23+00	2025-09-23 18:02:52+00	approved	2025-09-25	15:05:19	55555555	7800.00	1404.00	9204.00	paid	UPI	TRX-000025	INV-000025	2025-09-24 01:52:09+00	good experience	\N	2
26	BK20250923-000026	20	29	2025-09-26	13:28:54	2025-09-23 12:29:33+00	2025-11-04 05:31:23+00	2025-09-23 18:04:33+00	approved	2025-09-27	16:02:32	55555555	7800.00	1404.00	9204.00	paid	UPI	TRX-000026	INV-000026	2025-09-26 03:19:08+00	nice experience	\N	\N
27	BK20250923-000027	20	29	2025-09-28	10:36:01	2025-09-23 12:58:54+00	2025-11-04 05:31:23+00	2025-09-23 18:33:54+00	approved	2025-09-29	12:56:44	1144774411	7800.00	1404.00	9204.00	paid	UPI	TRX-000027	INV-000027	2025-09-28 17:15:05+00	\N	\N	\N
39	BK20250930-000039	2	26	2025-10-02	14:33:24	2025-09-30 12:41:08+00	2025-11-04 05:31:23+00	2025-09-30 18:16:08+00	approved	2025-10-03	17:36:05	5555555555	7800.00	1404.00	9204.00	paid	UPI	TRX-000039	INV-000039	2025-10-02 16:14:05+00	\N	noooooo	\N
40	BK20251007-000040	20	10	2025-10-02	12:58:58	2025-10-07 06:48:14+00	2025-11-04 07:11:10+00	2025-10-07 12:23:14+00	approved	2025-10-05	14:10:17	1111111111	12400.00	2232.00	14632.00	paid	UPI	TRX-000040	INV-000040	2025-10-02 16:13:04+00	awesomeeeee	\N	\N
41	BK20251007-000041	20	26	2025-10-08	13:14:36	2025-10-07 06:48:44+00	2025-11-04 05:39:16+00	\N	cancelled	2025-10-09	15:03:06	2222222222	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	not available	\N
42	BK20251007-000042	20	29	2025-10-24	09:16:06	2025-10-07 06:49:04+00	2025-11-04 05:31:23+00	2025-10-07 12:24:04+00	approved	2025-10-25	10:44:41	5555555555	7800.00	1404.00	9204.00	paid	UPI	TRX-000042	INV-000042	2025-10-24 15:01:13+00	\N	\N	\N
43	BK20251010-000043	2	10	2025-11-01	08:36:44	2025-10-10 05:00:01+00	2025-11-04 05:39:16+00	\N	approved	2025-11-03	12:34:07	5555555555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
44	BK20251010-000044	2	29	2025-11-01	17:15:21	2025-10-10 05:00:26+00	2025-11-04 05:39:16+00	\N	approved	2025-11-04	19:36:34	7777777777	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
45	BK20251010-000045	2	26	2025-11-09	12:26:33	2025-10-10 05:00:48+00	2025-11-04 05:39:16+00	\N	approved	2025-11-11	14:20:28	3333333333	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3046	BK20250801-000001	19	10	2025-08-01	12:26:45	2025-07-24 18:30:00+00	2025-11-04 05:31:23+00	2025-07-25 00:05:00+00	approved	2025-08-02	13:52:40	5551234567	6200.00	310.00	6510.00	paid	UPI	TRX-003046	INV-003046	2025-08-01 23:18:33+00	\N	\N	\N
3047	BK20250801-000002	20	26	2025-08-01	16:54:04	2025-07-24 18:30:00+00	2025-11-04 05:31:23+00	2025-07-25 00:05:00+00	approved	2025-08-02	20:21:55	5559876543	7800.00	1404.00	9204.00	paid	UPI	TRX-003047	INV-003047	2025-08-01 21:42:53+00	Well maintained	\N	2
3048	BK20250801-000003	21	29	2025-08-01	09:10:07	2025-07-24 18:30:00+00	2025-11-04 06:42:25+00	2025-07-25 00:05:00+00	approved	2025-08-02	12:11:40	5551234567	7800.00	1404.00	9204.00	paid	UPI	TRX-003048	INV-003048	2025-08-01 09:11:50+00	Well maintained	\N	4
3051	BK20250802-000006	27	51	2025-08-02	11:32:58	2025-07-25 18:30:00+00	2025-11-04 05:31:23+00	2025-07-26 00:05:00+00	approved	2025-08-03	15:21:42	5555556666	1400.00	70.00	1470.00	paid	UPI	TRX-003051	INV-003051	2025-08-02 15:43:38+00	Well maintained	\N	3
3052	BK20250802-000007	28	52	2025-08-02	09:09:57	2025-07-25 18:30:00+00	2025-11-04 06:03:51+00	2025-07-26 00:05:00+00	approved	2025-08-03	10:24:54	5557778888	2200.00	110.00	2310.00	paid	UPI	TRX-003052	INV-003052	2025-08-02 00:09:47+00	Nice venue		2
3053	BK20250803-000008	29	10	2025-08-03	13:10:51	2025-07-26 18:30:00+00	2025-11-04 05:31:23+00	2025-07-27 00:05:00+00	approved	2025-08-04	15:59:23	5559990000	6200.00	310.00	6510.00	paid	UPI	TRX-003053	INV-003053	2025-08-03 10:48:46+00	\N	\N	\N
3055	BK20250803-000010	31	29	2025-08-03	14:29:25	2025-07-26 18:30:00+00	2025-11-04 06:05:46+00	\N	rejected	2025-08-04	15:32:54	5554445555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	error 	\N
3056	BK20250803-000011	32	45	2025-08-03	13:13:56	2025-07-26 18:30:00+00	2025-11-04 05:31:23+00	2025-07-27 00:05:00+00	approved	2025-08-04	16:37:54	5556667777	7600.00	1368.00	8968.00	paid	UPI	TRX-003056	INV-003056	2025-08-03 09:45:31+00	Well maintained	\N	1
3057	BK20250804-000012	19	50	2025-08-04	14:41:24	2025-07-27 18:30:00+00	2025-11-04 06:07:20+00	\N	cancelled	2025-08-05	18:30:50	5551234567	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3058	BK20250804-000013	20	51	2025-08-04	15:45:12	2025-07-27 18:30:00+00	2025-11-04 05:31:23+00	2025-07-28 00:05:00+00	approved	2025-08-05	17:40:28	5559876543	1400.00	70.00	1470.00	paid	UPI	TRX-003058	INV-003058	2025-08-04 09:22:42+00	average room	\N	2
3059	BK20250804-000014	21	52	2025-08-04	16:41:49	2025-07-27 18:30:00+00	2025-11-04 05:39:16+00	\N	rejected	2025-08-05	19:49:52	5551234567	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	Double booking	\N
3060	BK20250805-000015	25	10	2025-08-05	08:13:28	2025-07-28 18:30:00+00	2025-11-04 06:07:20+00	2025-07-29 00:05:00+00	approved	2025-08-06	11:07:55	5551112222	6200.00	310.00	6510.00	paid	UPI	TRX-003060	INV-003060	2025-08-05 10:58:35+00	Spacious room		2
3061	BK20250805-000016	26	26	2025-08-05	13:01:56	2025-07-28 18:30:00+00	2025-11-04 06:07:57+00	2025-07-29 00:05:00+00	approved	2025-08-06	14:10:03	5553334444	7800.00	1404.00	9204.00	paid	UPI	TRX-003061	INV-003061	2025-08-05 00:19:36+00	Spacious room		5
3062	BK20250805-000017	27	29	2025-08-05	12:29:18	2025-07-28 18:30:00+00	2025-11-04 06:09:25+00	2025-07-29 00:05:00+00	approved	2025-08-06	14:26:31	5555556666	7800.00	1404.00	9204.00	paid	UPI	TRX-003062	INV-003062	2025-08-05 00:21:40+00	Nice venue	\N	5
3063	BK20250805-000018	28	45	2025-08-05	15:20:40	2025-07-28 18:30:00+00	2025-11-04 05:31:23+00	2025-07-29 00:05:00+00	approved	2025-08-06	17:42:26	5557778888	7600.00	1368.00	8968.00	paid	UPI	TRX-003063	INV-003063	2025-08-05 07:28:28+00	Good experience	\N	1
3065	BK20250806-000020	30	51	2025-08-06	12:15:12	2025-07-29 18:30:00+00	2025-11-04 06:09:25+00	2025-07-30 00:05:00+00	approved	2025-08-07	13:55:42	5550009999	1400.00	70.00	1470.00	paid	UPI	TRX-003065	INV-003065	2025-08-06 22:17:36+00	Well maintained	\N	5
3086	BK20251025-000301	25	52	2025-10-25	09:29:44	2025-10-17 18:30:00+00	2025-11-04 06:09:25+00	\N	cancelled	2025-10-26	11:00:48	5551112222	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3087	BK20251026-000302	26	10	2025-10-26	12:43:01	2025-10-18 18:30:00+00	2025-11-04 05:31:23+00	2025-10-19 00:05:00+00	approved	2025-10-27	14:16:52	5553334444	6200.00	310.00	6510.00	paid	UPI	TRX-003087	INV-003087	2025-10-26 04:02:41+00	Good experience	\N	4
3088	BK20251026-000303	27	26	2025-10-26	17:05:57	2025-10-18 18:30:00+00	2025-11-04 06:10:17+00	2025-10-19 00:05:00+00	approved	2025-10-27	19:21:59	5555556666	7800.00	1404.00	9204.00	paid	UPI	TRX-003088	INV-003088	2025-10-26 07:27:25+00	Spacious room	\N	4
3089	BK20251026-000304	28	29	2025-10-26	09:20:40	2025-10-18 18:30:00+00	2025-11-04 06:10:17+00	2025-10-19 00:05:00+00	approved	2025-10-27	11:59:19	5557778888	7800.00	1404.00	9204.00	paid	UPI	TRX-003089	INV-003089	2025-10-26 16:11:54+00	Well maintained		1
3090	BK20251026-000305	29	45	2025-10-26	17:25:32	2025-10-18 18:30:00+00	2025-11-04 05:31:23+00	2025-10-19 00:05:00+00	approved	2025-10-27	19:50:40	5559990000	7600.00	1368.00	8968.00	paid	UPI	TRX-003090	INV-003090	2025-10-26 23:04:31+00	Spacious room	\N	4
3092	BK20251027-000307	31	51	2025-10-27	15:11:46	2025-10-19 18:30:00+00	2025-11-04 06:15:26+00	2025-10-20 00:05:00+00	approved	2025-10-28	16:45:11	5554445555	1400.00	70.00	1470.00	paid	UPI	TRX-003092	INV-003092	2025-10-27 08:12:58+00	\N	\N	\N
3093	BK20251027-000308	32	52	2025-10-27	14:41:47	2025-10-19 18:30:00+00	2025-11-04 05:31:23+00	2025-10-20 00:05:00+00	approved	2025-10-28	17:59:34	5556667777	2200.00	110.00	2310.00	paid	UPI	TRX-003093	INV-003093	2025-10-27 06:30:37+00	Good experience	\N	5
3094	BK20251028-000309	19	10	2025-10-28	09:53:40	2025-10-20 18:30:00+00	2025-11-04 05:31:23+00	2025-10-21 00:05:00+00	approved	2025-10-29	11:42:23	5551234567	6200.00	310.00	6510.00	paid	UPI	TRX-003094	INV-003094	2025-10-28 15:24:01+00	\N	\N	\N
3095	BK20251028-000310	20	26	2025-10-28	17:22:58	2025-10-20 18:30:00+00	2025-11-04 05:31:23+00	2025-10-21 00:05:00+00	approved	2025-10-29	18:33:10	5559876543	7800.00	1404.00	9204.00	paid	UPI	TRX-003095	INV-003095	2025-10-28 22:38:20+00	Spacious room	\N	4
3097	BK20251028-000312	25	45	2025-10-28	16:00:22	2025-10-20 18:30:00+00	2025-11-04 05:31:23+00	2025-10-21 00:05:00+00	approved	2025-10-29	17:34:05	5551112222	7600.00	1368.00	8968.00	paid	UPI	TRX-003097	INV-003097	2025-10-28 18:54:10+00	Good experience	\N	2
3099	BK20251029-000314	27	51	2025-10-29	15:40:26	2025-10-21 18:30:00+00	2025-11-04 06:19:21+00	\N	cancelled	2025-10-30	16:49:17	5555556666	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3101	BK20251030-000316	29	10	2025-10-30	11:44:49	2025-10-22 18:30:00+00	2025-11-04 05:31:23+00	2025-10-23 00:05:00+00	approved	2025-10-31	13:29:42	5559990000	6200.00	310.00	6510.00	paid	UPI	TRX-003101	INV-003101	2025-10-30 03:12:36+00	Well maintained	\N	1
3102	BK20251030-000317	30	26	2025-10-30	08:40:26	2025-10-22 18:30:00+00	2025-11-04 06:20:45+00	\N	cancelled	2025-10-31	10:18:00	5550009999	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3105	BK20251027-003105	20	50	2025-10-27	14:44:10	2025-10-27 11:32:29+00	2025-11-04 05:31:23+00	2025-10-27 17:07:29+00	approved	2025-10-28	16:50:14	5555555555	2400.00	120.00	2520.00	paid	UPI	TRX-003105	INV-003105	2025-11-04 11:01:23+00	\N	\N	\N
3106	BK20251027-003106	20	50	2025-10-31	15:48:24	2025-10-27 11:32:43+00	2025-11-04 05:31:23+00	2025-10-27 17:07:43+00	approved	2025-11-01	17:39:24	5555555555	2400.00	120.00	2520.00	paid	UPI	TRX-003106	INV-003106	2025-10-31 10:21:29+00	baaddddd	\N	\N
3107	BK20251029-003107	20	52	2025-12-01	16:49:31	2025-10-29 09:26:01+00	2025-11-04 05:31:23+00	2025-10-29 15:01:01+00	approved	2025-12-05	18:46:22	1111111111	5500.00	275.00	5775.00	paid	UPI	TXN-1762234283-812	INV-1762234283-982	2025-11-04 11:01:23+00	\N	\N	\N
3108	BK20251029-003108	20	50	2025-11-14	08:42:24	2025-10-29 10:01:13+00	2025-11-04 05:31:23+00	2025-10-29 15:36:13+00	approved	2025-11-15	11:53:38	1111111111	2400.00	120.00	2520.00	paid	UPI	TXN-1762234283-474	INV-1762234283-426	2025-11-04 11:01:23+00	\N	\N	\N
3110	BK20251030-003110	20	26	2025-11-03	12:15:00	2025-10-30 07:05:26+00	2025-11-04 06:41:30+00	2025-10-30 12:40:26+00	approved	2025-11-03	12:46:00	0000000000	3900.00	195.00	4095.00	paid	UPI	TXN-1762234283-708	INV-1762234283-264	2025-11-04 11:01:23+00	nice	\N	1
3114	BK20251030-003114	20	26	2025-11-07	08:00:00	2025-10-30 07:30:13+00	2025-11-03 06:41:17+00	\N	cancelled	2025-11-07	14:00:00	2222222222	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3115	BK20251030-003115	20	26	2025-11-05	11:45:00	2025-10-30 07:47:32+00	2025-11-03 06:41:14+00	\N	cancelled	2025-11-05	19:49:00	5555555555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	\N	\N
3116	BK20251103-003116	20	29	2025-11-24	14:30:00	2025-11-03 11:26:14+00	2025-11-04 05:39:16+00	\N	rejected	2025-11-25	22:27:00	5555555555	0.00	0.00	0.00	unpaid	UPI	\N	\N	\N	\N	Payment window expired (2 hours)	\N
3117	BK20251103-003117	20	29	2025-11-24	05:30:00	2025-11-03 11:33:08+00	2025-11-04 05:31:23+00	2025-11-03 17:04:35+00	approved	2025-11-25	05:30:00	5555555555	7800.00	1404.00	9204.00	paid	UPI	TXN-1762234283-195	INV-1762234283-184	2025-11-04 11:01:23+00	\N	\N	\N
3118	BK20251103-003118	20	52	2025-12-15	07:00:00	2025-11-03 12:29:05+00	2025-11-04 05:31:23+00	2025-11-03 17:59:30+00	approved	2025-12-24	23:30:00	5555555555	11000.00	1980.00	12980.00	paid	UPI	TXN-1762173131048-929	INV-1762173131048-592	2025-11-03 18:02:11+00	\N	\N	\N
3120	BK20251104-003120	20	50	2025-12-01	14:30:00	2025-11-04 04:54:08+00	2025-11-04 04:55:28+00	2025-11-04 10:24:43+00	approved	2025-12-10	16:01:00	5555555555	12000.00	2160.00	14160.00	paid	UPI	TXN-1762232128193-417	INV-1762232128193-235	2025-11-04 10:25:28+00	\N	\N	\N
\.


--
-- Data for Name: capacities; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.capacities (id, capacity, hidden) FROM stdin;
2	20	f
3	50	f
4	80	f
5	100	f
9	15	f
13	25	f
14	5	f
23	1	t
26	2	f
27	10	f
29	30	f
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.features (id, name, hidden) FROM stdin;
2	Projector	f
4	Smart Board	f
5	Web	f
6	LED Screen	f
7	TV	f
8	Speakers	f
9	Whiteboard	f
10	Flipchart	f
11	Microphones	f
12	Wi-Fi	f
14	Podium	f
15	Stage	f
16	Lighting Control	f
17	Heating	f
20	mic	f
22	Revolving Chair	f
23	Ac	f
\.


--
-- Data for Name: room_features; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.room_features (room_id, feature_id) FROM stdin;
10	10
10	11
10	20
26	4
26	14
29	14
29	16
45	2
45	4
45	5
45	6
45	7
45	8
45	9
45	10
45	11
45	12
45	14
45	15
45	17
45	20
45	22
45	23
50	4
50	6
50	14
50	22
50	23
51	4
51	7
51	11
51	14
52	4
52	6
52	14
52	23
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.rooms (id, name, available_from, image, capacity_id, created_at, updated_at, location, price, feedback) FROM stdin;
10	hall 11	2025-09-12	36513955284de49edb3c154d588cf871	5	2025-09-04 10:06:46+00	2025-09-24 07:06:07+00	Floor 1, Room A	3100.00	\N
26	conference room	2025-09-23	c8598cd8387db109a97979ab74fa0c5c	27	2025-09-22 11:58:11+00	2025-10-16 05:46:40+00	cd	3900.00	\N
29	da	2025-09-23	ac01d7f5ecedbb9f48b530b008119abd	27	2025-09-23 12:27:10+00	2025-09-23 12:27:10+00	sfsaf	3900.00	\N
45	hall 1	2025-10-15	7ae4a323819bcdd0cba94b884a29f69b	3	2025-10-15 12:07:32+00	2025-10-16 05:46:27+00	Room A, Floor 2nd, Administrative Block	3800.00	\N
50	hall 2	2025-10-16	2d73dc11e6ea3b5f3c23592dcaabc0c1	29	2025-10-16 05:44:43+00	2025-10-16 05:44:43+00	Floor 1, Room B4	1200.00	\N
51	hall 3	2025-10-24	c8eaf3b4657e2400c4c8431021781c38	4	2025-10-16 05:45:19+00	2025-10-16 05:45:19+00	Floor 2, Room B5	700.00	\N
52	Hall 4	2025-10-24	05abc77279ac77319eb70b6cfea72638	9	2025-10-16 05:46:07+00	2025-10-16 05:46:07+00	Floor 2, Room F5	1100.00	\N
\.


--
-- Data for Name: support_ticket; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.support_ticket (id, user_id, subject, description, status, priority, created_at, updated_at) FROM stdin;
1	20	first	\N	resolved	medium	2025-09-22 15:52:30+00	2025-09-24 12:37:03+00
2	20	secnsa	\N	pending	medium	2025-09-22 16:26:45+00	2025-10-27 18:29:03+00
3	20	ssasa	\N	resolved	medium	2025-09-22 16:49:51+00	2025-09-22 17:10:21+00
4	20	rfawr	\N	open	medium	2025-09-22 17:17:33+00	2025-09-22 17:17:33+00
5	20	sasdada	\N	open	medium	2025-09-22 17:18:40+00	2025-09-22 17:18:40+00
\.


--
-- Data for Name: ticket_message; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.ticket_message (id, ticket_id, sender_id, sender_type, message, created_at) FROM stdin;
1	1	20	\N	help	2025-09-22 15:52:38+00
2	1	2	\N	yes	2025-09-22 16:19:20+00
3	1	20	\N	can you	2025-09-22 16:21:14+00
4	1	2	\N	no	2025-09-22 16:25:16+00
5	1	20	\N	hgj	2025-09-22 16:25:40+00
6	3	20	\N	gdsfs	2025-09-22 16:49:55+00
7	2	20	\N	dsfdsf	2025-09-22 16:50:00+00
8	2	2	\N	gggd	2025-09-22 16:56:16+00
9	3	2	\N	sdda	2025-09-22 17:00:19+00
10	1	2	\N	uugig	2025-09-22 17:06:54+00
11	1	20	\N	fgdfg	2025-09-22 17:14:34+00
12	3	20	\N	hhk	2025-09-22 17:14:39+00
13	4	2	\N	bcv	2025-09-24 12:37:15+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: conference_booking; Owner: pguser
--

COPY conference_booking.users (id, name, email, password, role, created_at, updated_at, avatar_url, lastlogin, isrestrict) FROM stdin;
2	adminuser3	admin@example.com	$2b$10$hQHZQGGkzmdHiQYxZOX3DuRKp7bngRqJ8d03qpm1tb.BAmjqYPPtm	admin	2025-09-04 09:26:19+00	2025-11-04 05:40:53+00	\N	2025-11-04 05:40:53+00	f
19	amrendera	at@gmail.com	$2b$10$aXNC53WRPdVz1Bl6vdivluUbYBwchldSKvRAcfkxKvIJ/wRn4ehpC	user	2025-09-05 05:19:42+00	2025-09-05 05:19:42+00	\N	\N	\N
20	aryan	ast@gmail.com	$2b$10$2bIdqaGEzaJEEUrhogsR5uMd9Dn75oprxdjvWMslX1QVRukjrskOa	user	2025-09-05 09:02:13+00	2025-11-04 06:49:32+00	\N	2025-11-04 06:49:32+00	f
21	aa	aa@gmail.com	$2b$10$uY7PY0yxW6Pjw0AMEHahPeiDksF1SYojivQ7hXI1Szq5D45ODTZKu	user	2025-09-10 10:22:53+00	2025-09-24 12:25:14+00	\N	\N	f
25	shyam	sh@gmail.com	$2b$10$v9dNG8sq7tcWByxrVtLFq.b4MeAWCIIDeMDXgB8OfY.oVfTu1YZHe	user	2025-09-24 11:00:53+00	2025-09-24 12:25:12+00	\N	\N	f
26	user1	user1@gamil.com	$2b$10$FLPplof.l9kSfchDrH9r7.wd.cJGQaACH9S0cv.M.imxLD52BcUOq	user	2025-09-30 09:45:06+00	2025-09-30 11:31:14+00	\N	2025-09-30 11:31:14+00	\N
27	user2	user2@gamil.com	$2b$10$z4sWlsg3ulnBVyVkgLAI4eAfPWPDW/bC79W/Ag.ZAEKM/f5aFtIm6	user	2025-09-30 09:46:29+00	2025-09-30 09:48:50+00	\N	2025-09-30 09:48:50+00	\N
28	John Doe	john@example.com	$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab	user	2025-08-01 04:30:00+00	2025-08-01 04:30:00+00	\N	2025-08-10 02:30:00+00	f
29	Jane Smith	jane@example.com	$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab	user	2025-08-02 04:00:00+00	2025-08-10 04:00:00+00	\N	2025-08-15 06:15:00+00	f
30	Alice	alice@example.com	$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab	admin	2025-08-05 02:40:00+00	2025-08-20 06:30:00+00	\N	2025-09-10 08:30:00+00	f
31	Bob	bob@example.com	$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab	user	2025-08-10 08:45:00+00	2025-09-05 03:30:00+00	\N	2025-09-07 04:30:00+00	f
32	Charlie	charlie@example.com	$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab	user	2025-09-01 06:15:00+00	2025-10-10 03:00:00+00	\N	2025-10-10 03:00:00+00	f
34	a           	f@d.com	$2b$10$iJC59wHGIelgro5JYDh9W.Qtcf5KQNR3mp2DVCqNMrLAJA3bLphVW	user	2025-10-29 11:40:52+00	2025-10-29 11:40:52+00	\N	\N	\N
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.bookings_id_seq', 3120, true);


--
-- Name: capacities_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.capacities_id_seq', 29, true);


--
-- Name: features_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.features_id_seq', 23, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.rooms_id_seq', 52, true);


--
-- Name: support_ticket_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.support_ticket_id_seq', 5, true);


--
-- Name: ticket_message_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.ticket_message_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: conference_booking; Owner: pguser
--

SELECT pg_catalog.setval('conference_booking.users_id_seq', 34, true);


--
-- Name: bookings idx_16440_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.bookings
    ADD CONSTRAINT idx_16440_primary PRIMARY KEY (id);


--
-- Name: capacities idx_16458_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.capacities
    ADD CONSTRAINT idx_16458_primary PRIMARY KEY (id);


--
-- Name: features idx_16464_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.features
    ADD CONSTRAINT idx_16464_primary PRIMARY KEY (id);


--
-- Name: rooms idx_16470_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.rooms
    ADD CONSTRAINT idx_16470_primary PRIMARY KEY (id);


--
-- Name: room_features idx_16480_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.room_features
    ADD CONSTRAINT idx_16480_primary PRIMARY KEY (room_id, feature_id);


--
-- Name: support_ticket idx_16484_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.support_ticket
    ADD CONSTRAINT idx_16484_primary PRIMARY KEY (id);


--
-- Name: ticket_message idx_16495_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.ticket_message
    ADD CONSTRAINT idx_16495_primary PRIMARY KEY (id);


--
-- Name: users idx_16503_primary; Type: CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.users
    ADD CONSTRAINT idx_16503_primary PRIMARY KEY (id);


--
-- Name: idx_16440_booking_ref; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE UNIQUE INDEX idx_16440_booking_ref ON conference_booking.bookings USING btree (booking_ref);


--
-- Name: idx_16440_fk_room; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16440_fk_room ON conference_booking.bookings USING btree (room_id);


--
-- Name: idx_16440_idx_bookings_user_id; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16440_idx_bookings_user_id ON conference_booking.bookings USING btree (user_id);


--
-- Name: idx_16458_capacity; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE UNIQUE INDEX idx_16458_capacity ON conference_booking.capacities USING btree (capacity);


--
-- Name: idx_16464_name; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE UNIQUE INDEX idx_16464_name ON conference_booking.features USING btree (name);


--
-- Name: idx_16470_idx_rooms_capacity_id; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16470_idx_rooms_capacity_id ON conference_booking.rooms USING btree (capacity_id);


--
-- Name: idx_16470_unique_room_name; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE UNIQUE INDEX idx_16470_unique_room_name ON conference_booking.rooms USING btree (name);


--
-- Name: idx_16480_feature_id; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16480_feature_id ON conference_booking.room_features USING btree (feature_id);


--
-- Name: idx_16480_idx_room_features_map_room_id; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16480_idx_room_features_map_room_id ON conference_booking.room_features USING btree (room_id);


--
-- Name: idx_16484_user_id; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16484_user_id ON conference_booking.support_ticket USING btree (user_id);


--
-- Name: idx_16495_ticket_id; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE INDEX idx_16495_ticket_id ON conference_booking.ticket_message USING btree (ticket_id);


--
-- Name: idx_16503_email; Type: INDEX; Schema: conference_booking; Owner: pguser
--

CREATE UNIQUE INDEX idx_16503_email ON conference_booking.users USING btree (email);


--
-- Name: bookings on_update_current_timestamp; Type: TRIGGER; Schema: conference_booking; Owner: pguser
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON conference_booking.bookings FOR EACH ROW EXECUTE FUNCTION conference_booking.on_update_current_timestamp_bookings();


--
-- Name: rooms on_update_current_timestamp; Type: TRIGGER; Schema: conference_booking; Owner: pguser
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON conference_booking.rooms FOR EACH ROW EXECUTE FUNCTION conference_booking.on_update_current_timestamp_rooms();


--
-- Name: support_ticket on_update_current_timestamp; Type: TRIGGER; Schema: conference_booking; Owner: pguser
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON conference_booking.support_ticket FOR EACH ROW EXECUTE FUNCTION conference_booking.on_update_current_timestamp_support_ticket();


--
-- Name: users on_update_current_timestamp; Type: TRIGGER; Schema: conference_booking; Owner: pguser
--

CREATE TRIGGER on_update_current_timestamp BEFORE UPDATE ON conference_booking.users FOR EACH ROW EXECUTE FUNCTION conference_booking.on_update_current_timestamp_users();


--
-- Name: rooms fk_capacity; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.rooms
    ADD CONSTRAINT fk_capacity FOREIGN KEY (capacity_id) REFERENCES conference_booking.capacities(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: bookings fk_room; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.bookings
    ADD CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES conference_booking.rooms(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: bookings fk_user; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.bookings
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES conference_booking.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: room_features room_features_ibfk_1; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.room_features
    ADD CONSTRAINT room_features_ibfk_1 FOREIGN KEY (room_id) REFERENCES conference_booking.rooms(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: room_features room_features_ibfk_2; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.room_features
    ADD CONSTRAINT room_features_ibfk_2 FOREIGN KEY (feature_id) REFERENCES conference_booking.features(id) ON UPDATE RESTRICT ON DELETE CASCADE;


--
-- Name: support_ticket support_ticket_ibfk_1; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.support_ticket
    ADD CONSTRAINT support_ticket_ibfk_1 FOREIGN KEY (user_id) REFERENCES conference_booking.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: ticket_message ticket_message_ibfk_1; Type: FK CONSTRAINT; Schema: conference_booking; Owner: pguser
--

ALTER TABLE ONLY conference_booking.ticket_message
    ADD CONSTRAINT ticket_message_ibfk_1 FOREIGN KEY (ticket_id) REFERENCES conference_booking.support_ticket(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict kZQbEYhu8HZHT66rXu6ldYyfdouv9JpGny9nwyXUrV0EDbRk9lJejLddgNAPBdi

