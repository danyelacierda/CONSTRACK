/**
 * CONSTRACK Supabase Schema — Task 3.5
 * 
 * Tables for Phase 1: vehicles, equipment, drivers, projects, vehicle_assignments,
 * trips, fuel_requests, fuel_transactions, maintenance_tickets, anomalies, audit_logs
 */

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ─── PROJECTS ───────────────────────────────────────────────────
create table if not exists projects (
  id text primary key,
  code text not null unique,
  name text not null,
  description text not null default '',
  location text not null default '',
  status text not null check (status in ('Planning','Active','On Hold','Completed','Cancelled')),
  start_date date not null,
  end_date date,
  budget_php numeric(15,2) not null default 0,
  spent_php numeric(15,2) not null default 0,
  client_name text not null default '',
  project_manager_id text,
  geofence_latitude numeric(9,6),
  geofence_longitude numeric(9,6),
  geofence_radius_km numeric(6,2),
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── VEHICLES ───────────────────────────────────────────────────
create table if not exists vehicles (
  id text primary key,
  plate_number text not null unique,
  name text not null,
  type text not null check (type in ('Dump Truck','Transit Mixer','Flatbed','Utility Vehicle','Pickup','Crane Truck','Water Tanker')),
  status text not null check (status in ('Active','Under Maintenance','Idle','Decommissioned')),
  fuel_type text not null check (fuel_type in ('Diesel','Gasoline','Premium')),
  tank_capacity_liters numeric(8,2) not null default 0,
  current_fuel_liters numeric(8,2) not null default 0,
  odometer_km numeric(10,2) not null default 0,
  engine_hours numeric(10,2) not null default 0,
  make text not null default '',
  model text not null default '',
  year integer not null,
  current_project_id text references projects(id),
  current_driver_id text,
  photo_url text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── EQUIPMENT ──────────────────────────────────────────────────
create table if not exists equipment (
  id text primary key,
  asset_code text not null unique,
  name text not null,
  type text not null check (type in ('Excavator','Backhoe','Loader','Bulldozer','Compactor','Generator','Pump','Scaffolding')),
  status text not null check (status in ('Active','Under Maintenance','Idle','Decommissioned')),
  fuel_type text check (fuel_type in ('Diesel','Gasoline','Premium')),
  tank_capacity_liters numeric(8,2),
  current_fuel_liters numeric(8,2),
  engine_hours numeric(10,2) not null default 0,
  make text not null default '',
  model text not null default '',
  year integer not null,
  current_project_id text references projects(id),
  photo_url text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── DRIVERS ────────────────────────────────────────────────────
create table if not exists drivers (
  id text primary key,
  employee_id text not null unique,
  first_name text not null,
  last_name text not null,
  full_name text not null,
  license_number text not null unique,
  license_expiry date not null,
  contact_number text not null default '',
  email text,
  status text not null check (status in ('Active','On Leave','Inactive','Suspended')),
  current_vehicle_id text references vehicles(id),
  photo_url text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for driver lookup on vehicles
create index if not exists idx_vehicles_driver on vehicles(current_driver_id);

-- ─── VEHICLE ASSIGNMENTS ────────────────────────────────────────
create table if not exists vehicle_assignments (
  id text primary key,
  vehicle_id text not null references vehicles(id),
  driver_id text not null references drivers(id),
  project_id text not null references projects(id),
  status text not null check (status in ('Active','Completed','Cancelled')),
  start_date timestamptz not null,
  end_date timestamptz,
  notes text not null default '',
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── TRIPS ──────────────────────────────────────────────────────
create table if not exists trips (
  id text primary key,
  vehicle_id text not null references vehicles(id),
  driver_id text not null references drivers(id),
  project_id text not null references projects(id),
  status text not null check (status in ('Scheduled','In Progress','Completed','Cancelled')),
  origin text not null,
  destination text not null,
  purpose text not null default '',
  scheduled_start timestamptz not null,
  scheduled_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  odometer_start_km numeric(10,2),
  odometer_end_km numeric(10,2),
  distance_km numeric(8,2),
  fuel_used_liters numeric(8,2),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── FUEL REQUESTS ──────────────────────────────────────────────
create table if not exists fuel_requests (
  id text primary key,
  request_number text not null unique,
  vehicle_id text not null references vehicles(id),
  driver_id text not null references drivers(id),
  project_id text not null references projects(id),
  status text not null check (status in ('Draft','Pending Approval','Approved','Rejected','Purchased','Verified','Cancelled')),
  fuel_type text not null check (fuel_type in ('Diesel','Gasoline','Premium')),
  requested_liters numeric(8,2) not null,
  estimated_cost_php numeric(10,2) not null,
  purpose text not null default '',
  requested_by text not null,
  approved_by text,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── FUEL TRANSACTIONS ──────────────────────────────────────────
create table if not exists fuel_transactions (
  id text primary key,
  transaction_number text not null unique,
  fuel_request_id text not null references fuel_requests(id),
  vehicle_id text not null references vehicles(id),
  driver_id text not null references drivers(id),
  project_id text not null references projects(id),
  status text not null check (status in ('Pending','Completed','Under Review','Disputed','Cancelled')),
  fuel_type text not null check (fuel_type in ('Diesel','Gasoline','Premium')),
  liters numeric(8,2) not null,
  price_per_liter_php numeric(8,2) not null,
  total_cost_php numeric(12,2) not null,
  station text not null,
  receipt_number text,
  receipt_image_url text,
  odometer_at_fill_km numeric(10,2) not null,
  transaction_date timestamptz not null,
  verified_by text,
  verified_at timestamptz,
  latitude numeric(9,6),
  longitude numeric(9,6),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── MAINTENANCE TICKETS ────────────────────────────────────────
create table if not exists maintenance_tickets (
  id text primary key,
  ticket_number text not null unique,
  vehicle_id text not null references vehicles(id),
  equipment_id text references equipment(id),
  project_id text references projects(id),
  status text not null check (status in ('Scheduled','In Progress','Completed','Cancelled','On Hold')),
  priority text not null check (priority in ('Low','Medium','High','Critical')),
  type text not null,
  description text not null default '',
  scheduled_date date not null,
  completed_date date,
  cost_php numeric(12,2) not null default 0,
  vendor text,
  odometer_at_service_km numeric(10,2),
  engine_hours_at_service numeric(10,2),
  next_service_due_km numeric(10,2),
  next_service_due_date date,
  next_service_due_hours numeric(10,2),
  assigned_to text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── ANOMALIES ──────────────────────────────────────────────────
create table if not exists anomalies (
  id text primary key,
  rule_code text not null,
  severity text not null check (severity in ('Low','Medium','High','Critical')),
  status text not null check (status in ('Open','Under Review','Dismissed','Confirmed Issue','Resolved')),
  description text not null,
  fuel_transaction_id text references fuel_transactions(id),
  vehicle_id text references vehicles(id),
  driver_id text references drivers(id),
  project_id text references projects(id),
  detected_at timestamptz not null default now(),
  reviewed_by text,
  reviewed_at timestamptz,
  resolution_notes text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── AUDIT LOGS ─────────────────────────────────────────────────
create table if not exists audit_logs (
  id text primary key,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  user_id text not null,
  user_name text not null,
  changes jsonb not null default '{}',
  ip_address text,
  timestamp timestamptz not null default now()
);

-- ─── INDEXES ────────────────────────────────────────────────────
create index if not exists idx_vehicles_project on vehicles(current_project_id);
create index if not exists idx_drivers_vehicle on drivers(current_vehicle_id);
create index if not exists idx_assignments_vehicle on vehicle_assignments(vehicle_id);
create index if not exists idx_assignments_project on vehicle_assignments(project_id);
create index if not exists idx_fuel_requests_project on fuel_requests(project_id);
create index if not exists idx_fuel_transactions_vehicle on fuel_transactions(vehicle_id);
create index if not exists idx_fuel_transactions_project on fuel_transactions(project_id);
create index if not exists idx_fuel_transactions_request on fuel_transactions(fuel_request_id);
create index if not exists idx_maintenance_vehicle on maintenance_tickets(vehicle_id);
create index if not exists idx_maintenance_project on maintenance_tickets(project_id);
create index if not exists idx_anomalies_status on anomalies(status);
create index if not exists idx_anomalies_transaction on anomalies(fuel_transaction_id);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_time on audit_logs(timestamp desc);
