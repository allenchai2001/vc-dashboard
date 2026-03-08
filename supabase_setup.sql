-- SQL to create the sales_data table in Supabase

create table sales_data (
  id bigint primary key generated always as identity,
  date date not null,
  order_id text not null,
  product text not null,
  channel text not null,
  revenue decimal not null,
  profit decimal not null,
  created_at timestamp with time zone default now()
);

-- Index for common filters
create index idx_sales_data_date on sales_data(date);
create index idx_sales_data_product on sales_data(product);
create index idx_sales_data_channel on sales_data(channel);

-- Insert sample data
insert into sales_data (date, order_id, product, channel, revenue, profit)
values 
('2024-01-01', 'ORD-001', 'Premium Gadget', 'Direct', 1200, 400),
('2024-01-01', 'ORD-002', 'Standard Widget', 'Social', 300, 100),
('2024-01-02', 'ORD-003', 'Premium Gadget', 'Direct', 1200, 400),
('2024-01-02', 'ORD-004', 'Basic Tool', 'Email', 150, 50),
('2024-01-03', 'ORD-005', 'Standard Widget', 'Organic', 300, 100);
